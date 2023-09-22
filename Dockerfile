FROM capsulecode/singlefile:latest

USER root

RUN apk add --update mini_httpd bash grep sed coreutils
COPY mini-httpd.conf /etc/mini_httpd.conf

COPY fetch.sh /var/www/index.cgi
COPY cgibashopts /var/www/

USER nobody

EXPOSE 80

ENTRYPOINT [ "mini_httpd", "-C", "/etc/mini_httpd.conf", "-D" ]
