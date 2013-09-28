// ==UserScript==
// @name           myplace.navigator
// @namespace      eotect@myplace
// @description    $myPlace.navigator
// @include        http*
// @exclude			*google.*
// @version			1.01
// @grant 		none
// ==/UserScript==

if(!unsafeWindow) {
	unsafeWindow = window;
}
var $myPlace = $myPlace || unsafeWindow.$myPlace || {};
unsafeWindow.$myPlace = $myPlace;
var $ = unsafeWindow.$ || $myPlace.jQuery;
var XRZPanel = $myPlace.panel;

(function(_){

	function debugPrint(text) {
		//GM_log("LinksNavigator:" + text);
	}

	var subLinks = new Array();
	var base=document.location.href;
	var host=document.location.host;
	const PANEL_TEXT_SHOW = '<strong>*LinksNav</strong>';
	const PANEL_TEXT_HIDE = 'LinksNav';

	debugPrint("base->" + base);
	debugPrint("host->" + host);
	var links=document.getElementsByTagName("a");
	var host_links = new Array();
	for(var i=0;i<links.length;i++) {
		if(links[i].href.match(":\/\/" + host + "\/"))
			host_links.push(links[i]);
	}
	debugPrint("links->" + links.length);
	debugPrint("host_links->" + host_links.length);

	var f_exps = new Array();
	var filters = new Array();

	function register_exp(base,exp) {f_exps.push({loc:base,href:exp});}
	function register_filter(base,func) {filters.push({base:base,test:func});}

	register_filter(/http:\/\/club\.china\.com\/+data\/threads\//,
		function(href,base) {
			var mbase = base.replace(/^.*\/threads\/([^\/]*)\/.*$/,"$1");
			var exp_link = new RegExp("/thread/" + mbase + "/");
			if(href.match(exp_link)) {
				return href;
			}
			return false;
		}
	);

	register_filter(/tu11\.com\//i,
		function (href) {
			if(href.match(/tu11\.com\/new\//) && !href.match("index"))
				return href;
			return false;
		}
	);

	register_filter(/uggc/,
		function (href) {
			var match = href.match(/arjJvaqbj%28%27(.+)%27%29/i);
			if(match) {
				return href = "http://" + host + "/index.php?q=" + match[1];
			}
			return false;
		}
	);
	register_exp(null,/\/htm_data\//);
	register_exp(/\/thread\.php\?fid-\d+/,/\/html\/read\/|\/read\.php\?tid-\d+\.html$|\/read\.php\?tid-\d+-fpage-\d+\.html$/);
	register_exp(/\/(forum|bbs)/,/\/viewthread.php\?tid=[0-9]+&extra=page=[0-9]+$/);
	register_exp(/(\/forum|\/bbs)/i,/\/thread-[0-9]+-\d+-\d+\.html/);
	register_exp(/\/archiver\//i,/\/tid-[0-9]+\.html/);
	register_exp(/\/simply\/\?/,/\?tid-\d+-[^\.]+\.html$/);
	register_exp(null,/\/html\/[0-9]+\/[0-9]+\.html$/);
	register_exp(null,/\/forum\/showthread.php\?/);
	register_exp(null,/\/topic-\d+-1-1.html$/);
	register_exp(/club\.yule\.sohu\.com\//,/r-mmphoto-\d+-\d+-\d+-0\.html/);
	register_exp(null,/\/ShowPost\.asp\?ThreadID=\d+/);
	register_exp(null,/\/topic-\d+-1-1.html$/);
	register_exp("hhhggg.info",/\d+.html$/);
	register_exp(null,/\/read.php\?tid=\d+$/);
	register_exp(null,/\/viewthread\.php\?tid=\d+$/);
	register_exp(null,/\/topics\/[^\/]+\/$/);
	register_exp(null,/\/show\.php\?hash=/);
	register_exp(null,/\/5uwl\//);
	register_exp(/\/html\/.*\/$/,/\/html\/.*\.html$/);
	register_exp(null,/\/webpage\/P\/.*\.Html/i);
	register_exp(null,/\/forum\.php\?mod=viewthread/);
	register_exp(/index\.php\/board,/,/topic,\d+\.0\.html/);
	register_exp(/pornothon\.net\/[^\/]+\//,/\/\d+-[^-]+-[^-]+-.+\.html/);

	for(var i=0;i<filters.length;i++) {
		var f = filters[i];
		if(f && (!base.match(f.base)))
			continue;
		for(var j=0;j<links.length;j++) {
			var href = links[i].href;
			if(!href) continue;
			var r = f.test(href,base);
			if(!r) continue;
			if(typeof(r) == 'object') {
				subLinks = subLinks.concat(r);
			}
			else if(!subLinks.indexOf(r)) {
				subLinks.push(r);
			}
		}
		if(subLinks.length>0) break;
	}

	if(subLinks.length<1) {
		for(var i=0;i<f_exps.length;i++) {
			var exp=f_exps[i];
			if((!exp.loc) || base.match(exp.loc)) {
				for(var j=0;j<host_links.length;j++) {
					if(!host_links[j].href) continue;
					if(unescape(host_links[j].href).match(exp.href)) {
						subLinks.push(host_links[j]);
					}
				}
				debugPrint(base + ' =~ ' + exp.loc + ' => ' + subLinks.length + ' link[s]');
			}
			if(subLinks.length>0) break;
		}
	}
	if(subLinks.length<1) return;

	function delete_dup(arr) {
		var nArr = new Array();
		for(var i=0;i<arr.length;i++) {
			var text = arr[i].textContent;
			if(!text) continue;
			if(text.match(/^\s*[\d\.\:\/\\]*\s*$/)) continue;
			nArr.push(arr[i]);
		}
		return nArr;
	}
	subLinks = delete_dup(subLinks);

	var baseUrl;
	var linkCount=subLinks.length;
	var curSubLink;

	var sp = base.match(/^(.*)#ln_index=([0-9]+)$/);
	if(sp) { 
		baseUrl = sp[1];
		curSubLink = new Number(sp[2]-1);
	}
	else {
		sp = base.match(/^(.*)\?ln_index=([0-9]+)$/);
		if(sp) {
	//        baseUrl = base;
	//        curSubLink = new Number(sp[2]-1);
			document.location.href=sp[1] + "#ln_index=" + sp[2];
			return;
		}
		else {
			baseUrl = base;
			curSubLink = new Number(-1);
		}
	}

	var id_panel="gm_ln_panel";
	var id_view = "gm_ln_view";
	var id_table = "gm_ln_table";
	var color_prev = "green";
	var color_next = "blue";
	//var LINK_TEXT_PREV = "&lt;&lt;&lt;";
	//var LINK_TEXT_NEXT = "&gt;&gt;&gt;";
	var LINK_TEXT_PREV = "[PREV] ";
	var LINK_TEXT_NEXT = "[NEXT] ";

	/*
	var id_body = "gm_ln_body";
	var new_body = document.createElement("div");
	var c_body = new Array();
	for(var i=document.body.childNodes.length-1;i>=0;i--) {
		c_body.push(document.body.childNodes[i]);
	}
	while(c_body.length>0) {
		var cc = c_body.pop();
		new_body.appendChild(cc);
		document.body.removeChild(cc);
	}
	document.body.appendChild(new_body);
	*/

	//Span link html element template
	var elm_tpl_link = document.createElement("span");
	elm_tpl_link.style.cursor="pointer";
	elm_tpl_link.style.textDecoration="underline";
	elm_tpl_link.style.marginTop='5px';
	elm_tpl_link.style.marginBottom='5px';
	//Space html elmement template
	var elm_tpl_space = document.createElement("span");
	elm_tpl_space.innerHTML="&nbsp;";

	function showPanel(lnpanel,textUnload,textLoad) {
		var panel = document.getElementById(id_panel);
		if(!panel || panel.style.display=="none") {
			loadView();
			lnpanel.innerHTML = textLoad;
		}
		else {
			unloadView();
			lnpanel.innerHTML = textUnload;
		}
	}
	function loadView() {
		var panel = document.getElementById(id_panel);
		var lnTable = document.getElementById(id_table);
		
		if(panel) {
			panel.style.display="block";
		} 
		else {
			panel = createPanel();
			var view = createView();
			panel.appendChild(view);
			document.body.appendChild(panel);
	//        document.location.href=baseUrl + "#ln_index=" + linkCount;
			refreshTable(curSubLink);
			loadPage(curSubLink);
			//(curSubLink + 1);
		}
		document.body.style.overflow="hidden";
	}

	function unloadView() {
		var panel = document.getElementById(id_panel);
	//    var lnTable = document.getElementById(id_table);
		if(panel) {
			panel.style.display="none";
		}
	//    if(lnTable) {
	//        lnTable.style.display="none";
	//    }
		document.body.style.overflow="auto";
	}

	function htmlspace(len) {
		var elm = document.createElement("span");
		for(var i=0;i<len;i++) {
			elm.innerHTML += "&nbsp;"
		}
		return elm;
	}
	function htmlline(len) {
		var elm = document.createElement('span');
		for(var i=0;i<len;i++) {
			elm.innerHTML += "<BR />";
		}
		return elm;
	}
	function setLinkTable(lnTable) {
			while(lnTable.childNodes.length>0) 
				lnTable.removeChild(lnTable.firstChild);
			//lnTable.appendChild(document.createElement('br'));
			lnTable.appendChild(createLinkStatus());
			lnTable.appendChild(htmlspace(2));
			lnTable.appendChild(createTitle());
			lnTable.appendChild(htmlline(1));
			lnTable.appendChild(createPrevLink());
			lnTable.appendChild(htmlline(1));
			lnTable.appendChild(createNextLink());
		return lnTable;
	}

	function refreshTable(adjust) {
		curSubLink = adjust;
		var lnTable = document.getElementById(id_table);
		if(lnTable) {
			setLinkTable(lnTable);
		}
		document.location.href=baseUrl + "#ln_index=" + (curSubLink + 1);
	}

	function createLink(idx) {
		var link = elm_tpl_link.cloneNode(true);
		link.title = subLinks[idx].href;
		link.setAttribute("target",id_view);
		link.innerHTML = subLinks[idx].innerHTML;
		link.addEventListener("click",function(){
			refreshTable(idx);
			loadPage(idx);
			},false);
		return link;
	}

	function createPrevLink() {
		var prev = new Number(curSubLink-1);
		if (prev<0)
			prev = linkCount -1;
		var link = createLink(prev);
		link.innerHTML = LINK_TEXT_PREV + link.innerHTML;
		link.style.color= color_prev;
		return link;
	}
	function createNextLink() {
		var next = new Number(curSubLink+1);
		if (next > (linkCount-1) )
			next = 0;
		var link = createLink(next);;
		link.innerHTML = LINK_TEXT_NEXT +  link.innerHTML;
		link.style.color= color_next;
		return link;
	}

	function promptGoto(evt) {
		var msg = "Enter value between 1 - " + linkCount;
		var value = prompt(msg,curSubLink + 1);
		if(value >=1 && value<=linkCount) {
			evt.target.href = subLinks[value-1].href;
			evt.target.setAttribute("target",id_view);
			refreshTable(value-1);
			loadPage(value-1);
		}
		else {
			alert("Invalid value");
		}
	}

	function createTitle() {
		document.title = subLinks[curSubLink].textContent;
		var elm = document.createElement("span");
		$(elm).text(subLinks[curSubLink].textContent);
		$(elm).attr({
			title: subLinks[curSubLink].href,
			style: 'font-weight:bold;text-align:center;paddings:0px;margins:0px;'
		})
		return elm;
	}

	function createLinkStatus() {
		var status = elm_tpl_link.cloneNode(true);
		status.style.textDecoration = "none";
		//document.createElement("a");
		var curIndex = curSubLink + 1;
		status.innerHTML="<font color=red>[" +
			curIndex +
			" of " +
			linkCount + 
			"]</font>";
			//subLinks[curSubLink].innerHTML;
			//Goto...&nbsp;&nbsp;&nbsp;&nbsp;";
		status.addEventListener("click",promptGoto,false);
		return status;
	}

	function createPanel() {
		var nvPanel = document.createElement("div");
		nvPanel.id=id_panel;
		nvPanel.style.width = "100%";
		nvPanel.style.overFlow = "auto";
		nvPanel.style.padding="0px";
		nvPanel.style.margin="0px";
		nvPanel.style.border="0px solid black";
		nvPanel.style.backgroundColor="#EEEEEE";
		nvPanel.style.top="40px";
		nvPanel.style.left="0px;";
		nvPanel.style.position="absolute"; 
		nvPanel.style.zIndex="0";
		nvPanel.style.textAlign="left";
	/*
		with (nvPanel.style) {
			textAlign="center";margin="0px";padding="0px";
	 //       backgroundColor="#F9FFE5";//opacity="0.95";
			zIndex="90";border="solid #000000 1px";
			position="absolute";top="24px";left="0px";
		}
	*/
			var lnTable = document.createElement("div");
			lnTable.id=id_table;
			lnTable.style.position = 'fixed';
			lnTable.style.left = '0px';
			lnTable.style.top = '0px';
	//		lnTable.style.width = '50%';
			lnTable.style.display = 'block';
			lnTable.style.textAlign = 'left';
			lnTable.style.backgroundColor="#EEEEEE";
			lnTable.style.border="1px solid black";
			lnTable.style.padding = '5px';
			setLinkTable(lnTable);
	//
		nvPanel.appendChild(lnTable);
		return nvPanel;
	}

	function loadPage(idx) {
		var view = document.getElementById(id_view);
		if(0 && $) {
	//        $.get(subLinks[curSubLink].href,null,function (data) { $(view).html(data); },'html');
			$(view).load(subLinks[curSubLink].href);
		}
		else {
			view.setAttribute("src",subLinks[curSubLink].href);
		}
	}

	function createView() {
		var view = document.createElement("iframe");
	//    view.setAttribute("src",subLinks[linkCount-1].href);
	//    var view = document.createElement("div");
		view.style.margin="0px";
		view.style.padding="0px";
		view.setAttribute("name",id_view);
		view.setAttribute("id",id_view);
		view.setAttribute("width",document.defaultView.innerWidth);
		view.setAttribute("height",document.defaultView.innerHeight - 40);
		view.style.border="1px soild #000000";
		view.style.overflow="auto";
		return view;
	}

	var lnpanel= elm_tpl_link.cloneNode(true);
	//document.createElement("span");
	lnpanel.innerHTML= PANEL_TEXT_HIDE;
	lnpanel.addEventListener("click",function() {showPanel(lnpanel,PANEL_TEXT_HIDE,PANEL_TEXT_SHOW);},false);
	//linkbox.appendChild(sep.cloneNode(true));
	XRZPanel.addSpace();
	XRZPanel.add(lnpanel);
	//XRZPanel.addSpace();
	XRZPanel.show();

	if(curSubLink<0 || curSubLink>=linkCount ) {
		curSubLink = linkCount-1;
	}
	else {
		lnpanel.click();
	//    showPanel(lnpanel,'+Links_NAV','-Links_NAV');
	}
})($myPlace);

