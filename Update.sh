#!/bin/sh
for i in *.user.js ; do
#	echo $i
	n=${i/.user.js/}
#	echo $n
	echo Update $i [../$n/$si]
	cp ../$n/$i .
done
