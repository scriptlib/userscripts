// ==UserScript==
// @name           myplace.imagesalbum
// @namespace      eotect@myplace
// @description    Internet images miner and shower
// @require		   myplace.lib.dataminer.js
// @require		   myplace.lib.datashower.js
// @include http*://0*[01].s?html?*
// @include http*://*.jpg*
// @include http*://image.soso.com*
// @include http*://search.sina.com.cn*
// @include http*://www.mday.com.cn/html*
// @include http*://nanrenzhuang.net/girl*
// @include http*://*.591ac.com/photo/*/default.htm*
// @include http*://image.baidu.com*
// @include http*://image.goojje.com*
// @include http*://abdra.net/modules/myalbum/viewcat.php*
// @include http*://*photo.php\?lid=*
// @include http*://*thumbs*
// @include http*://*thumbs*
// @include http*://photo.pchome.com.tw*
// @include http*://*.live.com*
// @include http*://*.yahoo.*
// @include http*://*photobucket.com*
// @include http*://*sports.donga.com/bbs*
// @include http*://*fondospantalla.org*
// @include http*://*.tuzhan.com*
// @include http*://milkyangels.com*
// @include http*://beautyleg.cc*
// @include http*://*roiro.com/venus*
// @include http*://boards.4chan.org*
// @include http*://4gifs.org*
// @include http*://www.porn-star.com*
// @include http*://www.ericaellyson.net*
// @include http*://www.reddit.com*
// @include http*://celebuzz.com*
// @include http*://skins.be*
// @include http*://gods-art.de*
// @include http*://www.dmm.co.jp*
// @include http*://blog.sina.cn/dpool/blog/ArtRead.php*
// @include http*://photo.xuite.net*
// @include http*://mm.taobao.com*
// @include http*://blog.cntv.cn*
// @include http*://dp.pconline.com.cn*
// @include http*://blog.sina.com.cn*
// @include http*://www.bobx.com*
// @include http*://photo.xgo.com.cn/ablum*
// @include http*://qing.weibo.com*
// @include http*://ikeepu.com*
// @include http*://tuita.com/blogpost*
// @include http*://*.weibo.com*
// @include http*://weibo.com*
// @include http*://hot.tgbus.com*
// @include http*://google.*/search*
// @include http*://www.google.*/search*
// @include http*://images.google.*
// @include http*://google.*/imghp*
// @include http*://www.google.*/imghp*
// @include http*://pic.yule.sohu.com/*
// @include	http*://www.snaapa.com/*
// @include http*://www.fotop.net/*
// @include	http*://snaapa.com/*
// @include http*://fotop.net/*
// @include http*://t.qq.com/*
// @include http*://moko.cc/*
// @include http*://www.moko.cc/*
// @include http*://photo.blog.sina.com.cn/*
// @include https://www.google.com/bookmarks/*
// @include https://www.google.com.hk/bookmarks/*
// @include https://www.google.co.jp/bookmarks/*
// @include http*://www.colorbird.com/*
// @include http*://colorbird.com/*
// @include http*://*.tistory.com/*
// @include http*://www.facebook.com/*
// @include http://www.oisinbosoft.com/*
// @include http://www.arzon.jp/*
// @include http://www.sungirlbaby.com/*
// @include http://www.amazon.co.jp/*
// @include http://www.weipai.cn/*
// @include http://my.hupu.com/*
// @include http://www.flickr.com/*
// @include https://www.flickr.com/*
// @include http://tieba.baidu.com/*
// @include http://pp.163.com/*
// @include http://www.fengniao.com/active/*
// @include http://instagram.com
// @include http://www.tuigirl8.com/forum/view/*
// @include http://item.jd.com/*
// @include http://detail.tmall.com/item*
// @include http://item.taobao.com/*
// Qvod sites:
// @include http://*/videos/*
// @include http://*/movie/*
// @include http://*/Html/P/*
// @include http://*qvod*
// @include http://*8816.cc/er/*
// @include http://*\/player*
// @include http://*/?s=vod-play-*
// @include http://*yuyiyuyi.com/gs/*
// @include http://wd.koudai.com/*
// @include http://ffffound.com/image/*
// @include http://ffffound.com/home/*
// @include http://*.tumblr.com/*
// @include http://www.tetoxtreme.com/*
// @include http://*.xingyun.cn/*
// @include http://www.aweipai.com/*
// @include http://bbs.voc.com.cn/*
// @include http://bbs.*/topic-*.html
// @version 1.13
//Changelog
//	2015-04-26
//		Add support for bbs.voc.com.cn, amazon.co.jp
//		Add support for tieba.baidu.com
//	2015-01-18
//		Add support for wd.koudai.com
//  2014-08-04
//		Add support for item.jd.com, item.taobao.com
//	2014-05-28
//		Fix support for weibo.com, flickr.com
//		Fix support for google.com
//		Add support for instagram.com
//	2013-09-27
//		Add support for oisinbosoft.com
//		Add support for arzon.jp
// ==/UserScript==

