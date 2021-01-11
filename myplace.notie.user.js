// ==UserScript==
// @name           myplace.notie
// @namespace      eotect@myplace
// @description    $myPlace.notie
// @version		   1.0
// @include        *
// @require			https://raw.githubusercontent.com/jaredreich/notie.js/master/notie.js
// @grant none
// Changes log
//	2013-09-29
//		Remove @grant none, Run in sandbox.		
// ==/UserScript==

if(!unsafeWindow) {
	unsafeWindow = window;
}
var $myPlace = $myPlace || unsafeWindow.$myPlace || {};
unsafeWindow.$myPlace = $myPlace;


(function(_){
	if(_.notie) {
	}
	else if(notie) {
		_.notie = notie;
	}
	else {
		alert('Error loading $myPlace.notie.');
	}
})($myPlace);

