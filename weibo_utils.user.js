// ==UserScript==
// @name        weibo_utils
// @namespace   myplace
// @description utils for weibo.com
// @include     http://weibo.com/*
// @include     https://weibo.com/*
// @include		http://*.sinaimg.cn/*
// @include		https://*.sinaimg.cn/*
// @include		http://m.weibo.cn/*
// @include		https://m.weibo.cn/*
// @include 	http://photo.weibo.com/*
// @include 	https://photo.weibo.com/*
// @version     1
// @grant       none
// ==/UserScript==

//https://m.weibo.cn/p/second?containerid=1078032820910492_-_photolike&page=1&count=24&title=%E8%B5%9E%E8%BF%87%E7%9A%84%E5%9B%BE%E7%89%87&luicode=10000011&lfid=1078032820910492&featurecode=20000320

//https://m.weibo.cn/p/second?containerid=1078032820910492_-_photoall&page=1&count=24&title=%E5%9B%BE%E7%89%87%E5%A2%99&luicode=10000011&lfid=1078032820910492&featurecode=20000320

//https://m.weibo.cn/api/container/getSecond?containerid=1078032820910492_-_photoall&page=2&count=24&title=%E5%9B%BE%E7%89%87%E5%A2%99&luicode=10000011&lfid=1078032820910492&featurecode=20000320

if(!unsafeWindow) {
	unsafeWindow = window;
}
var $myPlace = $myPlace || unsafeWindow.$myPlace || {};
window.addEventListener('load',function(){
(function(_) {
	
	var oid;
	var onick;
	if(unsafeWindow.$CONFIG) {
		oid = unsafeWindow.$CONFIG['oid'];
		onick = unsafeWindow.$CONFIG['onick'];
	}
	var href = document.location.href;
	var exps = [
		/photo\.weibo\.com\/(\d+)\//,
		/m\.weibo\.cn\/(?:u|profile)\/(\d+)/,
		/weibo\.com\/(?:u|profile)\/(\d+)/,
		/containerid=\d\d\d\d\d\d(\d+)/,
		/m\.weibo\.cn\/p\/230413(\d+)/,
		
	];
	if(!oid) {
		for(var i=0;i<exps.length;i++) {
			var m = href.match(exps[i]);
			if(m && m[1]) {
				oid = m[1];
				break;
			}
		}
	}
	
	
	if(_.panel && oid) {
		/*
		if(!onick) {
			var h3 = document.getElementsByTagName('h3');
			if(h3.length>0) {
				h3 = h3[0];
				onick = h3.textContent.trim();
			}
		}
		*/
		var element = document.createElement('div');
		element.appendChild(_.panel.newLink('https://weibo.com/u/' + oid, (onick || '主页'),0,1));
		element.appendChild(_.panel.newLink('https://m.weibo.cn/profile/'+oid,(onick || '主页') + "[简版]",0,1));
		var photos = [
			{path:'/p/index?containerid=230869',id:'mix',desc:'赞'},
			{path:'/p/index?containerid=230869',id:'like_video',desc:'赞 - 视频'},
			{path:'/p/index?containerid=230869',id:'like_pic',desc:'赞 - 图片'},
			{path:'/p/index?containerid=230869',id:'like_article',desc:'赞 - 文章'},
			{path:'/p/second?containerid=107803',id:'photoall',desc:'相册'},
			{path:'/p/second?containerid=107803',id:'photolike',desc:'赞过'},
			{path:'/api/container/getSecond?containerid=107803',id:'photoall',desc:'JS相册'},
			{path:'/api/container/getSecond?containerid=107803',id:'photolike',desc:'JS赞过'},
			//'http://photo.weibo.com/likes/get_photos?uid=5288300397&page=2&count=20&__rnd=1549130037958'
		];
		
		for(var i=0;i<photos.length;i++) {
			element.appendChild(_.panel.newLink(
				'https://m.weibo.cn' + photos[i].path + oid + '_-_' + photos[i].id + '&page=1&count=24',
				photos[i].desc,
				0,
				1)
			);
		}
		_.panel.add(element,1);
	}
	
	
	
	var m = href.match(/^(.+?sinaimg.cn)\/(?:thumb|middle|mw)[^\/]+\/(.+)$/);
	if(m && m[0]) {
		_.panel.addLink(href.replace(/\/(?:thumb|middle|mw)[^\/]+\//,'/large/'),'查看大图',1);
	}
/*	
	m = href.match(/([\?&]page=)(\d+)/);
	if(m && m[1]) {
		var key = m[1];
		var p = new Number(m[2]);
		if(p>1) {
			var n = new Number(p-1);
			_.panel.addLink(href.replace(/([\?&]page=)(\d+)/,"$1" +n),"第"+n+"页",1); 
		}
		var n = new Number(p+1);
		_.panel.addLink(href.replace(/([\?&]page=)(\d+)/,"$1" +n),"第" + n + "页",1); 
	}
*/	
})($myPlace);});
