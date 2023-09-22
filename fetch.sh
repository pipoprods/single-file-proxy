#!/bin/bash

source "$(dirname $0)/cgibashopts"

if [ ! -z "$FORM_url" ]; then
  echo "Content-type: text/html"
  echo
  cd /usr/src/app/node_modules/single-file-cli
  ./single-file --browser-executable-path /usr/bin/chromium-browser --output-directory ./../../out/ --browser-args [\"--no-sandbox\"] --dump-content $FORM_url
fi
