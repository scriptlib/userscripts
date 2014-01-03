#!/bin/sh

dist="http://userscripts.webscrap.googlecode.com/git"
ls -1 *.js *.css | xargs -l -n1 -i echo "<a href=\"$dist/{}\">{}</a>" | tee links.html



