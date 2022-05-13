#!/usr/bin/env sh
set -eu
envsubst '${RAP_SERVER}' < /etc/nginx/conf.d/nginx.conf.template > /etc/nginx/conf.d/nginx.conf
exec "$@"

