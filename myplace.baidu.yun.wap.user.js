// ==UserScript==
// @name        myplace.baidu.yun.wap
// @namespace   eotect@myplace
// @description myplace.baidu.yun.wap
// @include     http://pan.baidu.com/wap/*
// @include     http://yun.baidu.com/wap/*
// @include     https://pan.baidu.com/wap/*
// @include     https://yun.baidu.com/wap/*
// @version     1.03
// @grant       none
// ==/UserScript==

(function(){
    if(typeof unsafeWindow == 'undefined') {
    	var unsafeWindow = window;
        window.unsafeWindow = window;
    }
    if(typeof $myPlace == 'undefined') {
        var $myPlace = unsafeWindow.$myPlace;
    }
	var $ = $myPlace.jQuery;   
	var href = document.location.href;
	if(href) {
		var m = href.match(/(^https?:\/\/(?:pan|yun)\.baidu\.com)\/(?:wap\/share|wap)\/(.*)$/);
		if(m) {		
			$myPlace.panel.addLink(m[1] + "/share/" + m[2],'Desktop Version');
		}
	}
})();
