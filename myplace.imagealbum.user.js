// ==UserScript==
// @name           myplace.imagealbum
// @namespace      eotect@myplace
// @description    Internet images miner
// @require		   myplace.lib.dataminer.js
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
// @include http*://www.colorbird.com/*
// @include http*://colorbird.com/*
// @include http*://*.tistory.com/*
// @include http*://www.facebook.com/*
// @include http://www.oisinbosoft.com/*
// @include http://www.arzon.jp/*
// @version 1.002
//Changelog
//	2013-09-27
//		Add support for oisinbosoft.com
//		Add support for arzon.jp
// ==/UserScript==


var $myPlace = $myPlace || unsafeWindow.$myPlace || {};
unsafeWindow.$myPlace = $myPlace;
var $ = $myPlace.jQuery || unsafeWindow.$;
var XRZPanel = $myPlace.panel;
if(!XRZPanel.init()) return false;


(function(_){

	debugPrint("Start:" + Date());
	var DOCHREF = document.location.href;
	var ELMLINKS = document.getElementsByTagName('a');
	var ELMIMGS = document.getElementsByTagName('img');
	var DOCIMAGES = new Array();
	var SHOWTABLE = false;
	var PAGECOUNT;
	var LEFTCOUNT;

	const PAGESIZE = 25;
	const PAGESIZEMIN = 5;
	const INDEXSTYLE=' style="text-decoration:underline;cursor:pointer;color:darkblue;" ';
	const ITEMSTYLE =' style="text-align:left;color:darkblue;padding-left:20px;" ';
	const IMAGESTYLE='  style="border:1px solid #000000;background-color:#EEEEEE;padding:2px;margin-bottom:20px;" ';
	const CURITEMSTYLE  =' style="color:black;" ';
	const IMAGEONLOAD = ' onload="var MAXWIDTH = window.innerWidth*0.97;if (this.width>MAXWIDTH) this.width = MAXWIDTH;" ';
	const ALBUM_TEXT_OPENED = '<strong style="color:red;">*Album</strong>';
	const ALBUM_TEXT_CLOSED = '<font style="text-decoration:underline">Album</font>';

	var INTERACTIVE_MODE = false;
	//UTILS
	function debugPrint(text) {
		if(console) console.log("ImageAlbum: " + text);
	}

	function getBaseName(strHref) {
		var result = strHref;
		if (!strHref) {
			return '';
		}
		if(strHref.match(/\/+$/)) {
			result = strHref.replace(/\/+$/,'');
		}
		result=strHref.replace(/.*\//,"");
		if (result == "" ) 
			result = strHref;
		return result;
	}

	//DATA MINER
	var M = new $myPlace.lib.dataMiner(DOCHREF);
	var $M = function(a1,a2,a3,a4,a5,a6,a7,a8,a9) {
		return M.reg(a1,a2,a3,a4,a5,a6,a7,a8,a9);
	};
	var $R = function(a1,a2,a3,a4,a5,a6,a7,a8,a9) {
		a1 = new RegExp('https?:\\/\\/[^\\.\\/]*\\.?' + a1);
		return M.reg(a1,a2,a3,a4,a5,a6,a7,a8,a9);
	};
	//DATA MINER END
	//PRESENTION
	function post_process(image) {
		var src = image.src;
		var href = image.href;
		var text = image.text;
		var target = image.target;
		var pt = target.parentNode || target;//document.body;
		var pHref = pt.href || document.location.href || src;
		var pText = pt.text || pt.textContent || document.title;
		if(!pText) {
			pText = getBasename(pHref);
		}
		if(pt.nodeName.toUpperCase() == 'A') {
			image.inLink = true;
		}
		if(image.no_edit) {
			if(!href) {
				href = target.href || pHref;
			}
			if(!text) {
				text = target.text || pText;
			}
			image.href = href;
			image.text = text;
			return image;
		}
		if(!image.inline) {
			image.dialog = true;
		}
		var replace = image['replace'];
		var top = pt.parentNode;
		var tagname1 = target.tagName.toLowerCase();
		var tagname2 = pt.tagName.toLowerCase();
		
		if(tagname1 == 'img' && tagname2 == 'a') {
			if(!href) {
				href = pHref;
			}
			if(!text) {
				text = pText;
			}
		}
		else if(tagname1 == 'a') {
			if(!href) href = target.href;
			if(!text) text = target.text;
		}
		else {
			if(!href) {
				href = target.href || pHref;
			}
			if(!text) {
				text = target.text || target.textContent || pText;
			}
		}
		image.href = href;
		image.text = text;
		if(image.copy) {
				var dup = target.cloneNode(false);
				dup.innerHTML = dup.innerHTML + '[Source]';//getBaseName(href);
				$(dup).insertAfter(target);
		}
		if(image.ontop) {
			pt.removeChild(target);
			top.appendChild(target);
			
		}
		else if(image.container) {
			target.parentNode.removeChild(target);
			container.appendChild(target);
		}
		//debugPrint(target.tagName + "[inline]" + inline + "\n" + src + "\n" + href + "\n" + text + "\n");
		if(!image.no_click) {
			var et = image.inLink ? pt : target;
			et.setAttribute("href",'javascript:void(0)');
			et.setAttribute("target",'');
			if(replace) {
				target.setAttribute('href',href);
				target.setAttribute('src',src);
			}
			else if(tagname1 == 'img' && !image.no_button) {
				var btn = document.createElement('button');
				btn.innerHTML = '+';
				btn.setAttribute('style','position:absolute;margin:10px;display:none');
				pt.appendChild(btn);
				btn.style.top = target.offsetTop + 'px';
				btn.style.left = (target.offsetLeft + target.clientWidth - 60 ) + 'px';
				btn.addEventListener('click',(image.inline ?
					function(){return showImageInline(target,image);} : 
					function(){return showImageDialog(target,image);}),
					false
				);
				target.addEventListener('mouseenter',function(){
					btn.style.display = 'block';
				});
				target.addEventListener('mouseleave',function(){
					btn.style.display = 'none';
				});
				btn.addEventListener('mouseenter',function(){
					btn.style.display = 'block';
				});
			}
			else {
				et.addEventListener('click', (image.inline ?
					function(){return showImageInline(target,image);} : 
					function(){return showImageDialog(target,image);}),
					false
				);
			}
		}
		return image;
	}

	function new_image_from(src,href,text,elm,dialog) {
		return {
			src		:src,
			href	:href,
			text	:text,
			target	:elm,
			inline	:(!dialog),
		};
	}


	function openImageDialog(element,type) {
		if(type) {
			return showImageDialog(element);
		}
		else {
			return showImageInline(element);
		}
	}
	function showImageDialog(element,data) {
		var text = data.text;//element.getAttribute('d_text');
		var src = data.src;//element.getAttribute('d_src');
		var href = data.href;//element.getAttribute('d_href');
		var dialogSize = window.innerWidth*0.8;
		var img = $('<img />',{
			src:src,
			title:text,
			alt:'loading ' + src,
			click	:function() {
				$('#XRLIN_IMAGE_DIALOG').dialog('close');
			},
			load	:function() {
				var MAXWIDTH = dialogSize-50;
				if (this.width>MAXWIDTH) this.width = MAXWIDTH;
			}
			//style:'position:relative;z-index:32767;width:100% !important;height:100% !important',
		});
		var div = document.getElementById('XRLIN_IMAGE_DIALOG');
		if(div) {
			div = $(div);
		}
		else {
			div = $('<div />', {
				id		:'XRLIN_IMAGE_DIALOG',
				style: 'text-align:center;',
				width:	dialogSize - 40,
				//style	:'position:relative;z-index:32767;width:100% !important;height:100% !important',
				click	: function(e) {
					$(e.target).dialog('close');
				}
			});
		}
		div.children().remove();
		$('<a href="' + href + '">' + text + '</a><BR/>').appendTo(div);
		div.append(img);
		div.dialog({
			title:text,
			autoOpen:false, 
			'width': dialogSize,
			'height':(window.innerHeight)*0.9,
			position:'center'
		});
		div.dialog('open');
		return false;
	}
	function showImageInline(element,data) {
		var $ = unsafeWindow.$;
		if(element.getAttribute('XRLIN_HAVE_PARENT')) {
			$(element).prev().show();
			$(element).hide();
			return 1;
		}
		else if(element.getAttribute('XRLIN_HAVE_CHILD')) {
			$(element).hide();
			$(element).next().show();
			return 1;
		}
		var text = data.text;//element.getAttribute('d_text');
		var src = data.src;//element.getAttribute('d_src');
		var href = data.href;//element.getAttribute('d_href');
		element.setAttribute('XRLIN_HAVE_CHILD',1);
		//element.setAttribute('src',src);
		//element.src = src;
		//element.setAttribute('height','auto');
		//element.setAttribute('width','auto');
		var img = $('<img />',{
			src:src,
			title:text,
			alt:'loading ' + src,
			style:'position:relative;z-index:32767;',
			'XRLIN_HAVE_PARENT': 1,
			click: function() {
					return showImageInline(this);
				},
		});
		$(element).after(img);
		$(element).hide();
	}

	function appendIndexLink(idx,text,idxPanel) {
		var idxPage = document.createElement("span");
		idxPage.innerHTML="<span" + INDEXSTYLE + ">" + text + "</span>"
		idxPage.addEventListener("click",function(){loadPage(idx);},false);
		var sep = document.createElement("span");
		sep.innerHTML="&nbsp;&nbsp;";
		idxPanel.appendChild(idxPage);
		idxPanel.appendChild(sep);
	}
	function appendItem(item,idx,contPanel) {
		var itemLink = document.createElement("div");
		itemLink.style.textAlign="left";
		itemLink.innerHTML='<a' +  ITEMSTYLE + 'href="' + item.href + '">' + idx + "." +  item.text + '</a>'; 
		contPanel.appendChild(itemLink);
		var itemImage = document.createElement("div");
		itemImage.innerHTML='<img' + IMAGESTYLE + IMAGEONLOAD +  'src="' + item.src + '"></img>' 
		contPanel.appendChild(itemImage);
	}
	function createIndexPanel(idxPage,count,nvPanel) {
		if (count>1) {
			var idxPanel = document.createElement("div");
			idxPanel.style.textAlign="center";
			idxPanel.style.width="100%";
			idxPanel.style.padding="5px";

			if (idxPage>1) 
				appendIndexLink(idxPage-1,"Prev",idxPanel);

			var curItem = document.createElement("span");
			curItem.innerHTML = "<span" + CURITEMSTYLE +">" + "[" + idxPage + "]&nbsp;&nbsp;" + "</span>";
			idxPanel.appendChild(curItem);
			/*
			for (var curIdx=1;curIdx<idxPage;curIdx++) 
				appendIndexLink(curIdx,curIdx,idxPanel);
			for (var curIdx=idxPage + 1;curIdx<=count;curIdx++)
				appendIndexLink(curIdx,curIdx,idxPanel);
			*/

			if (idxPage<count) 
				appendIndexLink(idxPage+1,"Next",idxPanel);
			nvPanel.appendChild(idxPanel);
		}   
	}

	function ExportData(DOCIMAGES) {
		var contPanel = document.createElement("ul");
		contPanel.id = 'xz_imagesminer_data';
		contPanel.style.display = 'none';
		for(var curPage = 0;curPage<DOCIMAGES.length;curPage++) {
			var li = document.createElement('li');
			for(var prop in DOCIMAGES[curPage]) {
				li.setAttribute(prop,DOCIMAGES[curPage][prop]);
			}
			//appendItem(DOCIMAGES[curPage],curPage+1,li);
			contPanel.appendChild(li);
		}
		document.body.appendChild(contPanel);
		//contPanel.id = contPanelId;
	}

	function loadPage(idxPage,hidePanel) {
		if (idxPage>PAGECOUNT) return;
		var nvPanel = document.getElementById("xrlin_imgAlbum");
		if (nvPanel) nvPanel.parentNode.removeChild(nvPanel);
		nvPanel = document.createElement("div");
		nvPanel.id="xrlin_imgAlbum";
	//    nvPanel.style.position = "fixed";
	//    nvPanel.style.top = "100px";
	//    nvPanel.style.height = "800";
		//nvPanel.style.overFlow = "auto";
	//    nvPanel.style.overFlow = "scroll";
		with (nvPanel.style) {
			textAlign="center";margin="0px";padding="4px";
			backgroundColor="#F9FFE5";//opacity="0.95";
		//    zIndex="32767";border="solid #000000 1px";
		//    position="fixed";top="60px";left="2%";
			overflow = "scroll";height="100%";
			//width="95%";
		}
		createIndexPanel(idxPage,PAGECOUNT,nvPanel); 
		var head = document.createElement("span");
		head.innerHTML = "----<BR />";
		nvPanel.appendChild(head);
		var contPanel = document.createElement("ul");
		contPanel.id = 'xz_imagesminer_show';
		//contPanel.id = contPanelId;
		var maxPage = PAGESIZE*idxPage;
		if (maxPage>DOCIMAGES.length) maxPage = DOCIMAGES.length;
		if (idxPage==PAGECOUNT && LEFTCOUNT<PAGESIZEMIN) {
			maxPage = maxPage + LEFTCOUNT;
		}
		for(var curPage=PAGESIZE*(idxPage-1);curPage<maxPage;curPage++) {
			var li = document.createElement('li');
			//for(var prop in DOCIMAGES[curPage]) {
			//	li.setAttribute(prop,DOCIMAGES[curPage][prop]);
			//}
			appendItem(DOCIMAGES[curPage],curPage+1,li);
			contPanel.appendChild(li);
		}
		nvPanel.appendChild(contPanel);
		createIndexPanel(idxPage,PAGECOUNT,nvPanel); 
		//document.body.appendChild(nvPanel);
		$(nvPanel).dialog({
			'autoOpen':false,
			'width': window.innerWidth - 60,
			'height':window.innerHeight - 60,
			'position':'center',
			'title':'Images Album',
			'model':true
		});
		
		//document.body.insertBefore(nvPanel,document.body.firstChild);
		if(!hidePanel) {
			$(nvPanel).dialog('open');
		}
		else {
			nvPanel.style.display = 'none';
		}
		return nvPanel;
	}

	function showImgTable(elm,count,pre1,pre2) {
		var nvPanel = document.getElementById("xrlin_imgAlbum");
		if (nvPanel == null) {
			elm.innerHTML = ALBUM_TEXT_OPENED + count;
			nvPanel = loadPage(1);
		}
		else {
			var show = nvPanel.style.display;
			if(show == 'none') {
				nvPanel.style.display = "block";
				elm.innerHTML = ALBUM_TEXT_OPENED + count ;
				$(nvPanel).dialog('open');
			}
			else {
				nvPanel.style.display = "none";
				elm.innerHTML = ALBUM_TEXT_CLOSED + count;  
				$(nvPanel).dialog('close');
			}
		}
	}
	function loadAll() {
		DOCIMAGES = M.collect(DOCIMAGES);	
		unsafeWindow.DOCIMAGES = DOCIMAGES;
		debugPrint("Get " + DOCIMAGES.length + " result");
		for(var i=0;i<DOCIMAGES.length;i++) {
			DOCIMAGES[i] = post_process(DOCIMAGES[i]);
		}
		ExportData(DOCIMAGES);
		//storeData(DOCIMAGES,document);
		PAGECOUNT = Math.floor((DOCIMAGES.length-1)/PAGESIZE) + 1;
		if (PAGECOUNT<0) PAGECOUNT=0;
		
		if (PAGECOUNT>1) {
			LEFTCOUNT =  DOCIMAGES.length - (PAGECOUNT-1)*PAGESIZE;
			if (LEFTCOUNT<0) LEFTCOUNT= 0;
			if (LEFTCOUNT>0 && LEFTCOUNT<PAGESIZEMIN) --PAGECOUNT;
		}
		else {
			LEFTCOUNT = 0;
		}
		if (DOCIMAGES.length>0 || INTERACTIVE_MODE) {
			/*Alubm panel*/
			var slen = '[' + DOCIMAGES.length + ']';
			var control_id = 'xz_image_album_control';
			var my_control = document.getElementById(control_id);
			if(my_control) {
				my_control.parentNode.removeChild(my_control);
			}
			my_control = document.createElement('span');
			my_control.innerHTML = '&nbsp;';
			my_control.id = control_id;
			var albumInfo = document.createElement("span");
			albumInfo.innerHTML=ALBUM_TEXT_CLOSED + slen ;
			//albumInfo.style.textDecoration = "underline";
			albumInfo.style.cursor="pointer";
			albumInfo.addEventListener("click",function() {showImgTable(albumInfo,slen);},false);
			my_control.appendChild(albumInfo);
			
			
				/*Alubm panel*/
			var albumReloadBar = document.createElement("span");
			albumReloadBar.innerHTML='[R]';
			albumReloadBar.title = 'Reload';
			//albumReloadBar.style.textDecoration = "underline";
			albumReloadBar.style.cursor="pointer";
			albumReloadBar.addEventListener("click",function() {reloadAll();},false);
			my_control.appendChild(albumReloadBar);
			
			//alert(XRZPanel.DOMBox);
			if(PAGECOUNT>1) {
				var albumPage = document.createElement("span");
				albumPage.innerHTML=",Page: ";
				my_control.appendChild(albumPage);
				for (var i=1;i<=PAGECOUNT;++i) {
					appendIndexLink(i,i,my_control);
				}
			}
		
			XRZPanel.add(my_control);
		   //     XRZPanel.addSpace();
			XRZPanel.show();
			//loadPage(1,true);
			if (SHOWTABLE) showImgTable(albumInfo,'[' + DOCIMAGES.length + ']');
		}
	}

	function reloadAll() {
		DOCIMAGES = new Array();
		var nvPanel = document.getElementById("xrlin_imgAlbum");
		if(nvPanel) {
			nvPanel.parentNode.removeChild(nvPanel);
		}
		loadAll();
	}
	//PRESENTION END


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
	//onMouseMove="OpenDiv('�鹵',this,195,139,'http://t1.goojje.com/b2/f3/93/b2f32a93349c04a4027a7540da0b7813.jpg','<em>�鹵</em>ս��','350X250-61k','http://v.766.com/zy/201011/20101124_40360.html','http://v.766.com/system/uploadimg/video/201008/pocle_20100830115444_9187.jpg',true)"

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
		{dialog:true,no_cache_selector:true}
	);

	//http://ww3.sinaimg.cn/large/684e58a1tw1dgd30cyt75j.jpg
	M.register(/t\.sina\.com\.cn|(\/\/|www\.|m.)weibo\.com|weitu\.sdodo\.com/,
		['img','src'],
		'attr_replace',
		[/\/(bmiddle|thumbnail|thumb\d+|small|square|mw690)\/(.+)\.jpg$/,'/large/$2.jpg'],
		 {dialog:true,no_cache_selector:true}
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
		[/^(.+\/src\/([^\.\/]+\.(jpg|png|jpeg|gif)))$/,1],
		{inline:true,no_wrap:true}
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
		{}
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
	M.reg(/http:\/\/blog\.sina\.com\.cn/,
		['img','real_src'],
		'attr_replace',
		[/\/(orignal|bmiddle|middle|small)\//,'/orignal/'],
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
		['.images_table img','src'],
		function(elm,src) {
			var jelm = elm.parentNode.parentNode;
			var href = elm.parentNode.href;
			if(!href) {
				return false;
			}
			var match = href.match(/imgurl=([^&]*)&imgrefurl=([^&]*)&/);
			if(!match) {
				return false;
			}
			var text =  jelm.parentNode.textContent.replace(/\s*\.\.\.\s*\d+\s*×\s*\d+\s*-.*$/,'');
			return {
				src: unescape(match[1]),
				href: unescape(match[2]),
				text: text,
			};
		},
		[],
		{dialog:true,no_button:true}
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

	$R('moko\\.cc',
		['.picBox>img','src2'],
		'attr_set',
		null,
		{dialog:true}
	);

	$R('google.com\/bookmarks',
		['#search>span','id'],
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
			var links = elm.innerHTML.match(/href="\.\/url\?[^"]*?url=([^"&]+)/);
		/*
			alert(elm.innerHTML);
			alert(links);
			fail();
		*/
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
			image.text = image.title + "\n" + image.description;
			if(image.tags) {
				image.tags = image.tags.replace(/,?\s*unsorted bookmarks\s*/i,'');
				image.text += "[" + image.tags + "]";
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
		['div','data-starred-src'],
		'attr_replace',
		[/(\/|\/p\d+x\d+\/|\/s\d+x\d+)([^\/]+)_n\.jpg$/,'/$2_o.jpg'],
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

	//REGISTER MINER END

	//document.addEventListener("DOMContentLoaded", loadAll,true);
	//window.addEventListener("load", loadAll,true);

	if(!DOCHREF) {
	}
	else if(DOCHREF.match(/weibo\.com|t\.qq\.com/)) {
		window.addEventListener('load',
			function() {
				loadAll();
				debugPrint("End:" + Date());
			},false
		);
	}
	else {
		if(DOCHREF.match(/photo\.weibo\.com/)) {
				INTERACTIVE_MODE = true;
		}
		loadAll();
		debugPrint("End:" + Date());
	}

})($myPlace);



