// ==UserScript==
// @name           myplace.notie
// @namespace      eotect@myplace
// @description    $myPlace.notie
// @version		   1.1
// @include        *
// @require			https://unpkg.com/notie
// @grant none
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

