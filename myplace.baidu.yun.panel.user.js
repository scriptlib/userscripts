// ==UserScript==
// @name       myplace.baidu.yun.panel
// @namespace  eotect@myplace
// @version    0.2
// @description  enter something useful
// @include     http://pan.baidu.com/pcloud/friendpage*
// @include     http://pan.baidu.com/share/*
// @include     http://yun.baidu.com/pcloud/friendpage*
// @include     http://yun.baidu.com/share/*
// @copyright  2012+, eotect
// @grant none
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
    function ukFromUrl(href) {
        var r = href.match(/uk=(\d+)/);
        if(r) {
            return r[1];
        }
        return 0;
    }
    var href = document.location.href;
    var pageUK = ukFromUrl(href);
    var followsPage = "http://pan.baidu.com/pcloud/friendpage?type=follow&uk=" + pageUK;
    var fansPage = "http://pan.baidu.com/pcloud/friendpage?type=fans&uk=" + pageUK;
	var homePage = "http://pan.baidu.com/share/home?uk=" + pageUK;
    if($('#share_nofound_des').length || href.match(/\/pcloud\/friendpage/)) {		
        	$myPlace.panel.add($('<a href="/share/home?uk=' + pageUK + '">' + pageUK + '</a>')[0],1); 
	}
	$myPlace.panel.addSpace();
	
	if(unsafeWindow.FileUtils) {
		var f = unsafeWindow.FileUtils;
		if(f.linkUserName) {
				$myPlace.panel.addText(pageUK + '_' + f.linkUserName,1);
		}
	}

	$myPlace.panel.addLink(homePage,"Home",1);
    $myPlace.panel.addLink(followsPage,"Follows",1);
    $myPlace.panel.addLink(fansPage,"Fans");
    $myPlace.panel.show();
    
})();
