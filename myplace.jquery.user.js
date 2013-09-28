// ==UserScript==
// @name           myplace.jquery
// @namespace      eotect@myplace
// @description    $myPlace.jQuery
// @version		   1.11
// @include        *
// @require			http://code.jquery.com/jquery-1.10.2.min.js
// @require			http://code.jquery.com/ui/1.10.2/jquery-ui.min.js
// ==/UserScript==

if(!unsafeWindow) {
	unsafeWindow = window;
}
var $myPlace = $myPlace || unsafeWindow.$myPlace || {};
unsafeWindow.$myPlace = $myPlace;

(function(_){
	if(_.jQuery) {
		return;
	}
	else if($) {
		var csslink = document.createElement('link');
		csslink.href = "http://code.jquery.com/ui/1.10.2/themes/smoothness/jquery-ui.css";
		csslink.setAttribute('rel',"stylesheet");
		csslink.type ="text/css";
		$('head').append(csslink);
		_.jQuery = $;
		_.$ = $;
	}
	else {
		alert('Error loading $myPlace.jQuery.');
	}
})($myPlace);