(function(){
        if(parent != window) {
			return;
		}
	
	if(!unsafeWindow) {
		unsafeWindow = window;
	}
	var $myPlace = $myPlace || unsafeWindow.$myPlace || {};
	unsafeWindow.$myPlace = $myPlace;
	var $ = $myPlace.jQuery || unsafeWindow.$;
	
	var DOCHREF = document.location.href;
	var DOCTITLE = document.title;
	var ELMLINKS = document.getElementsByTagName('a');
	var ELMIMGS = document.getElementsByTagName('img');
	
	var M = new $myPlace.lib.dataminer(DOCHREF);
	var $M = function(a1,a2,a3,a4,a5,a6,a7,a8,a9) {
		return M.reg(a1,a2,a3,a4,a5,a6,a7,a8,a9);
	};
	var $R = function(a1,a2,a3,a4,a5,a6,a7,a8,a9) {
		a1 = new RegExp('https?:\\/\\/[^\\.\\/]*\\.?' + a1);
		return M.reg(a1,a2,a3,a4,a5,a6,a7,a8,a9);
	};
	
	
	//REGISTER MINER
	M.registerDefault(/0*[01].s?html?[^\/]*$/,
		[document,''],
		function() {
			var picIdx = 0;
			var result = new Array();
			var match = DOCHREF.match(/(\d+)\.s?html?[^\/]*$/i);
			if(!match) return result;
			picIdx = match[1];
			var baseImg;
			for(var i=0;i<ELMIMGS.length;i++) {
				if(ELMIMGS[i].src.match(new RegExp(picIdx + "\.jpg$","i")) || 
					ELMIMGS[i].src.match(new RegExp((picIdx - 1) + "\.jpg$","i")) || 
					ELMIMGS[i].src.match(new RegExp((picIdx + 1) + "\.jpg$","i"))) {
					baseImg = ELMIMGS[i].src;
					baseImg = baseImg.replace(/\d+\.jpg$/,"");
					break;
				}
			}
			if(!baseImg) return result;
			var count= new Number(0);
			var linkExp = DOCHREF;
			linkExp = linkExp.replace(/^.*\//g,"");
			linkExp = linkExp.replace(/\//g,"\\\/");
			linkExp = linkExp.replace(/\d+\.s?html?.*$/,"(\\d+)\\.s?html?");
			linkExp = new RegExp(linkExp,"i");
			for(var i=0;i<ELMLINKS.length;i++) {
				var match = linkExp.exec(ELMLINKS[i].href);
				if(match) {
					if(count<new Number(match[1])) {
						count=new Number(match[1]);
				}}
			}
			if(!count) return result;
			if(count>300) return result;
			for(var i=0;i<10 && i<count;i++) {
				var src = baseImg + i + ".jpg";
				result.push({src:src,href:src,text:src});
				src = baseImg + "0" + i + ".jpg";
				result.push({src:src,href:src,text:src});
				src = baseImg + "00" + i + ".jpg";
				result.push({src:src,href:src,text:src});
				
			}
			for(var i=10;i<100 && i<count;i++) {
				var src = baseImg + i + ".jpg";
				result.push({src:src,href:src,text:src});
				src = baseImg + "0" + i + ".jpg";
				result.push({src:src,href:src,text:src});
			}
			for(var i=100;i<count;i++) {
				var src = baseImg + i + ".jpg";
				result.push({src:src,href:src,text:src});
			}
			return result;            
		}
	);

	M.registerFailback(
		['img','src'],
		'attr_replace',
		[/\/thumbnails\/tn_*([^\/]+\.jpg)$/i,"/$1"]
	);
	M.registerFailback(
		['img','src'],
		'attr_replace',
		[/\/thumb_([^\/]*.jpg)$/,"/$1"]
	);
	M.registerFailback(
		['img','src'],
		'attr_replace',
		[/(_s|_small)\.jpg$/, ".jpg"]
	);
	M.registerFailback(
		['img','src'],
		'attr_replace',
		[/\/cwdata\/([^\/]+\.jpg)$/, "/$1"]
	);
	M.registerFailback(
		['img','src'],
		'attr_replace',
		[/\/pic_lib\/s.*\/(.*)s.*\.jpg/,"/pic_lib/wm/$1.jpg"]
	);
	M.registerFailback(
		['img','src'],
		'attr_replace',
		[/thumbs\/([^_]+_[^_]+)_(.*)_thumb.jpg/,"pictures/$1/$1_$2/$1_$2.jpg"]
	);
	M.registerFailback(
		['href','a'],
		'attr_match',
		[/(http\:\/\/[^=]*\.(jpg|jpeg|jpe))$/i,1,null,null]
	);
	//****************************************************
	//Strong Rules
	//****************************************************
	M.register(/http:\/\/image\.soso\.com\//,
		[document],
		function(elm) {
			var r = new Array();
			var G = unsafeWindow.G;
			if(!(G && G.json && G.json.details)) return false;
			var jsonResult = G.json.details.items;
			var b = G.json.rollPage.begin;
			var e = G.json.rollPage.end;
			for(var i=b;i<=e;i++) {
				var item = jsonResult[i];
					r.push({
						src		:item.src,
						href	:item.ref,
						text	:item.TT || item.title
					});
			}
			return r;
		}
	);

	M.register(/http:\/\/search.sina.com.cn\//,
		['img','src'], function(img,src) {
			if(!src) return false;
			var id = new String(img.id);
			var r = {src:null,href:null,text:img.getAttribute('alt')};
			var m = src.match(/.+\&url=(.+)$/);
			if(!m) return false;
			src = unescape(m[1]);
			r.src = src;
			if(id) {
				var m = id.match(/^img_(.+)$/);
				if(m) {
					id = m[1];
				}
			}
			var a = document.getElementById('a_' + id);
			if(a) {
				r.href = a.getAttribute('href');
			}
			return { 
				src:r.src,
				href:r.href,
				text:r.text
			};
		},
		'',
		{dialog:true,no_wrap:true}
	);

	M.addSite(/http:\/\/www.mday.com.cn\/html\//,
		function() {
			var result = new Array();
			if(unsafeWindow.ComicImg) {
				for(var i=0;i<unsafeWindow.ComicImg.length;i++) {
					var url = unsafeWindow.prevUrls2[unsafeWindow.currIndex2]+unsafeWindow.dirStr+unsafeWindow.ComicImg[i];
					result.push({src:url,href:url,text:url});
				}
			}
			return result;
		},
		false
	);
	M.addSite(/nanrenzhuang\.net\/girl\//,
		function() {
			var result = new Array();
			if(unsafeWindow.picURL) {
				var linktext = new String(unsafeWindow.picURL);
				var links = linktext.split(/\|/);
				for(var i=0;i<links.length;i++) {
					var url = links[i];
					result.push({src:url,href:url,text:url});
				}
			}
			return result;
		},
		false
	);
	M.addSite(/http:\/\/(dm\.e-teng\.com|www\.jumpc\.com)\//,
		function () {
			var imgs = document.getElementsByTagName("img");var result = new Array(); var img;
			var pattern=/([0-9]*)(\.jpg|_[^\/_0123456789]+\.jpg)$/i;
			for (var i=0;i<imgs.length;++i) {if (imgs[i].src.match(pattern)) {img = imgs[i].src;break;}}
			if (img != null) {
				var links = document.getElementsByTagName("a");
				var imgcount = 0;
				for (var i=0;i<links.length;i++) {if (links[i].href.match(/\/[0-9]+-[0-9]+\.shtml/i)) imgcount++;}
				var res = img.match(pattern);
				if (res) {
					var num = res[1];var numlen = new Number(-num.length/2);
					for (var i=0;i<imgcount;++i) {
						var strnum1 = "000" + (i); var strnum2 = "000" + (i+1);
						strnum1 = strnum1.substr(numlen); strnum2 = strnum2.substr(numlen);
						var url = img.replace(pattern, strnum1 + strnum2 + ".jpg");
						result.push(new_image_from(url,url,url,img,0));
					}
				}
			}
			return result;
		},
		false
	);

	M.addSite(/^http:\/\/www\.591ac\.com\/photo\/.*\/default.htm$/,
		function () {
			var images = document.getElementsByTagName("img");
			var result = new Array();
			for (var i=0;i<images.length;++i) {
				var src = images[i].src;
				var res = src.match(/^(http:\/\/www\.591ac\.com\/photo\/.*_)([0-9]+)\.jpg$/i);
				if (res) {
					var num = new Number(res[2]);
					num +=2;
					src = res[1] + num + ".jpg";
					result.push(new_image_from(src,href,text,images[i],1));
				}
			}
			return result;
		},
		false);


	M.reg(/image\.baidu\.com/,
		['a:has(img)','onclick'],
		function(elm,onclick) {
			if(!onclick) return;
			var m = onclick.match(/u:'([^']+)'.*f:'([^']*)'/);
			if(m) {
				return {src:m[1],href:m[2]};
			}
		},
		null,
		{dialog:true,no_cache_selector:true}
	);
	M.reg(/image\.baidu\.com/,
		[document,'location'],
		function() {
			var saved = unsafeWindow.BD.IMG.view.PagingDisplay.switchPage;
			unsafeWindow.BD.IMG.view.PagingDisplay.switchPage = function(arg1,arg2) {
				reloadAll();
				saved(arg1,arg2);
			}
			if(M.lastMatch) return;
			var result = new Array();
			if(unsafeWindow.imgdata && unsafeWindow.imgdata.data) {
				var data = unsafeWindow.imgdata.data;
				for(var i=0;i<data.length;i++) {
					result.push({src:data[i].objURL,href:data[i].fromURL,text:data[i].fromPageTitle});
				}
			}
			return result;
		},
		null
	);
	//onMouseMove="OpenDiv('?鹵',this,195,139,'http://t1.goojje.com/b2/f3/93/b2f32a93349c04a4027a7540da0b7813.jpg','<em>?鹵</em>???','350X250-61k','http://v.766.com/zy/201011/20101124_40360.html','http://v.766.com/system/uploadimg/video/201008/pocle_20100830115444_9187.jpg',true)"

	M.addSite(/image\.goojje\.com/,
		function() {    
			var result = new Array();
			var links = document.getElementsByTagName("img");
			for (var i=0;i<links.length;i++) {
				var curlink = links[i];
				var onclick = curlink.getAttribute("onMouseMove");
				if(onclick) {
					var r = onclick.match(/.+'(http:\/\/[^']+)'\s*,\s*'([^']+)'\s*,\s*'([^']+)'\s*,\s*'([^']+)'\s*,\s*'([^']+)'/);
					//debugPrint( onclick + " = " + r);
					if(r)
					{
						result.push(new_image_from(r[5],r[4],r[2],curlink,1));
					}
				}
				
			}
			return result;
		},
		false
	);

	M.addSite(/abdra\.net\/modules\/myalbum\/viewcat\.php/,
		function() {
			var result = new Array();
			for(var i=0;i<ELMLINKS.length;i++) {
				var lnk = ELMLINKS[i];
				if(lnk.href && lnk.href.match(/photo\.php\?lid=\d+$/)) {
					var img = lnk.firstChild;
					if(img && img.src && img.src.match(/\/thumbs\//)) {
						var src = img.src.replace(/\/thumbs\//,'/photos/');
						result.push(new_image_from(src,lnk.href,lnk.href,img,1));
					}
				}
			}
			return result;
		},
		false
	);

	M.addSite(/photo\.pchome\.com\.tw/,
		function() {
			var r = new Array();
			for(var i=0;i<ELMLINKS.length;i++) {
				var lnk = ELMLINKS[i];
				var sp = lnk.firstChild;
				if(sp && sp.id && sp.id.match(/^Img\[.+\]$/)) {
					src = sp.id.replace(/^Img\[(.+)s\.([^\.]+)\]$/,'$1.$2');
					var m = src.match(/s(\d+)\/[^\/]+\/[^\/]+\/([^\/]+)\/book(\d+)\/p([^\/\.]+)\.[^\.]+$/);
					if(m) {
						src = 'http://link.photo.pchome.com.tw/s' + m[1] + '/' + m[2] + '/' + m[3] + '/' + m[4] + '/';
					}
					r.push(new_image_from(src,lnk.href,lnk.text,sp,1));
				}
			}
			return r;
		},
		false
	);

	M.addImgSite(/_640(\.[^\.]+)$/,'$1',
		false,
		/my\.poco\.cn/
	);

	//M.addLinkSite(/\/ir?.*&u=([^&]*).*&f=([^&]*)/i,
	//            1,2,null,false,
	//            /\.baidu\.com/);

	M.addLinkSite(/&furl=([^&]*)/i,
				1,1,1,false,
				/\.live\.com/);
	M.addLinkSite(/&imgurl=([^&]*)&rurl=([^&]*)&.*&name=([^&]*)&/i,
				1,2,3,false,
				/\.yahoo\.com/);

	M.addLinkSite(
		/\*\s*-\s*([^,]+)$/,
		1,null,null,false,
		/\.yahoo\./,
		'rev'
	);
	M.addImgSite(
		/http:\/\/(download\.21cn\.com\/file1)(.*)[0]([^0]+[0-9]*\.jpg$)/i,
		"http://dg.$1fk5esindid$2$3",false,
		/http:\/\/.*\.21cn\.com\//i
	);

	M.addImgSite(
		/\/smallview1\/([^\/]+)\/([^\/]+)\//,
		"/view1/$2/$1/",false,
		/imgb\.rentalcgi\.com/
	);

	M.addImgSite(
		/_thumbs\/[0-9]+x[0-9]+-/i,
		"",false,
		/flickrlicio\.us/
	);

	M.addImgSite(
		/\/infoPic\/(.+)_[^\/_]+\.([^\/\.]+)$/i,
		"/infoPic/$1.$2",false,
		/jpgsky\.com/
	);

	M.addImgSite(
		/\/t\//,
		"/i/",false,
		/imagebeaver\.com/
	);
	M.addImgSite(
		/\/(thumbs\/|thumbnails\/|small\/)?(tnl|tn|s)_?([^\/]*\.jpg)$/i,"/images/$3",false,
		/(avl\.com|hentaischool\.com)/
	);
	M.addImgSite(
		/_?(thumbs|thumbnails|small|s)\/(tnl|tn|s)_?/i,"/",false,
		/(talk\.dofor\.cn)/
	);
	M.addImgSite(
		/\/_?(th|tn|thumb|s)_?([^\/]*\.jpg)$/i,
		"/$2",false,
		/(photobucket\.com|sports\.donga\.com\/bbs\/)/
	);
	M.addImgSite(
		/\/thumbnails\//i,"/media/",false,
		/\.celebrityfan\./
	);
	M.addImgSite(
		/\/(thumbs|thumbnails)\//,"/",false,
		/celebscentral\.net/
	);
	/*
	M.addLinkSite(
		/\/showpic\.html\#.*url=([^&]+)/,1,null,1,false,
		/blog\.sina\.com\.cn/
	);
	*/
	M.addLinkSite(/(.*imagen\/\d+\/.+)/,1,null,1,false,/fondospantalla\.org/);
	M.addTagSite('a','href',/fondos-de-[^\/]+\/fondos-[^\/]+\/fondos--([^\/]+\/[^\/]+\/[^\/]+)\/(\d+)/,'imagen/$2/$1.jpg',false,/fondospantalla\.org/);


	/*
	http://fondospantalla.org/fondos-de-chicas-s/fondos-sabrina-ferilli/fondos--chicas-s/sabrina-ferilli/sabrina-ferilli-1/1280
	http://fondospantalla.org/imagen/1280/chicas-s/sabrina-ferilli/sabrina-ferilli-1.jpg
	http://fondospantalla.org/thumbnails2/-sabrina-ferilli-sabrina-ferilli-1.jpg
	http://fondospantalla.org/chicas-s/sabrina-ferilli/sabrina-ferilli-1.jpg
	*/
	M.reg(/http:\/\/blog\.sina\.com\.cn/,
		['img','real_src'],
		'attr_replace',
		[/\/(orignal|bmiddle|middle|small|mw690)\//,'/orignal/'],
		{dialog:true}
	);
	M.addImgSite(
		/(small|bmiddle|middle|orignal)\//,"orignal/",false,
		/photo.blog\.sina\.com\.cn/
	);

	M.addImgSite(
		/_[0-9]+X[0-9]+\.jpg$/i,".jpg",false,
		/msn\.mtime\.com/i
	);
	M.addImgSite(
		/\/x\//,"/d/",false,
		/ent\.tom\.com\//i
	);

	M.addImgSite(
		/_S/,"",false,
		/mkl\.jp\//
	);

	//http://i2.turboimagehost.com/t/80593_55749_cyn9.JPG
	M.addImgSite(
		/\/t\//,
		"/b/",false,
		/turboimagehost\.com/
	);

	M.addImgSite(
		/\/\d\.jpg$/,
		"/4.jpg",false,
		/livedoor\.com/
	);

	M.register(/photo\.weibo\.com/,
		['img','src'],
		'attr_replace',
		[/(small|mw690)\/(.+)\.jpg$/,'large/$2.jpg'],
		{dialog:true,no_cache_selector:true,loadmode:'Interative'}
	);

	//http://ww3.sinaimg.cn/large/684e58a1tw1dgd30cyt75j.jpg
	M.register(/t\.sina\.com\.cn|weitu\.sdodo\.com/,
		['img','src'],
		'attr_replace',
		[/\/(bmiddle|thumbnail|thumb\d+|small|square|mw690)\/(.+)\.jpg$/,'/large/$2.jpg'],
		 {dialog:true,no_cache_selector:true,inline:false,loadmode:'Interative'}
	);


	M.addImgSite(/_s\.jpg$/,    '_l.jpg',false,/\.tuzhan\.com/);
	M.addImgSite(/-\d+[xX]\d+\./,'.',false,/milkyangels\.com/);

	M.addTagSite(
		'img',
		'src',
		/\/var\/(resizes|thumbs)\//,
		'/var/albums/',
		false,
		/beautyleg.cc/,false
	);

	M.addImgSite(
		/(\/pic\/\d+-\d+-\d+\/)s_/,
		'$1',false,
		/tuku\.game\.china\.com/
	);

	M.addImgSite(
		/\/s\//,
		'/c/',false,
		/star\.tvyugao\.com\/.+\//
	);

	M.addImgSite(
		/\/thumb\/thumb_/,
		'/full/',
		false,
		/photo4asian\.com/
	);

	M.register(/roiro\.com\/venus/,
		['a','href'],
		'attr_match',
		[/.+refresh\.php\?.*url=(.+\.jpg)$/,1]
	);

	M.register(/boards\.4chan\.org/,
		['a:has(img)','href'],
		'attr_match',
		[/^(.+\/([^\.\/]+\.(?:jpg|png|jpeg|gif)))$/,1,DOCHREF,document.title],
		{inline:false,dialog:true}
	);
		
	M.register(
		/4gifs\.org/,
		['img','src'],
		function(elm,src) {
			var q = src.match(/\/d\/(\d+)-\d+\/([^\/]+)$/);
			if(q){
				return {src:src.replace(q[1] + '-',(q[1]-1) + '-')};
			}
		},
		null,
		{inline:true}
	);

	M.register(/http:\/\/slide(\.[^.]+)?\.sina\.com\.cn/,
		'div#eData dl',
		function(elm,attr) {
			var children = $(elm).children();
			return {
				src		:$(children[1]).html(),
				text	:$(children[0]).html()
			};
		}
	);

	M.registerSimple(/http\:\/\/www\.porn\-star\.com/,
		{no_button:true,dialog:true}
	);
	M.registerSimple(/http:\/\/www\.ericaellyson\.net/,
		{no_edit:true}
	);

	M.register(/www\.reddit\.com/,
		['a.thumbnail','href'],
		'attr_match',
		[/^(.+\.(jpg|gif|jpeg|png))$/,1],
		{inline:true}
	);

	function RU(raw) {
		var url = raw.replace('/',"\\/");
		url = url.replace('.',"\\.");
		return url;
	}

	M.register(/celebuzz\.com/,
		['a img', 'src'],
		'attr_replace',
		[/(.*\/wp-content\/uploads\/.+)-\d+x\d+(\.[^.]+)$/,'$1$2'],
		{inline:false}
	);

	M.register(/skins\.be/,
		['a img','src'],
		'attr_replace',
		[/(\d*)thumb\.skins\.be/,'$1img.skins.be'],
		{inline:true}
	);



	M.register(/http:\/\/gods-art.de/,
		['a img','src'],
		'attr_replace',
		[/\.jpg/,'_big.jpg'],
		{dialog:true}
	);

	M.register(/http:\/\/www\.dmm\.co\.jp/,
		['img','src'],
		'attr_replace',
		[/p[st]\.jpg$/,'pl.jpg',/(\d+)-(\d+)\.jpg/,'$1jp-$2.jpg'],
		{dialog:true}
	);

	M.register(/http:\/\/blog\.sina\.cn\/dpool\/blog\/ArtRead\.php/,
		['a img','src'],
		'attr_replace',
		[/\/[\dx]+(\.[^\.]+)/,'/original$1'],
		{inline:true}
	);
	M.register(/http:\/\/photo\.xuite\.net/,
		['a img','src'],
		'attr_replace',
		[/^.+?(\d+)\.share\.photo\.xuite\.net\/([^\/]+)\/.(.)(.)(.)(.)[^\/]+\/([^\/]+\/[^\/]+)_c(\.[^\.]+)$/,'http://o.$1.photo.xuite.net/$3/$4/$5/$6/$2/$7$8',/^.+?([a-z]+\.share\.photo\.xuite\.net\/.+)_c(\.[^\.]+)$/,'http://$1_x$2'],
		{inline:true}
	);
	M.register(/http:\/\/mm\.taobao\.com/,
		['img','src'],
		'attr_replace',
		[/_\d+x\d+\.[^\.]+$/,''],
		{linkpage:true,loadmode:'Interative'}
	);
	M.register(/http:\/\/mm\.taobao\.com/,
		['img.mm-template-src','src'],
		'attr_replace',
		[/_\d+x\d+\.[^\.]+$/,''],
		{linkpage:true,no_cache_selector:true,loadmode:'Interative'}
	);
	M.reg(/http:\/\/blog\.cntv\.cn/,
		['a img', 'src'],
		'attr_replace',
		[/\.thumb\./,'.'],
		{inline:true}
	);
	M.reg(/http:\/\/dp\.pconline\.com\.cn/,
		['a img', 'src'],
		'attr_replace',
		[/_thumb\.|_mthumb\./,'.'],
		{dialog:true}
	);


	M.reg(/http:\/\/www\.bobx\.com/,
		['a img','src'],
		'attr_replace',
		[/\/thumbnail\/(.+)-preview/,'/$1'],
		{dialog:true}
	);
	/*
	M.addLinkSite(/imgurl=([^&]*)&imgrefurl=([^&]*)&/,
				1,2,2,false,
				/:\/\/(www\.google|google)\./);
	*/
	M.reg(/:\/\/(www\.google|google)\./,
		['.rg_di','class'],
		function(elm,src) {
			var link = elm.getElementsByTagName('a')[0];
			if(!link) {
				return false;
			}
			var href = link.href;
			if(!href) {
				return false;
			}
			//GM_log(href);
			var match = href.match(/imgurl=([^&]*)&imgrefurl=([^&]*)&/);
			if(!match) {
				return false;
			}
			var text =  elm.textContent;//jelm.parentNode.textContent.replace(/\s*\.\.\.\s*\d+\s*×\s*\d+\s*-.*$/,'');
			var tmatch = text.match(/"s":"([^"]+)"/);
			if(!tmatch) {
				tmatch = text.match(/"pt":"([^"]+)/);
			}
			return {
				src: unescape(match[1]),
				href: unescape(match[2]),
				text: (tmatch ? tmatch[1] : ''),
			};
		},
		[],
		{dialog:true,no_button:true,inline:false,loadmode:'Interative'}
	);
	M.reg(/http:\/\/photo\.xgo\.com\.cn\/ablum\//,
		['img','src'],
		'attr_replace',
		[/pics\/(\d+)\/\d+\/\d+/,"pics/$1"],
		{dialog:true}
	);

	M.reg(/http:\/\/qing\.weibo\.com/,
		['img','src'],
		'attr_replace',
		[/\/mw600\//,'/large/'],
		{dialog:true}
	);
	M.reg(/ikeepu\.com/,
		['img','src'],
		'attr_replace',
		[/jpg_160$/,'jpg'],
		{replace:true,dialog:true}
	);
	M.reg(/tuita\.com\/blogpost/,
		['img','src'],
		'attr_replace',
		[/(\d+)-(\d+)-\d+\.jpg$/,'$1-$2.jpg'],
		{replace:true,dialog:true}
	);


	$M(/\/\/hot\.tgbus\.com/,
		['img','src'],
		'attr_replace',
		[/images\/(pic\d+).jpg$/,'images/big-img/$1_big.jpg'],
		{dialog:true}
	);

	$M(/snaapa\.com|fotop\.net/,
		['img','src'],
		'attr_replace',
		[/\.thumb\.jpg/,'.jpg'],
		{dialog:true}
	);

	$M(/t\.qq\.com/,
		['.picBox>a>img','crs'],
		'attr_replace',
		[/\/mblogpic\/([^\/]+)\/160/,'/mblogpic/$1/2000'],
		{dialog:true, no_cache_selector:true}
	);
		$M(/t\.qq\.com/,
		['.url','href'],
		function(elm,href) {
			return {href:href};
		},
		null,
		{dialog:true, no_cache_selector:true, no_index:true}
	);
	$R('moko\.cc\/[^\/]+\.html$',
		['img','src'],
		'attr_match',
		[/(.*html\.moko\.cc\/.+$)/,1]
	);
	$R('moko\.cc\/[^\/\?]+\/?$',
		['input','value'],
		'attr_match',
		['(.*\.jpg$)',1],
		{dialog:true}
	);
	$R('moko\\.cc\/(?:weblogPostShowList|post\/)',
		['.picBox>img','src2'],
		function(elm,src){
			if(!src) {
				src = elm.getAttribute('src');
			}
			if(!src) {
				return;
			}
			var thumb = src.replace(/_src_/,'_thumb_');
			return {
				src: src,
				thumb: thumb,
			};
		}
	);
	// $R('moko\\.cc',
		// ['img.mbSPic','src2'],
		// 'attr_replace',
		// ['_mokoshow_','_cover_'],
		// {dialog:true}
	// );

	$R('google\.(?:com|com\.hk|co\.jp)\/bookmarks',
		['table.result','id'],
		function(elm,id) {
			var image = {description:'',tags:'',text:'',src:'',href:'', title:''};
			var r = elm.textContent.match(/^(.+)\xA0+-\xA0+[^\/:#\?=&]+\xA0+-\xA0+Edit\xA0+Remove\s*\[(.+)\][^\[\]]+$/);
			if(r) {
				image.title = r[1];
				r = r[2].match(/^(.*?)\s+-\s+(.+)\s*$/);
				if(r) {
					image.description = r[2];
					image.tags = r[1];
					r = r[2].match(/^\s*(http:[^\s]+)\s*(.*?)\s*$/);
					if(r) {
						image.src = r[1];
						image.description = r[2];
					}
				}
			}
			var links = elm.innerHTML.match(/_mark\('([^\']+)'/);
			
		
			// alert(elm.innerHTML);
			// alert(links);
			// fail();
		
			if(links) {
				var full = unescape(links[1]);
				var m = full.match(/^(.+)(?:#|%23)photo-url:(.+)$/);
				if(m) {
					image.href = m[1];
					image.src = m[2];
				}
				else {
					image.href = full;
				}
			}
			if(image.description && image.description.match(/^\s*Via http/i)) {
				image.description = '';
			}
			image.text = image.title;
			image.desc = image.description;
			if(image.tags) {
				image.tags = image.tags.replace(/,?\s*unsorted bookmarks\s*/i,'');
				image.desc = "[" + image.tags + "]\n" + image.desc;
			}
			if(image.src) {
				id = id.replace(/^[^\d]+/,'')
				var idx = document.createElement('span');
				idx.innerHTML = '[' + id + ']:';
				elm.insertBefore(idx,elm.firstChild);// parentNode.insertBefore(idx,elm);
				image.src = image.src.replace(/moko\.hk/,'moko.cc');
				image.src = image.src.replace(/livedoor\.blogimg\.jp/g,'image.blog.livedoor.jp');
				return image;
			}
			else if(image.href) {
				return image;
			}
			return null;
		},
		null,
		{no_edit:true}
	);

	//colorbird.com
	$R('colorbird\\.com',
		['#imglist img','src'],
		'attr_replace',
		[/_s\.jpg/,'_big.jpg'],
		{dialog:true}
	);

	//tistory.com
	$R('tistory\\.com',
		['.imageblock img','src'],
		'attr_set',
		null,
		{no_edit:true}
	);
	$R('facebook\\.com',
	//	['img','src'],
		['.uiMediaThumbImg','style'],
		'attr_replace',
		[/.*(https?:\/\/.+)_n\.jpg.*$/,'/$1_o.jpg'],
	//	[/((s|p)\d+x\d+\/)?([^\/]+)_n\.jpg$/,'$3_o.jpg'],
		{dialog:true}
	);
    $R('oisinbosoft\\.com',
       ['#detail_simg a','href'],
       'attr_set',
       null,
       {dialog:true}
     );
	 $R('arzon\\.jp',
		['.img a','href'],
		'atrr_set',
		null,
		{dialog:true}
	);
	$R('arzon\\.jp\/itemlist',
		['img','src'],
		'attr_replace',
		[/S\.jpg$/,"L.jpg"]
	);
	$R('sungirlbaby\\.com',
		['a','href'],
		'attr_match',
		['\.[Jj][Pp][Gg]$'],
		{dialog:true}
	);
	$R('amazon\\.co\\.jp\/s\/',
		['div.celwidget','id'],
		function(elm,id) {
			if(!id) return;
			var j = $myPlace.jQuery(elm);
			var cover = j.find('img.productImage')[0];
			if(cover) {
			return {
				src: cover.src.replace(/\.(?:_SL\d+_|_)AA\d+_\.jpg$/,'.jpg'),
				href: cover.parentNode.parentNode.href,
				text: j.find('.newaps a').text(),
			};
			}
		}
	);
	/*
		['img.productImage','src'],
		function(elm,src) {
			if(!src) return;
			src = src.replace(/\._SL\d+_|_AA\d+_\.jpg/,'.jpg');
			return {src:src,href:elm.parentNode.parentNode.href,
		}

	);
*/
	M.addSite(/amazon\.co\.jp\/[^\/]+\/dp\//,
		function(){
			var res = document.documentElement.innerHTML;
			var  m=res.match(/"hiRes":"[^"]+"/g)
			var r = new Array;
			for(var i =0;i<m.length;i++) {
				var  t = m[i];
				var  mm = t.match(/"hiRes":"([^"]+)"/);
				if(mm) {
					r.push({src:mm[1],target:document.body.firstChild});
				}
			}
			return r;
		}
	);
	$R('weipai\.cn',
		['div img','src'],
		'attr_match',
		['(.*v\.weipai\.cn.*)',1],
		{dialog:true}
	);
	$R('my\.hupu\.com',
		['img','src'],
		'attr_replace',
		[/small\.jpg/,'\.jpg'],
		{dialog:true}
	);
	
	//@SITE http://www.flickr.com
	function flickr_get_pic(ori,type) {
		if(!type) type='b';
		return ori.replace(/^https:/,'http:').replace(/(?:_z|_s|_q|_n|_c|_m|_b|)\.jpg$/,'_' + type + '.jpg');
	}
	function flickr_get_title(part) {
		var title = document.title.replace(/\s*-\s*[^-]+$/,'');
		part = part.replace(/^\s+/,'');
		part = part.substr(0,24);
		part = part.replace(/\s+$/,'');
		return '' + (title ? (title + ' ') : '') + part;
	}
	$R('flickr\.com\/photos\/[^\/]+\/sets\/',
		['img.pc_img','data-defer-src'],
		function(elm,src) {
			if(!src) {
				src = elm.getAttribute('src');
			}
			if(!src) {
				return;
			}
			return {
				src:	flickr_get_pic(src,'b'),
				text:	flickr_get_title(elm.parentNode.parentNode.parentNode.textContent),
				href:	elm.parentNode.getAttribute('href'),
			};
		},
		null,
		{no_cache_selector:true,loadmode:'Interative'}
	);
	(function(){
		var flickr = {
			site: 'flickr\.com',
			attr: ['.low-res-photo,.Sets,.ui-display-image','data-defer-src'],
			get: function(elm,attr,type) {
				if(!attr) {
					attr = elm.getAttribute('src');
					if(!attr) {
						attr = elm.getAttribute('style');
						GM_log('style:' + attr);
						if(attr) {
							var m = attr.match(/background-image:\s*url\s*\(\s*([^\)]+?)\s*\)/i);
							attr = m ? m[1] : '';
							attr = attr.replace(/^['"](.+)['"]$/,'$1');
						}
					}
				}
				if(attr) {
					attr = attr.replace(/(?:_z|_s|_q|_n|_c|_m|_b|)\.jpg$/,'_' + type + '.jpg');
					return {src:attr};
				}			
				},
				props: {dialog:true,loadmode:'Interative',no_cache_selector:true}
		};
		$R(
			flickr.site,
			flickr.attr,
			function(elm,src) {
				return flickr.get(elm,src,'b');
			},
			null,
			flickr.props
		);
	})();

	function extract_tieba_baidu_com(img,src,props) {
		var large = src;
		large = large.replace(/forum\/[^\/]+\/sign=[^\/]+\//,'forum/pic/item/');
		large = large.replace(/\/abpic\//,'/pic/');
		if(props) {
			return $.extend(props,{thumb:src,src:large});
		}
		else {
			return {thumb:src,src:large};
		}
	}
	//@SITE: http://tieba.baidu.com
	$R(
		'tieba\.baidu\.com\/p',
		['a.ag_ele_a>img','src'],
		function(img,src) {
			return extract_tieba_baidu_com(img,src);
		},null,
		{no_cache_selector:true,loadmode:'Interative'}
	);
	//@SITE: http://tieba.baidu.com
	$R(
		'tieba\.baidu\.com\/f',
		['a.aep_img_link>img,div.vpic_wrap>img','src'],
		function(img,src) {
			return extract_tieba_baidu_com(img,src);
		},null,
		{no_cache_selector:true,loadmode:'Interative'}
	);
	//*@SITE: http://tieba.baidu.com
	$R(
		'tieba\.baidu\.com',
		['img.BDE_Image','src'],
		function(img,src) {
			return extract_tieba_baidu_com(img,src,{href:DOCHREF,text:DOCTITLE});
		}
	);
	//@SITE: http://weibo.com
	/*
		M.register(/t\.sina\.com\.cn|(\/\/|www\.|m.)weibo\.com|weitu\.sdodo\.com/,
		['img','src'],
		'attr_replace',
		[,'/large/$2.jpg'],
		 {dialog:true,no_cache_selector:true,inline:false,loadmode:'Interative'}
	);
	*/
	$R('weibo\.com',
		['.WB_feed_type','mid'],
		function(list,mid){
			if(!mid) return;
			
			var $= $myPlace.jQuery;
			
			var detail = $(list).find('.WB_detail');
			if(!detail) return;
			
			var imgelms = detail.find('img');
			if(!imgelms) {
				return;
			}
			
			var jtext = detail.find('.WB_text');
			if(!jtext) return;
			var text = jtext.text().replace(/^[　\s\n\r]+/,'');
			text = text.replace(/[　\s\n\r]+$/,'').replace(/[　\s\n\r]+/,' ','mg')
			
			
			var jlink = detail.find('.WB_from .S_txt2');;
			if(!jlink) return;			
			var href = jlink[0].href;
					
			var title = document.title;
			title = title.replace(/\|[^\|]+$/,'');
			
			var imgexp = /\/(bmiddle|thumbnail|thumb\d+|small|square|mw690)\/(.+)\.(?:gif|jpg)$/;
			var images = new Array();
			for(var i=0;i<imgelms.length;i++) {
				var src = imgelms[i].src;
				if(src && src.match(imgexp)) {
					images.push([src.replace(imgexp,'/large/$2.jpg'),src.replace(imgexp,'/bmiddle/$2.jpg')]);
				}
			}
			return {
				images: images,
				href:	href,
				text:	text.substr(0,32) + (text.length>32 ? ' ... - ' : '  - ') + title,
				desc:	(text.length > 32 ? text : ''),
			};
		},
		null,
		{dialog:true,no_cache_selector:true,inline:false,loadmode:'Interative'}
	);
	$R('pp\.163\.com',
		['.pic-area img.z-tag','data-lazyload-src'],
		function(elm,src) {
			if(!src) {
				src = elm.getAttribute('src');
			}
			if(!src) return;
			return {text:document.title,src:src};
		}
	);
	
	$R('fengniao\.com\/active\/',
		['.img5 img,dt img','src'],
		'attr_replace',
		[/_\d+\.jpg$/,'_600.jpg'],
		{no_cache_selector:true,dialog:true,click:true}
	);
	
	
	$R('instagram\.com\/[^\/]+$',
		['div.photo-wrapper div.Image','src'],
		function(div,src){
			var thumb;
			if(!src) {
				src = div.getAttribute('style');
				var m = src.match(/background-image:\s*url\s*\("([^"]+)/);
				if(m) {
					src = m[1];
				}
				else {
					return false;
				}
			}
			if(src.match(/\/hphotos-/)) {
				thumb = src;
				src = src.replace(/_\w\.jpg$/,'_o.jpg');
			}
			else {
				return false;
			}
			var href = div.parentNode.getAttribute('href');
			return {src:src,href:href,thumb:thumb};
		},
		null,
		{no_cache_selector:true}
	);
	

	
	$R('item\.jd\.com',
		['.detail-content img','data-lazyload'],
		function(elm,src) {
			if(!src) {
				src = elm.getAttribute('src');
			}
			//src = src.replace(/\/(?:n\d+|popWaterMark)\//,'/n0/');
			if(src) {
				return {src:src,text:$('h1').text()};
			}
		}
	);
	
	$R('item\.jd\.com',
		['.spec-items img','src'],
		function(elm,src) {
			if(src) {
				src = src.replace(/\/(?:n\d+)\//,'/n0/');
				return {src:src,text:$('h1').text()};
			}
		}
	);
	
	$R('item\.taobao\.com',
		['ul img','data-src'],
		function(elm,src) {
			if(src) {
				src = src.replace(/_\d+x\d+\.jpg$/,'');
				return {src:src,text:document.title};
			}
		}
	);
	
	$R('item\.taobao\.com',
		['#description img','src'],
		function(elm,src) {
			if(src && src.match(/\/imgextra\//)) {
				return {src:src,text:document.title};
			}
		},
		null,
		{no_cache_selector:true}
	);
	
	function extract_qvod(text) {
		GM_log("Text:" + text);
		if(!text) return [];
		var links = [];
		if(typeof(text) == 'string') {
			text = decodeURIComponent(text);
			GM_log("LINK:" + text);
			//bdhd://591151719|764A8F073E149B2A476C404CE119CE36|一夜情深BD版.rmvb|
			var exp =/((?:bdhd|qvod):\/\/[^\|]+\|[^\|]+\|[^\|]+\|?|jjhd:\/\/[^\|]+\|[^\|]+\|[^\+\|]+)/g; 
			var m;
			while((m = exp.exec(text)) != null) {
				links.push(m[1]);
			}
			if(!links.length) {
				var exp = /\$((?:jjhd|gvod|qvod|xfmedia|ftp):\/\/[^\$]+)\$/g;
				while((m = exp.exec(text)) != null) {
					links.push(m[1]);
				}
			}
		}
		else {
			for(var prop in text) {
				GM_log("Prop: " + prop);
				var slinks = extract_qvod(text[prop]);
				if(slinks.length) {
					links = links.concat(slinks);
				}
			}
		}
		return links;
	}
	M.register(
		/.*(?:\/player|\/videos|\/Html\/P|\/\?s=vod-play|yuyiyuyi\.com\/gs\/)/,
		  ['body','id'],
		  function() {
			var results = [];		
			for  each (var prop in [
					'VideoListJson',
					'VideoInfoList',
					'VideoListplay',
					'url_list',
					'playdata'
			]) {
				GM_log(prop + " = " + unsafeWindow[prop]);
				var links = extract_qvod(unsafeWindow[prop]);
				for(var i=0;i<links.length;i++) {
					results.push({href:links[i],text:links[i]});
				}
				if(results.length) break;
			}
			if(results.length) {
				return results;
			}
		  },
		  null,
		  {no_cache_selector:true}
	  );

	
	
	
	//Select all jpg
	$R(	
		'tuigirl8\.com\/forum\/view\/',
		['img','src'],
		'attr_match',
		[/^(.+\.jpg$)/,1,null,document.title]
	);
	
	$R(
		'wd\.koudai\.com',
		['#detail_wrap img','src'],
		function(elm,src) {
			if(src && src.match(/\.jpg|\.jpeg/)) {
				return {src:src,text:document.title};
			}
		},
		null,
		{dialog:true,no_cache_selector:true,inline:false,loadmode:'Interative'}
	);

	$R('ffffound.com\/(?:image|home)',
		['div#assets blockquote','id'],
		function(blk,id) {
			var header = $('div.header',blk)[0];
			var link = $('div.title a',header)[0];
			var ref = document.location.href;
			var imgtb = header.nextElementSibling;
			var images = $('table a img',imgtb);
			var r = new Array();
			for(var i=0;i<images.length;i++) {
				if(!images[i].src.match(/_m\.(?:jpg|gif|png|jpeg)$/)) {
					continue;
				}
				r.push({src:images[i].src, href:ref, desc:'Source: ' + link.href, text:link.textContent});
				r.push({src:images[i].src,href:link.href, desc:'Via: ' + ref, text:link.textContent});
				r.push({src:images[i].parentNode.href,href:ref, desc:'Source: ' + link.href, text:link.textContent});
				r.push({src:images[i].parentNode.href,href:link.href, desc:'Via: ' + ref, text:link.textContent});
			}
			return r;
		}
	);
	
	M.addSite('(?:tumblr\.com|tetoxtreme\.com)',
		function() {
			var docs = new Array();
			docs.push(document);
			var ifrs = document.getElementsByTagName('iframe');;
			for(var i=0;i<ifrs.length;i++) {
				if(ifrs[i].contentDocument) {
					docs.push(ifrs[i].contentDocument);
				}
			}

			var r = new Array();
			for(var j=0;j<docs.length;j++) {
				var imgs = docs[j].getElementsByTagName('img');
				for(var i=0;i<imgs.length;i++) {
					var src = imgs[i].src;
					if(src && src.match(/_\d+\.(?:jpg|gif)$/)) {
						src = src.replace(/_250\.(jpg|gif)$/,'_500.$1');
						r.push({src:src,href:document.location.href,text:document.title});
					}
				}
			}
			return r;

		},
		false,
		{dialog:true,no_cache_selector:true,inline:false,loadmode:'Interative'}
	);
	
	$R('xingyun\.cn',
		['figure>a:has("img")','href'],
		function(a,href) {
			return {src:href,href:DOCHREF,text:DOCTITLE};
		}
	);
	
	$R('aweipai\.com',
		['article','class'],
		function(article,cls) {
			var elm = $('embed');
			if(elm) {
				var src = elm[0].src;
				if(src) {
					src = src.replace(/\/share\/flash\//,'/video/');
					var p = article.getElementsByTagName('p')[0];
					return {href:src,text:p.textContent,target:article};
				}
			}
		}
	);
	
	$R('(bbs\.voc\.com\.cn|bbs\.[^\/]+\/topic.+\.html)',
		['img','src'],
		function(img,src) {
			if(src) {
				if(src.match(/http:\/\/image\.hnol\.net\/c\/[^'"]+\.jpg$/)) {
					return {src:src,text:DOCTITLE,href:DOCHREF};
				}  
			}
		}
	)
	
	//****************************************************
	//Weak Rules
	//****************************************************
	//
	M.reg2(/.*/,
		['a:has(img)','href'],
		'attr_match',
		[/^(.+\.(jpg|jpeg|gif|png))$/,1],
	//	RU(
	//		'http://www.theblackalley.(ws|net|biz|info)' 
	//		+ '|http://www.hotasiansnude4u.com'
	//		+ '|tokyochicks.com'
	//		+ '|http://www.jp-pussy.com'
	//		+ '|http://www.midnightasian.com'
	//	),
		{inline:false,dialog:false}
	);
	M.reg2(/.*/,
		['input','src'],
		function(elm,src) {if(src) return {src:src};},
		null,
		{inline:true}
	);
	M.reg2(/.*/,
		['img','src'],
		'attr_replace',
		[/\.jpg\.thumb[s]*\.jpg$/,".jpg"],
		{dialog:true}
	);
	M.reg2(/\/bbs[\/\.]/,
		['img','src'],
		'attr_replace',
		[/bbs\/attachment\.php(.*)/i,"bbs/attachment.php$1\&noupdate=yes\&nothumb=yes"],
		{inline:true}
	);
	
		$myPlace.lib.datashower.init(M);
		$myPlace.lib.datashower.start();
		
})();
		
