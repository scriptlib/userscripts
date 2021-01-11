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
	_.cookie = {
		set : function(cname, cvalue, exdays) {
			var d = new Date();
			d.setTime(d.getTime() + (exdays*24*60*60*1000));
			var expires = "expires="+d.toUTCString();
			document.cookie = cname + "=" + cvalue + "; " + expires;
		},
		get : function(cname) {
			var name = cname + "=";
			var ca = document.cookie.split(';');
			for(var i=0; i<ca.length; i++) {
				var c = ca[i];
				while (c.charAt(0)==' ') c = c.substring(1);
				if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
			}
			return "";
		},
	};
	_.config = {
			read	: function(key) {
				var r;
				var from;
				if(!unsafeWindow.localStorage) {
					from = 'Cookie';
					r = _.cookie.get(key);
				}
				else {
					from = 'localStorage';
					r = unsafeWindow.localStorage.getItem(key)
				}
				if(r) {
					r = r.replace(/\s+$/g,'');
				}
				console.log('Config.Read: [' + from + ']' + key + "=" + r)
				return r;
			},
			write	: function(key,value) {
				if(!unsafeWindow.localStorage) {
					console.log('Config.Write: [Cookie]' + key + "=" + value)
					return _.cookie.set(key,value,365000);
				}
				else {
					console.log('Config.Write: [localStorge]' + key + "=" + value)
					return unsafeWindow.localStorage.setItem(key,value)
				}
			}
	};
})($myPlace);

