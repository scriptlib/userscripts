// ==UserScript==
// @name           myplace
// @namespace      eotect@myplace
// @description    $myPlace
// @include        *
// @version		 	1.1
// @grant none
// @author			eotect@myplace
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
	_.register = function(name,obj){
		if(_[name] === undefined) {
            _[name] = {};
		}
		if(obj) {
			for(var p in obj ){
				_[name][p] = obj[p];
			}
		}
        return _[name];
	};
	_.unregister = function(name) {
		delete _[name];
	};
	_.replace = function(name,obj) {
		_[name] = obj;
	};
	_.log = function(txt,mode) {
		if(console) {
			console.log(txt);
		}
		else {
			alert(txt);
		}
	};
})($myPlace);

