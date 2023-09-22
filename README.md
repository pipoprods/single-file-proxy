# single-file-proxy

Wrap [single-file-cli](https://github.com/gildas-lormeau/single-file-cli) into a Web server to use it as a proxy.

## Usage

```sh
$ docker build . -t single-file-proxy && docker run -p 8080:80 single-file-proxy
$ curl http://localhost:8080/?url=https://www.debian.org
```
