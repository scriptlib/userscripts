// ==UserScript==
// @name	myplace.magnet
// @description	Get magnet URL
// @namespace	eotect@myplace
// @version  1.0
// @grant    none
// @include https://*btshe.*/*.html

// ==/UserScript==

if(!unsafeWindow) {
	unsafeWindow = window;
}
var $myPlace = $myPlace || unsafeWindow.$myPlace || {};


(function(_){
  var href = document.location.href;
  var hashes = new Array();
  
  var hashurl_exp = new RegExp(/([a-fA-F0-9]{40})/);
  
  var r = hashurl_exp.exec(href);
  if(r) {
    hashes.push(r[1].toUpperCase());
  }
  
  var links = document.getElementsByTagName("a");
  for(var i=0;i<links.length;i++) {
  	var href = links[i].href;
    var r = hashurl_exp.exec(href);
    if(r) {
      hashes.push([links[i],r[1].toUpperCase(),links[i].text]);
    }
  }
  
  for(var i=0;i<hashes.length;i++) {
    if(typeof(hashes[i]) == "string") {
    	var murl = "magnet:?xt=urn:btih:" + hashes[i];
    	var mname = hashes[i].substr(0,8);
    	_.addLink(murl,mname,1);
    }
    else {           
      var n = document.createElement("a");
      n.href = "magnet:?xt=urn:btih:" + hashes[i][1] + (hashes[i][2] ? "&dn=" + hashes[i][2] : "");
      n.innerHTML = "</br>magnet_url_get:" + hashes[i][1].substr(0,8);
      hashes[i][0].parentNode.appendChild(n);
    }
  }
  
  
})($myPlace.panel);