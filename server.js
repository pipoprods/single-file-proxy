#!/usr/bin/env node

const debug = true;
const host = '0.0.0.0';
const port = 80;
const url_list = '/var/lib/single-file-proxy-hosts';

const { createServer } = require('http');
const { spawn } = require('child_process');
const { readFileSync } = require('fs');

/**
 * Extract host FQDN from URL
 *
 * @param {string} the HTTP(S) URL to parse
 *
 * @return {string} the extracted host
 */
function extract_host(url) {
  const re = /^http[s]?:\/\/([^\/]+)/;
  return re.exec(url)[1];
}

/**
 * Parse hosts list file
 *
 * @param {string} path to file
 *
 * @return {array} list of domains
 */
function parse_hosts_list(url_list) {
  try {
    const data = readFileSync(url_list, 'utf8');
    return data.split('\n').filter((e) => e !== '');
  } catch (err) {
    return [];
  }
}

/**
 * Check if an URL should be handled
 *
 * @param {string} an URL
 * @param {array} a list of hosts to handle
 *
 * @return {boolean} true if URL belongs to one of the hosts to handle
 */
function should_handle_url(url, hosts_to_handle) {
  const d = extract_host(url);
  return hosts_to_handle.includes(d);
}

const hosts_to_handle = parse_hosts_list(url_list);
const server = createServer(async (req, res) => {
  try {
    const url = req.url.substring(1);
    if (should_handle_url(url, hosts_to_handle)) {
      if (debug) {
        console.log(`fetching ${url}`);
      }

      const fetcher = spawn('/usr/src/app/node_modules/single-file-cli/single-file', [
        '--browser-executable-path',
        '/usr/bin/chromium-browser',
        '--output-directory',
        '/tmp/',
        '--browser-args',
        '["--no-sandbox"]',
        '--dump-content',
        url,
      ]);
      fetcher.stdout.on('data', (data) => {
        if (debug) {
          console.log('got data chunk');
        }
        res.write(data);
      });
      fetcher.stderr.on('data', (data) => {
        console.log(`stderr: ${data}`);
        res.writeHead(503);
        res.end();
      });
      fetcher.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
        res.writeHead(200);
        res.end();
      });
    } else {
      if (debug) {
        console.log(`redirecting to ${url}`);
      }
      res.writeHead(302, {
        location: url,
      });
      res.end();
    }
  } catch (e) {
    console.error(e);
    res.writeHead(503);
    res.end();
  }
});
server.listen(port, host, () => {
  if (debug) {
    console.log(`Server is running on http://${host}:${port}`);
  }
});
