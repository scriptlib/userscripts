// ==UserScript==
// @name           myplace.jquery
// @namespace      eotect@myplace
// @description    $myPlace.jQuery
// @version		   1.14
// @include        *
// @require			https://code.jquery.com/jquery-1.10.2.min.js
// @require			https://code.jquery.com/ui/1.10.2/jquery-ui.min.js
// @run-at			document-start
// Changes log
//	2013-09-29
//		Remove @grant none, Run in sandbox.		
// ==/UserScript==

if(!unsafeWindow) {
	unsafeWindow = window;
}
var $myPlace = $myPlace || unsafeWindow.$myPlace || {};
unsafeWindow.$myPlace = $myPlace;

jQuery.noConflict();

(function(_){
	/*if(unsafeWindow.jQuery) {
		_.jQuery = unsafeWindow.jQuery;
		_.$ = unsafeWindow.jQuery;
		return;
	}
	*/
	if(_.jQuery) {
		return;
	}
	else if(jQuery) {
		var csslink = document.createElement('link');
		csslink.href = "https://code.jquery.com/ui/1.10.2/themes/smoothness/jquery-ui.css";
		csslink.setAttribute('rel',"stylesheet");
		csslink.type ="text/css";
		jQuery('head').append(csslink);
		_.jQuery = jQuery;
		//_.jQuery = cloneInto(jQuery,$myPlace);
		_.$ = _.jQuery;
		//alert('myplace.jquery:'  + $myPlace.jQuery.fn.jquery);
		//delete jQuery;
	}
	else {
		alert('Error loading $myPlace.jQuery.');
	}
})($myPlace);

