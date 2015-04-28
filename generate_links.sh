#!/bin/sh

dist="http://bitbucket.org/eote/userscripts/raw/master"
echo "<html><body><ol>Links" | tee links.html
ls -1 *.js *.css | xargs -l -n1 -i echo "<li><a href=\"$dist/{}\">{}</a></li>" | tee -a links.html
echo "</ol></body></html>" | tee -a links.html



