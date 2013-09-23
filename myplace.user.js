// ==UserScript==
// @name           myplace
// @namespace      eotect@myplace
// @description    $myPlace
// @include        *
// ==/UserScript==

$myPlace=unsafeWindow.$myPlace;
if(!$myPlace) {
  $myPlace = {};
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
})($myPlace);

