#!/bin/sh

rm test.txt

while true

do
  DATE="$(date) $(cat /dev/urandom | tr -dc 'a-zA-Z ' | fold -w 128 | head -n 1)"
  echo $DATE | tee -a test.txt
  sleep 0.5
done
