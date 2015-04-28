// ==UserScript==
// @name			myplace.mod.google
// @namespace		eotect@myplace
// @description		MyPlace Google Mod
// @include			*://www.google.*
// @include			*://google.*
// @version			1.02
// ==/UserScript==

if(!unsafeWindow) {
	unsafeWindow = window;
}
var $myPlace = $myPlace || unsafeWindow.$myPlace || {};
unsafeWindow.$myPlace = $myPlace;
var $ = unsafeWindow.$ || $myPlace.jQuery;
$myPlace.mod = $myPlace.mod || {};
var panel=$myPlace.panel;

(function(_){
	_.google = {
		fixLinks : function() {
			var hrefexp = new RegExp(/&q=(http:\/\/[^&]*)&ei/i);
			var sites = new Array(
				['fotop\\.net','snaapa.com'],
				['(sis001\\.com|67.220.92.23|67.220.91.20)','38.103.161.186'],
				['(sexinsex\\.net|64.120.179.165)','67.220.90.30'],
				['sejie\\.com','174.37.129.201']
			);
			var myexps = new Array();
			for(var i=0;i<sites.length;i++) {
				var exp1 = new RegExp("w[wv]w\\." + sites[i][0],'gi');
				var exp2 = new RegExp(sites[i][0],'gi');
				myexps.push([exp1,exp2,sites[i][1]]);
			}
			var count = myexps.length;
			var Links=document.getElementsByTagName("a");
			for (var i=0;i<Links.length;i++) {
				GM_log(Links[i].href);
				var href = Links[i].href;
				Links[i].setAttribute("onmousedown","");
				if(href){
					//href = href.replace(/^http/,'https');
					Links[i].href = href;
					var match = hrefexp.exec(href);
					if(match) {
						Links[i].href = unescape(match[1]);
					}
					for(var j=0;j<count;j++) {
							Links[i].href = Links[i].href.replace(myexps[j][0],myexps[j][2]);
							Links[i].href = Links[i].href.replace(myexps[j][1],myexps[j][2]);
					}
				}
			}
		},
		addClassicSwitch : function(){
			panel.addButton(
				{
					html	: ' #Standard',
					set		:  function() {
						document.location.href = document.location.href.replace(/&sout=1/gi,'');
					},
				},
				function() {
					return !document.location.href.match(/&sout=1/);
				},
				{
					html	: ' #Classic',
					set		: function() {
						document.location.href = document.location.href.replace('&','&sout=1&');
					},
				}
			);
		},
		addTorrentSwitch : function(){
			var torrent_text = '%E7%A7%8D%E5%AD%90+%E4%B8%8B%E8%BD%BD';
			var torrent_exp = '%E7%A7%8D%E5%AD%90\\+%E4%B8%8B%E8%BD%BD';
			panel.addButton(
				{
					html: ' +Torrent',
					set	: function() {
						document.location.href = 
							document.location.href.replace(/([&\?])q=([^&]+)/gi,'$1q=$2+' + torrent_text);
					}
				},
				function() {
					return document.location.href.match('[&\?]q=([^=]*)\\+(' + torrent_exp + ')');
				},
				{
					html: ' -Torrent',
					set	: function(element,test) {
						document.location.href = 
							document.location.href.replace(new RegExp('\\+' + torrent_exp,'gi'),'');
					}
				}
			);
		},
	};
	
	$myPlace.$(document).ready(function() {	
		_.google.fixLinks();		
	});
	_.google.addClassicSwitch();
	_.google.addTorrentSwitch();
	panel.show();
})($myPlace.mod);




