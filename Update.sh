#!/bin/sh
if [ -z "$1" ] ; then
	echo "$0"
	echo "Usage:$0 [directory]"
	echo "    Copy *.js from specified directory"
	exit 0
fi
while [ -n "$1" ] ; do
	md=`date +"%Y-%m-%d %H:%M:%S"`
	echo -e "[$md] Copy files\n[$md] From directory: $1" | tee -a Update.log
	echo "-------------------------------------" | tee -a Update.log
	cp -v -- "$1"/*.js . 2>&1 | sed -e "s/'.*\/\(.*\)'/ \1/" | tee -a Update.log
	echo -e "\n" | tee -a Update.log
	shift
done
