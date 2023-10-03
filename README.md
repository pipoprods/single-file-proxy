# single-file-proxy

Wrap [single-file-cli](https://github.com/gildas-lormeau/single-file-cli) into a Web server to use it as a proxy.

## Building the image

```sh
$ docker build . -t single-file-proxy
```

## Usage

The proxy will scrape URLs that belong to declared hosts.
The host file should contain a list of FQDNs, one per line.
Example `hosts.txt` file:

```
www.debian.org
www.gnu.org
```

Run the service:

```sh
$ docker run -p 8080:80 -v $(pwd)/hosts.txt:/var/lib/single-file-proxy-hosts single-file-proxy
```

Fetch an URL:

```sh
$ curl http://localhost:8080/https://www.debian.org
```
