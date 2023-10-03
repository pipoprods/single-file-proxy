FROM capsulecode/singlefile:latest

USER nobody

EXPOSE 80

COPY server.js /usr/local/bin/
ENTRYPOINT [ "/usr/local/bin/server.js" ]
