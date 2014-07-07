#!/bin/sh
for i in *.user.js ; do
#	echo $i
	n=${i/.user.js/}
#	echo $n
	cp -v -- ../$n/*.js .
done
