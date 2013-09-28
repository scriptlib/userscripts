// ==UserScript==
// @name           myplace
// @namespace      eotect@myplace
// @description    $myPlace
// @include        *
// @version		 	1.0
// @grant			none
// ==/UserScript==
if(!unsafeWindow) {
	unsafeWindow = window;
}
var $myPlace = $myPlace || unsafeWindow.$myPlace || {};
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

