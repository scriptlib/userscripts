#!/bin/sh
for i in *.user.js ; do
#	echo $i
	n=${i/.user.js/}
#	echo $n
	echo Update $i [../$n/$i]
	cp ../$n/$i .
done
