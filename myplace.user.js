// ==UserScript==
// @name           myplace
// @namespace      eotect@myplace
// @description    $myPlace
// @include        *
// @version		 	1.1
// @grant none
// ==/UserScript==


if(typeof unsafeWindow == 'undefined') {
    var unsafewindow  = window;
    window.unsafeWindow = window;
}
if(typeof $myPlace == 'undefined') {
	var $myPlace = unsafeWindow.$myPlace || {};
}
unsafeWindow.$myPlace = $myPlace;



(function(_){
	_._models = {};
	_.register = function(name,value){
		if(typeof _[name] == undefined) {
			_._models[name] = value;
		}
		else {
			throw new Error(name + " already defined.");
		}
	};
	_.service = function(name) {
		return _._models[name];
	};
	_.log = function(txt,mode) {
		if(console) {
			return console.log(txt);
		}
		else {
			alert(txt);
		}
	};
})($myPlace);

