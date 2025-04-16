#!/bin/bash

# Run client container to test NTP connection

docker run --rm --network host debian:stable-slim bash -c '
  apt-get update && apt-get install -y ntpdate && \
  ntpdate -q 127.0.0.1
'