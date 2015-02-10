#!/bin/sh

#Check if an argument is passed.  If no argument, use text.txt.

SFILENAME=test.txt

if [ ! -z "$1" ]
  then
    SFILENAME=$1
fi

echo $SFILENAME
rm $SFILENAME

while true

do
  DATE="$(date) $(cat /dev/urandom | tr -dc 'a-zA-Z ' | fold -w 128 | head -n 1)"
  echo $DATE | tee -a $SFILENAME
  sleep 0.01
done
