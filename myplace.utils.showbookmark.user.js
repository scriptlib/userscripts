// ==UserScript==
// @name        myplace.utils.showbookmark
// @namespace   eotect@myplace
// @description Bookmarks shower
// @include		*
// @version     1.04
// @grant	none
// ==/UserScript==

if(typeof unsafeWindow == 'undefined') {
    var unsafewindow  = window;
    window.unsafeWindow = window;
}
if(typeof $myPlace == 'undefined') {
	var $myPlace = unsafeWindow.$myPlace || {};
}
unsafeWindow.$myPlace = $myPlace;

$myPlace.register('utils',{
	showbookmark:	function(){
		var div,m,href = document.location.href;
		if(!href) {
			return;
		}
		m = href.match(/^(http[s:].+)#photo-url:(http[s:].+)$/);
		if(!m) {
			return;
		}
		div = '<div style="padding:20px;text-align="left">';
		div += '<h3><a href="' + m[1] + '">' + document.title + '</a></h3>';
		div += '<p><img src="' + m[2] + '"><br/></p>';
		div += 'source: <a href="' + m[1] + '">';
		div += m[1] + '</a>';
		document.body.innerHTML = div;
	},
}).showbookmark();


