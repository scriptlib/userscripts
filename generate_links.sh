#!/bin/sh

dist="http://userscripts.webscrap.googlecode.com/git"
echo "<ol>Links" | tee links.html
ls -1 *.js *.css | xargs -l -n1 -i echo "<li><a href=\"$dist/{}\">{}</a></li>" | tee -a links.html
echo "</ol>" | tee -a links.html



