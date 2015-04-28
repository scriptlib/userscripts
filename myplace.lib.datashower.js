// ==UserScript==
// @name           myplace.lib.datashower
// @namespace      eotect@myplace
// @description    myplace data shower library
// @version		   1.21
//Changelog
//	2014-05-03
//		Copy codes from the old myplace.imagealbum
// ==/UserScript==


if(!unsafeWindow) {
	unsafeWindow = window;
}
var $myPlace = $myPlace || unsafeWindow.$myPlace || {};
unsafeWindow.$myPlace = $myPlace;
var $ = $myPlace.jQuery || unsafeWindow.$ ;
if(!$myPlace.lib) {
	$myPlace.lib = {};
}


(function(_){
        if(parent != window) {
			return;
		}

	debugPrint("[Start]" + Date());
	var XRZPanel = $myPlace.panel;
	var DOCHREF = document.location.href;
	var DOCTITLE = document.title;
	var ELMLINKS = document.getElementsByTagName('a');
	var ELMIMGS = document.getElementsByTagName('img');
	var DOCIMAGES = new Array();
	var SHOWTABLE = false;
	var PAGECOUNT;
	var LEFTCOUNT;

	const PAGESIZE = 30;
	const PAGESIZEMIN = 5;
	const INDEXSTYLE=' style="text-decoration:underline;cursor:pointer;color:darkblue;" ';
	
	const CURITEMSTYLE  =' style="color:black;" ';
	const IMAGEONLOAD = ' onload="var MAXWIDTH = window.innerWidth*0.97;if (this.width>MAXWIDTH) this.width = MAXWIDTH;" ';
	const ALBUM_TEXT_OPENED = '<strong style="color:red;">*Album</strong>';
	const ALBUM_TEXT_CLOSED = '<font style="text-decoration:underline">Album</font>';
	
	var  DATAMINER;
	var ALBUMNAME;
	var INTERACTIVE_MODE = false;
	//UTILS
	function debugPrint(text) {
		if(console) console.log("lib.datashower: " + text);
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

	
	//PRESENTION
	function post_process(image) {
		var src = image.src;
		var href = image.href;
		var text = image.text;
		var target = image.target;
		var pt = target.parentNode || target;//document.body;
		var pHref = pt.href || DOCHREF || src;
		var pText = pt.textContent || DOCTITLE;
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
				text = target.textContent || pText;
			}
			image.href = href;
			image.text = text;
			return image;
		}
		
		// if(!image.inline) {
			// image.dialog = true;
		// }
		
		var replace = image['replace'];
		var top = pt.parentNode;
		var tagname1 = '';
		var tagname2 = '';
		if(target && target.tagName) {
			tagname1 = target.tagName.toLowerCase();
		}
		if(pt && pt.tagName) {
			tagname2 = pt.tagName.toLowerCase();
		}
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
			if(!text) text = target.textContent;
		}
		else {
			if(!href) {
				href = target.href || pHref;
			}
			if(!text) {
				text = target.textContent || pText;
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
		if(image.click) {
			var et = image.inLink ? pt : target;
			et.setAttribute("href",'javascript:void(0)');
			et.setAttribute("target",'');
			if(replace) {
				target.setAttribute('href',href);
				target.setAttribute('src',src);
			}
			else if(tagname1 == 'img' && image.zoom_button) {
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
			position:'center',
		});
		div.dialog('open');
		return false;
	}
	function showImageInline(element,data) {
		//var $ = unsafeWindow.$;
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
	
	
	function clickOnItem(e){
			var idx = this.getAttribute('imgIndex');
			var delm = document.getElementById('xz_imagesminer_images_' + idx);
			if(delm) {
				var se = delm.getAttribute('selected') || '0';
				var tp = document.getElementById('datashower_item_' + idx);
				if(se == '1') {
					tp.style.border = '1px dashed grey';
					tp.style.backgroundColor = null;
					delm.setAttribute('selected',0);
				}
				else {
					tp.style.border = '1px solid red';
					tp.style.backgroudColor = '#000000';
					delm.setAttribute('selected',1);
				}
			}
	}
	
	function appendItem(item,idx,contPanel) {
	

		
		var ITEMSTYLE,ITEMTITLESTYLE,ITEMINDEXSTYLE,ITEMLINKSTYLE,ITEMDESCSTYLE,ITEMIMAGESTYLE;
		
		ITEMSTYLE = 'text-align:left;padding-bottom:40px;border:dashed 1px grey;display:block;';
		ITEMTITLESTYLE = 'text-align:left;color:darkblue;padding-left:20px;font-weight:bold;';
		ITEMINDEXSTYLE = 'font-size:30pt;';
		ITEMDESCSTYLE = '';
		ITEMIMAGESTYLE = '';
	
		var itemElm = document.createElement('div');
		itemElm.setAttribute('class','datashower_item');
		itemElm.setAttribute('style',ITEMSTYLE);
		itemElm.setAttribute('imgIndex',idx-1);
		itemElm.id = 'datashower_item_' + (idx-1);
		itemElm.addEventListener('click',clickOnItem);
		
		var itemTitle = document.createElement('div');
		itemTitle.setAttribute('class','datashower_itemtitle');
		itemTitle.setAttribute('style',ITEMTITLESTYLE);
		var title1 = document.createElement('span');
		if(item.no_index) {
			title1.innerHTML = "";
		}
		else {
			title1.innerHTML = '#' + idx;
		}
		title1.setAttribute('style',ITEMINDEXSTYLE);
		

			
		title1.setAttribute('imgIndex',idx-1);
		title1.addEventListener('click',clickOnItem);
		itemTitle.appendChild(title1);
		
		var title2 = document.createElement('span');
		
		var titleText = item.text ? item.text : '';
		if(item.href) {
			title2.innerHTML = '<a href="' + item.href + '">' + titleText + '</a>';
		}
		else {
			title2.innerHTML = titleText;
		}
		itemTitle.appendChild(title2);
		itemElm.appendChild(itemTitle);
		
		//Desc
		if(item.desc) {
			var itemDesc = document.createElement('div');
			itemDesc.setAttribute('class','datashower_itemdesc');
			itemDesc.setAttribute('style',ITEMDESCSTYLE);
			itemDesc.innerHTML = '<p><blockquote style="width:70%">' + item.desc + '</blockquote></p>';
			itemElm.appendChild(itemDesc);
		}
		//Content
		if(item.src) {
			var itemImage = document.createElement("div");
			itemImage.setAttribute('class','datashower_itemimage');
			itemImage.setAttribute('style',ITEMIMAGESTYLE);
			if(item.thumb) {
				itemImage.innerHTML='<img onclick=\'this.src=this.getAttribute("data-src");\' ' + IMAGEONLOAD +  'data-src="' + item.src + '" src="' + item.thumb + '"></img>' 
			}
			else {
				itemImage.innerHTML='<img' + IMAGEONLOAD +  'src="' + item.src + '"></img>' 
			}
			itemElm.appendChild(itemImage);
		}
		contPanel.appendChild(itemElm);
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
		var id = 'xz_imagesminer_data';
		var contPanel = document.getElementById(id);
		if(contPanel) {
			contPanel.parentNode.removeChild(contPanel);
		}
		contPanel = document.createElement("ul");
		contPanel.id = id 
		contPanel.style.display = 'none';
		for(var curPage = 0;curPage<DOCIMAGES.length;curPage++) {
			var li = document.createElement('li');
			li.id = "xz_imagesminer_images_" + curPage;
			li.setAttribute('imgIndex',curPage);
			for(var prop in DOCIMAGES[curPage]) {

				li.setAttribute(prop,DOCIMAGES[curPage][prop]);
			}
			//appendItem(DOCIMAGES[curPage],curPage+1,li);
			contPanel.appendChild(li);
		}
		document.body.appendChild(contPanel);
		if($myPlace) {
			if($myPlace.Cached) {
				$myPlace.Cached.IMAGESMINER = DOCIMAGES;
			}
			else {
				$myPlace.Cached = {
					IMAGESMINER: DOCIMAGES,
				}
			}
		}
		//contPanel.id = contPanelId;
	}

	function showDialog(content) {
			var nvPanel = document.createElement("div");		
			var ctrlBar = document.createElement('div');
			var nvHolder = document.createElement('div');					
			ctrlBar.innerHTML = '<span style="float:left;text-align:center;width:95%">MyPlace Dialog</span>';
			var closeBtn = document.createElement('button');;
			closeBtn.setAttribute('style','text-color:red;text-align:right');
			closeBtn.innerHTML = 'X';
			closeBtn.addEventListener('click',function(){nvPanel.parentNode.removeChild(nvPanel);},false);
			ctrlBar.appendChild(closeBtn);			
			nvPanel.appendChild(ctrlBar);
			nvPanel.setAttribute('style',
				  'text-align:center;margin:0px;padding:4px;'
				+ 'background-color:#F9FFE5;overflow:scroll;'
				+ 'position:fixed;top:88px;left:2%;'
				+ 'width:95%;height:600px;'
				+ 'z-index:100000027;border:solid black 1px'
			);			
			ctrlBar.setAttribute('style',
				  'text-color:block;background-color:grey;'
				+ 'margin:0px;padding:4px;'
				+ 'position:fixed;top:60px;left:2%;'
				+ 'width:95%;height:20px;'
				+ 'z-index:100000027;border:solid black 1px'
			);			
			nvHolder.appendChild(content);
			nvPanel.appendChild(nvHolder);
			document.body.appendChild(nvPanel);
			return nvPanel;
	}
	
	// function setData(sec,key,value) {
		// var dataElement = document.getElementById('myplace_imagesalbum_data');
		// if(!dataElement) return;
		// var secElement = dataElement.getElementById(sec);
		// if(!secElement) {
			// secElement = document.createElement('li');
			// dataElement.appendChild(secElement);
		// }
		// secElement.setAttribute(key, value.length ? value.join(",") : value);		
	// }
	
	function loadPage(idxPage,hidePanel) {
		if (idxPage>PAGECOUNT) return;
		var nvPanel = document.getElementById("xrlin_imgAlbum");
		if (nvPanel) {
			nvPanel.removeChild(document.getElementById('myplace_datashower_nvholder'));
		}
		else {
			nvPanel = document.createElement("div");
			
			
			// var dataElement = document.createElement('ul');
			// dataElement.id = 'myplace_imagesalbum_data';
			// dataElement.style.display = 'none';
			// dataElement.innerHTML = '<li id="selected_item"><li>';
			
			// nvPanel.appendChild(dataElement);
			
			var ctrlBar = document.createElement('div');
			ctrlBar.innerHTML = '<span style="float:left;text-align:center;width:95%">MyPlace Images  Album</span>';
			var closeBtn = document.createElement('button');;
			closeBtn.setAttribute('style','float:right;text-color:red;');
			closeBtn.innerHTML = 'X';
			closeBtn.addEventListener('click',toggleAlbum,false);
			ctrlBar.appendChild(closeBtn);
			
			nvPanel.appendChild(ctrlBar);
			nvPanel.id="xrlin_imgAlbum";
		//    nvPanel.style.position = "fixed";
		//    nvPanel.style.top = "100px";
		//    nvPanel.style.height = "800";
			//nvPanel.style.overFlow = "auto";
		//    nvPanel.style.overFlow = "scroll";
			nvPanel.setAttribute('style',
				  'text-align:center;margin:0px;padding:4px;'
				+ 'background-color:#F9FFE5;overflow:scroll;'
				+ 'position:fixed;top:80px;left:2%;'
				+ 'width:95%;height:600px;'
				+ 'z-index:100000027;border:solid black 1px'
			);
			
			ctrlBar.setAttribute('style',
				  'text-color:block;background-color:grey;'
				+ 'margin:0px;padding:4px;'
				+ 'position:fixed;top:60px;left:2%;'
				+ 'width:95%;height:20px;'
				+ 'z-index:100000027;border:solid black 1px'
			);
			
			//ctrlBar.setAttribute('style','width:100%;position:fixed;');
			
			//opacity="0.95";
			//    zIndex="32767";border="solid #000000 1px";
			//    position="fixed";top="60px";left="2%";
				//width="95%";
			
		}
		var nvHolder = document.createElement('div');
		nvHolder.id = 'myplace_datashower_nvholder';
		
		createIndexPanel(idxPage,PAGECOUNT,nvHolder); 
		var head = document.createElement("span");
		head.innerHTML = "----<BR />";
		nvHolder.appendChild(head);
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
			$(li).click(function(){
				
			});
			contPanel.appendChild(li);
		}
		nvHolder.appendChild(contPanel);
		createIndexPanel(idxPage,PAGECOUNT,nvHolder); 
		nvPanel.appendChild(nvHolder);
		//document.body.appendChild(nvPanel);
		// $(nvPanel).dialog({
			// 'autoOpen':false,
			// 'width': window.innerWidth - 60,
			// 'height':window.innerHeight - 60,
			// 'position':'center',
			// 'title':'Images Album',
			// 'model':true
		// });
		// var dialog = $(nvPanel).dialog('widget');
		// dialog.zIndex('32768');
		document.body.insertBefore(nvPanel,document.body.firstChild);
		if(!hidePanel) {
			//$(nvPanel).dialog('open');
			nvPanel.style.display = 'block';
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
	function start() {
		if(!DOCHREF) {
			return -1;
		}
		var Interative = false;
		var Quickload = false;
		var Postload = false;
		var Manually = false;
		for(var i=0;i<DATAMINER.MINER.length;i++) {
			var miner = DATAMINER.MINER[i];
			var site_exp = miner[0];
			var property = miner[4] || {};
			if(site_exp && DOCHREF.match(site_exp)) {
				if(property.loadmode) {
					if(property.loadmode == 'Interative') {
						Interative = true;
						break;
					}
					else if(property.loadmode == 'Postload') {
						Postload = true;
						break;
					}
					else if(property.loadmode == 'Quickload') {
						Quickload = true;
						break;
					}
					else if(property.loadmode == 'Manually') {
						Manually = true;
					}
				}
			}
		}
		if(Postload) {
			INTERACTIVE_MODE = true;
			window.addEventListener('load',
				function() {
					loadAll();
					debugPrint("[End]" + Date());
				},false
			);
		}
		else if(Interative) {
			INTERACTIVE_MODE = true;
			loadAll();
			debugPrint("[End]" + Date());
		}
		else if(Manually) {
		}
		else {
			INTERACTIVE_MODE = false;
			loadAll();
			debugPrint("[End]" + Date());
		}
	}
	function cloneObject(a) {
		var b = {};
		for(c in a) {
			b[c] = a[c];
		};
		return b;
	}
	var ALBUMINFO,ALBUMLENGTH,SELECTEDITEM;
	function toggleAlbum() {
		return showImgTable(ALBUMINFO,ALBUMLENGTH);
	}
	function loadAll() {
		//SELECTEDITEM = [];
		var DATA = DATAMINER.collect();
		for(var i=0;i<DATA.length;i++) {
			if(DATA[i].images) {
				for(var j=0;j<DATA[i].images.length;j++) {
					var img = cloneObject(DATA[i]);
					if(img.images[j].length) {
						img.src = img.images[j][0];
						img.thumb = img.images[j][1];
					}
					img.images = null;
					DOCIMAGES.push(img);
				}
			}
			else {
				DOCIMAGES.push(DATA[i]);
			}
		}
		
		debugPrint("Get " + DOCIMAGES.length + (DOCIMAGES.length>1 ? " images" : ' image'));
		for(var i=0;i<DOCIMAGES.length;i++) {
			DOCIMAGES[i] = post_process(DOCIMAGES[i]);
		}
		ExportData(DOCIMAGES);
		unsafeWindow.DOCIMAGES = DOCIMAGES;
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
			
			
			
			ALBUMINFO = albumInfo;
			ALBUMLENGTH = slen;
			
			
			
			albumInfo.addEventListener("click",toggleAlbum,false);
			
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


	//REGISTER MINER END

	//document.addEventListener("DOMContentLoaded", loadAll,true);
	//window.addEventListener("load", loadAll,true);
	
	_.datashower = {
		'init'	: 	function(miner,albumname) {
			DATAMINER = miner;
			ALBUMNAME = albumname;
		},
		'start'	: 	function() {
				return start();
			},
		'load'	:	function(reload){
				if(reload) {
					reloadAll();
				} 
				else {
					loadAll();
				}
		},
	};

})($myPlace.lib);



