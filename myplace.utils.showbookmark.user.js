// ==UserScript==
// @name        myplace.utils.showbookmark
// @namespace   eotect@myplace
// @description Bookmarks shower
// @include     http*#photo-url:http*
// @version     1
// ==/UserScript==
	var href = document.location.href;
	if(!href) return;
	var m = href.match(/^(http[s:].+)#photo-url:(http[s:].+)$/);
	if(!m) return;
	var div;// = document.createElement('div');
	div = '<div style="padding:20px;text-align="left">';
	div += '<h3><a href="' + m[1] + '">' + document.title + '</a></h3>';
	div += '<p><img src="' + m[2] + '"><br/></p>';
	div += 'source: <a href="' + m[1] + '">'
	div += m[1] + '</a>';
	document.body.innerHTML = div;
