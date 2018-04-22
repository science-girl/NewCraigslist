#!/bin/bash
echo 'kill running server'
ps | grep "[h]cdev" | awk '{if($1!="") {print "killing process: "$1; system("kill " $1)}}'
hcdev --no-nat-upnp --debug web &
