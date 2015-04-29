// ==UserScript==
// @name        myplace.sslib.search
// @namespace   eotect@myplace
// @description SSLIB Search Result Books Info
// @include     http://*/search.jsp?*&Field=*&fenleiID=*
// @include	    http://*/searchContent.jsp?*&Field=*&fenleiID=*
// @version     1
// @grant       none
// ==/UserScript==
if(typeof unsafeWindow == 'undefined') {
	var unsafeWindow = window;
}
if(typeof $myPlace == 'undefined') {
	var $myPlace = unsafeWindow.$myPlace || {};
}
if(typeof $myPlace.sslib == 'undefined') {
	$myPlace.sslib = {};
}
(function(d) {
	$ = $myPlace.jQuery;
	d.search = {
		getBooks : function() {
			var booksElm = $('table.book1');
			alert(booksElm.length);
		},
	}
	$(document).ready(d.search.getBooks);
})($myPlace.sslib)