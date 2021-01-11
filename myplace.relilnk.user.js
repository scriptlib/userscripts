// ==UserScript==
// @name        myplace.relilnk
// @namespace   eotect@myplace
// @description myplace.relilnk
// @include     http://*.7958.com/*
// @include     https://torrentproject.com/*/*torrent.html
// @include     http://torrentproject.com/*/*torrent.html
// @include		http://*bt.com/Item/*
// @include		https://*bt.com/Item/*
// @include		*kaisou.cc/Item/*
// @include		http://*weipai.cn/*
// @include	http://nikkanerog.com/*
// @include	http://panpilog.com/*
// @include 	http://www.erogazo-jp.net/*
// @include https://mitaohui.net/*
// @include http://mitaohui.net/*
// @include http://clickme.net/*
// @include https://clickme.net/*
// @include http://*.tumblr.com/*
// @include https://*.tumblr.com/*
// @include https://skrbt*.xyz/*
// @include http://skrbt*.xyz/*
// @include http://hjd.sdy2048.net/*
// @include https://hjd.sdy2048.net/*
// @version     1.1.3
// @grant       none
// @run-at document-end
// ==/UserScript==
if(typeof unsafeWindow == 'undefined') {
	var unsafeWindow = window;
}
if(typeof $myPlace == 'undefined') {
	var $myPlace = unsafeWindow.$myPlace || {};
}
if(typeof $myPlace.relink == 'undefined') {
	$myPlace.relink = {};
}
(function(){
  //alert("hi");
  var d = $myPlace.relink;
	var $ = $myPlace.jQuery;
	var DOC = window.document;
	var HREF = DOC.location.href;
	var LINKS = document.getElementsByTagName('a');
	var IMAGES = document.getElementsByTagName('img');
	
	d.elements = [];
	
	for(var i=0;i<LINKS.length;i++) {
    console.log(LINKS[i].href);
		d.elements.push(LINKS[i]);
	}
	for(var i=0;i<IMAGES.length;i++) {
		d.elements.push(IMAGES[i]);
	}
	
	d.sites = [];
	
	function start() {
		console.log('RELINK for ' + HREF);
		for(var i=0;i<d.sites.length;i++) {
			var s = d.sites[i];
			console.log('RELINK do ' + s.name);
			if(s.disable) {
				console.log('RELINK ' + s.name + ' disabled');
				continue;
			}
			else if(s.target) {
				if(!HREF.match(s.target)) {
					console.log('RELINK ' + s.name + ' not match');
					continue;
				}
			}
			else if(s.check && !s.check(HREF,DOC)) {
				continue;
			}
			console.log('myPlace.relink [' + s.name + ']');
			if(s.relinks) {
				s.relinks(d.elements,DOC);
			}
			else {
				for(var j=0;j<d.elements.length;j++) {
					if(s.relink(d.elements[i],DOC)) {
						break;
					}
				}
			}
		}
	}
	function A(target,relink) {
		var def = {target:target};
		def.name = target;
		
				
		var tf = typeof(relink);
    console.log('RELINK add definition for ' + def.name + ' ' + tf);
		if(tf == 'function') {
			def.relinks = function(links,doc) {
				for(var i=0;i<links.length;i++) {
					if(relink(links[i],doc)) {
						break;
					}
				}
			};
		}
		else if(tf == 'object' && relink.length) {
			def.relinks = function(links,doc) {
				for(var i=0;i<links.length;i++) {
					if(links[i].href) {
            //console.log(links[i].href);
            //console.log(relink[0]);
						links[i].href = links[i].href.replace(relink[0],relink[1]);
					}
					else if(links[i].src) {
						links[i].src = links[i].src.replace(relink[0],relink[1]);
					}
				}
			};
		}
		else {
			def.relinks = function(links,doc) {
				for(var i=0;i<links.length;i++) {
					if(links[i].href) {
						links[i].href = links[i].href.replace(relink,'');
					}					
					else if(links[i].src) {
						links[i].src = links[i].src.replace(relink,'');
					}
				}
			};
		}
		d.sites.push(def);
	}
	
	d.sites.push({		
		target:	'7958.com',
		relink:	function(doc,links){				
			for(var i=0;i<links.length;i++) {
				if(links[i].href && links[i].href.match(/\d+\.html$/)) {
					links[i].href = links[i].href.replace(/download_(\d+\.html)$/,'index/downfile/$1');
					links[i].href = links[i].href.replace(/down_(\d+\.html)$/,'download_$1');

				}
			}
			var btn = $('#downtc');
			if(btn.length) {
				btn.html($(unsafeWindow.downurl));
			}
		},
	});

	A(/torrentproject\.com/,
		[/google\.com\/search\?/,'google.com/search?safe=off&']
	);
	A(/(?:kaisou\.cc|bt\.com)\/Item/,
		function(link,doc){
			var title = document.title.replace(/(?:BT下载|高清BT).*$/,'');
			if(link.href && link.href.match(/BTDown\//)) {
				link.href = link.href.replace(/BTDown\//,'Torrent/');
				link.setAttribute('title',title);
			}
		}
	);
	
	A(/weipai\.cn/,
		[/\/user\/([^\/]+)\/?$/,'/videos/$1']
	);
	A(/blog-entry-\d+/,
		[/fc2\.com/,'fc2blog.us']
	);
	A(/mitaohui\.net/,
		[/http:\/\/mitaohui\.net/,'https://mitaohui.net']
	);
	A(/clickme\.net/,
		[/http:\/\/cdn\.clickme\.net/,'https://cdn.clickme.net']
	);
	A(/tumblr\.com/,
		[/http:\/\/([^\.]+)\.tumblr.com/,'https://$1.tumblr.com']
	);
  A(/skrbt.*.xyz/,
    [/^.*\/([ABCDEFabcdef0123456789]{40})$/,'magnet:?xt=urn:btih:$1']
  );
  A(/hjd.sdy2048.net/,
    [/http:\/\/(www\.s?xotu\.xyz)/,'https://$1']
   );
  A(/btdb\./,
		[/sort%3D/,"sort="]
	);
d.start = start;
d.A = A;	
d.start();
})();
