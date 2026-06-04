// ==UserScript==
// @name	myplace.douyin
// @namespace	myplace
// @description		video download helper for douyin.com and kuaishou.com
// @version           1.0.3
// @original-author   爱画画的猫,潮玩天下
// @original-license  AGPL License
// @original-script   https://greasyfork.org/zh-CN/scripts/452660
// @include           https://www.douyin.com/*
// @include           https://www.kuaishou.com/*
// @connect           www.iesdouyin.com
// @grant             unsafeWindow
// @grant             GM_openInTab
// @grant             GM.openInTab
// @grant             GM_xmlhttpRequest
// @grant             GM.xmlHttpRequest
// @grant        GM_notification
// @grant        GM_setClipboard
// @license           AGPL License
// @charset		      UTF-8
// @run-at            document-idle
// ==/UserScript==


(function() {
var $myPlace = $myPlace || unsafeWindow.$myPlace || {};
unsafeWindow.$myPlace = $myPlace;
var XRZPanel = $myPlace.panel;
if(!XRZPanel.init()) return false;
    'use strict';

    // 复制页面 HTML 的核心函数
    function copyHTML(htmlContent) {
        //const htmlContent = document.documentElement.outerHTML;
        // 方法 1：使用现代的 copy() 函数（在控制台中可用，但可能受跨域限制，不一定在 GM 脚本中总是有效）
        // 但在 GreaseMonkey/Tampermonkey 中通常可以工作
        if (typeof copy === 'function') {
            try {
                copy(htmlContent);
            } catch (e) {
                fallbackCopy(htmlContent);
                return;
            }
        } else {
            // 方法 2：使用 GM_setClipboard（推荐，更可靠，需要 @grant GM_setClipboard）
            fallbackCopy(htmlContent);
            return;
        }

        // 提示用户
        showNotification('✅ 已复制到剪贴板！');
    }

    // 备用复制方法：使用 GM_setClipboard（需要脚本声明 @grant GM_setClipboard）
    function fallbackCopy(content) {
        if (typeof GM_setClipboard === 'function') {
            GM_setClipboard(content);
            showNotification('✅ 已通过 GM_setClipboard 复制！');
        } else {
            // 终极备用：尝试使用传统的 execCommand（不推荐，可能失效）
            try {
                const textarea = document.createElement('textarea');
                textarea.value = content;
                textarea.style.position = 'absolute';
                textarea.style.left = '-9999px';
                document.body.appendChild(textarea);
                textarea.select();
                const successful = document.execCommand('copy');
                document.body.removeChild(textarea);
                if (successful) {
                    showNotification('✅ 已复制（通过 execCommand）');
                } else {
                    showNotification('❌ 复制失败，请手动复制');
                }
            } catch (e) {
                showNotification('❌ 复制失败：' + e.message);
            }
        }
    }

    // 显示通知（使用 GM_notification 或 alert）
    function showNotification(message) {
        if (typeof GM_notification === 'function') {
            GM_notification({
                text: message,
                title: 'Copy Page HTML',
                timeout: 3000
            });
        } else {
            // 如果没有 GM_notification，使用简单的 alert（不太优雅，但能用）
            alert(message);
        }
    }



	/**
	 * 此工具方法来自画画的猫
	 * 脚本地址:https://greasyfork.org/zh-CN/scripts/418804
	 */
	//共有方法，全局共享
	function commonFunction(){
		this.GMgetValue = function (name, value=null) {
			let storageValue = value;
			if (typeof GM_getValue === "function") {
				storageValue = GM_getValue(name, value);
			} else if(typeof GM.setValue === "function"){
				storageValue = GM.getValue(name, value);
			}else{
				var arr = window.localStorage.getItem(name);
				if(arr != null){
					storageValue = arr
				}
			}
			return storageValue;
		};
		this.GMsetValue = function(name, value){
			if (typeof GM_setValue === "function") {
				GM_setValue(name, value);
			} else if(typeof GM.setValue === "function"){
				GM.setValue(name, value);
			}else{
				window.localStorage.setItem(name, value)
			}
		};
		this.GMaddStyle = function(css){
			var myStyle = document.createElement('style');
			myStyle.textContent = css;
			var doc = document.head || document.documentElement;
			doc.appendChild(myStyle);
		};
		this.GMopenInTab = function(url, options={"active":true, "insert":true, "setParent":true}){
      var title = options.title;
      if(!title) {
        var metas = document.getElementsByTagName('meta');
        for(var i=0;i<metas.length;i++) {
          var meta = metas[i];
          if(meta.name == "description") {
            title = meta.content;
            title = title.replace(/^(.*)\s+-\s+(.+?)于(.+?)发布在抖音.*/,'$2_$3_$1');
            break;
          }
        }
      }
      if(!title) {
        title = document.title;
      }
      return this.webToast({
        message:'<div><p>下载链接:</br></p><p><a style="text-decoration:underline;color:blue" href="' + url + '">' + title + '</a></p></div>',
        time:5000,
        html:1,
        position:'center-top',
      });
			if (typeof GM_openInTab === "function") {
				GM_openInTab(url, options);
			} else {
				GM.openInTab(url, options);
			}
		};
		this.addScript = function(url){
			var s = document.createElement('script');
			s.setAttribute('src',url);
			document.body.appendChild(s);
		};
		this.randomNumber = function(){
			return Math.ceil(Math.random()*100000000);
		};
		this.request = function(mothed, url, param){   //网络请求
			return new Promise(function(resolve, reject){
				GM_xmlhttpRequest({
					url: url,
					method: mothed,
					data:param,
					onload: function(response) {
						var status = response.status;
						var playurl = "";
						if(status==200||status=='200'){
							var responseText = response.responseText;
							resolve({"result":"success", "data":responseText});
						}else{
							reject({"result":"error", "data":null});
						}
					}
				});
			})
		};
		this.addCommonHtmlCss = function(){
			var cssText =
				`
				@keyframes fadeIn {
				    0%    {opacity: 0}
				    100%  {opacity: 1}
				}
				@-webkit-keyframes fadeIn {
				    0%    {opacity: 0}
				    100%  {opacity: 1}
				}
				@-moz-keyframes fadeIn {
				    0%    {opacity: 0}
				    100%  {opacity: 1}
				}
				@-o-keyframes fadeIn {
				    0%    {opacity: 0}
				    100%  {opacity: 1}
				}
				@-ms-keyframes fadeIn {
				    0%    {opacity: 0}
				    100%  {opacity: 1}
				}
				@keyframes fadeOut {
				    0%    {opacity: 1}
				    100%  {opacity: 0}
				}
				@-webkit-keyframes fadeOut {
				    0%    {opacity: 1}
				    100%  {opacity: 0}
				}
				@-moz-keyframes fadeOut {
				    0%    {opacity: 1}
				    100%  {opacity: 0}
				}
				@-o-keyframes fadeOut {
				    0%    {opacity: 1}
				    100%  {opacity: 0}
				}
				@-ms-keyframes fadeOut {
				    0%    {opacity: 1}
				    100%  {opacity: 0}
				}
				.web-toast-kkli9{
				    position: fixed;
				    background: rgba(0, 0, 0, 0.7);
				    color: #fff;
				    font-size: 14px;
				    line-height: 1;
				    padding:10px;
				    border-radius: 3px;
				    left: 50%;
				    transform: translateX(-50%);
				    -webkit-transform: translateX(-50%);
				    -moz-transform: translateX(-50%);
				    -o-transform: translateX(-50%);
				    -ms-transform: translateX(-50%);
				    z-index: 999999999999999999999999999;
				    white-space: nowrap;
				}
				.fadeOut{
				    animation: fadeOut .5s;
				}
				.fadeIn{
				    animation:fadeIn .5s;
				}
				`;
			this.GMaddStyle(cssText);
		};
		this.webToast = function(params) {	//小提示框
		    var time = params.time;
		    var background = params.background;
		    var color = params.color;
		    var position = params.position;  //center-top, center-bottom
		    var defaultMarginValue = 50;

		    if(time == undefined || time == ''){
		        time = 1500;
		    }

		    var el = document.createElement("div");
		    el.setAttribute("class", "web-toast-kkli9");
		    el.innerHTML = params.message;
		    //背景颜色
		    if(background!=undefined && background!=''){
		    	el.style.backgroundColor=background;
		    }
		    //字体颜色
		    if(color!=undefined && color!=''){
		    	el.style.color=color;
		    }

		    //显示位置
		    if(position==undefined || position==''){
		    	position = "center-bottom";
		    }

		    //设置显示位置，当前有种两种形式
		    if(position==="center-bottom"){
		    	el.style.bottom = defaultMarginValue+"px";
		    }else{
		    	el.style.top = defaultMarginValue+"px";
		    }
			el.style.zIndex=999999;

		    document.body.appendChild(el);
		    el.classList.add("fadeIn");
		    setTimeout(function () {
		        el.classList.remove("fadeIn");
		        el.classList.add("fadeOut");
		        /*监听动画结束，移除提示信息元素*/
		        el.addEventListener("animationend", function () {
		            document.body.removeChild(el);
		        });
		        el.addEventListener("webkitAnimationEnd", function () {
		            document.body.removeChild(el);
		        });
		    }, time);
		};
		this.queryUrlParamter = function(text, tag) { //查询GET请求url中的参数
			if(text.indexOf("?")!=-1){ //选取?后面的字符串,兼容window.location.search，前面的?不能去掉
				var textArray = text.split("?");
				text = "?"+textArray[textArray.length-1];
			}
			var t = new RegExp("(^|&)" + tag + "=([^&]*)(&|$)");
			var a = text.substr(1).match(t);
			if (a != null){
				return a[2];
			}
			return "";
		};
		this.isPC = function(){
			var userAgentInfo = navigator.userAgent;
			var Agents = ["Android", "iPhone","SymbianOS", "Windows Phone", "iPad", "iPod"];
			var flag = true;
			for (var v = 0; v < Agents.length; v++) {
				if (userAgentInfo.indexOf(Agents[v]) > 0) {
					flag = false;
					break;
				}
			}
			return flag;
		};
		this.getBilibiliBV=function(){
			var pathname = window.location.pathname;
			var bv = pathname.replace("/video/","").replace("/","");
			return bv;
		};
		this.getSystemOS=function(){
			var u = navigator.userAgent;
			if (!!u.match(/compatible/i) || u.match(/Windows/i)) {
			    return 'windows';
			} else if (!!u.match(/Macintosh/i) || u.match(/MacIntel/i)) {
			    return 'macOS';
			} else if (!!u.match(/iphone/i) || u.match(/Ipad/i)) {
			    return 'ios';
			} else if (!!u.match(/android/i)) {
			    return 'android';
			} else {
			    return 'other';
			}
		};
		this.RPCDownloadFile = function(fileName, url, savePath="D:/", RPCURL="ws://localhost:16800/jsonrpc", RPCToken="") {
			const self = this;
			if(!savePath){
				savePath = "D:/";
			}
			if(!RPCURL){
				RPCURL = "ws://localhost:16800/jsonrpc";
			}
			let options = { //下载配置文件
				"dir":savePath,
				"max-connection-per-server": "16",
				"header":["User-Agent:"+navigator.userAgent+"", "Cookie:"+document.cookie+"", "Referer:"+window.location.href+""]
			}
			if(!!fileName) {
				options.out = fileName;
			}
			let jsonRPC = {
				"jsonrpc": "2.0",
				"id": "huahuacat",
				"method": "aria2.addUri",
				"params": [[url], options],
			}
			if (!!RPCToken) {
				jsonRPC.params.unshift("token:" + RPCToken); // 必须要加在第一个
			}
			return new Promise(function(resolve, reject) {
				var webSocket = new WebSocket(RPCURL);
				webSocket.onerror = function(event) {
					console.log("webSocket.onerror", event);
					reject("Aria2连接错误，请打开Aria2和检查RPC设置！");
				}
				webSocket.onopen = function(){
					webSocket.send(JSON.stringify(jsonRPC));
				}
				webSocket.onmessage = function(event){
					let result = JSON.parse(event.data);
					switch (result.method) {
						case "aria2.onDownloadStart":
							resolve("Aria2 开始下载【"+fileName+"】");
							webSocket.close();
							break;
						case "aria2.onDownloadComplete":
							break;
						default:
							break;
					}
				}
			});
		};
		this.getElementObject = function(selector, delay=200){
			return new Promise((resolve,reject) =>{
				let totalDelay = 0;
				let elementInterval = setInterval(()=>{
					if(totalDelay >= 2500){
						reject(false);
						clearInterval(elementInterval);
					}
					let element = document.querySelector(selector);
					if(element){
						resolve(element);
						clearInterval(elementInterval);
					}else{
						totalDelay += delay;
					}
				}, delay);
			});
		};
	}

	//统一工具
	const commonFunctionObject = new commonFunction();
	commonFunctionObject.addCommonHtmlCss();	//统一html、css元素添加

	/**
	 * 短视频去水印下载，与爱画画的猫共同开发维护
	 * https://greasyfork.org/zh-CN/scripts/418804
	 */
	function shortVideoDownloader(){
		this.douyinVideoDownloader = function(){
			if(window.location.host !== "www.douyin.com"){
				return;
			}
			window.addEventListener('load',function(a,b,c,copyFlag){
				//这是搜索界面
				if(window.location.href.match(/https:\/\/www\.douyin\.com\/search\/.*?/)){
					function downloader(){
						const videoContainers = document.querySelectorAll(".player-info");
						videoContainers.forEach((element)=>{
							if(element.getAttribute("dealwith")){
								return;
							}
							let bottomMenu = element.querySelector('xg-right-grid');
							if(!bottomMenu){
								return;
							}
							let playbackSetting = bottomMenu.querySelector('.xgplayer-playback-setting');
							if(!playbackSetting){
								return;
							}
							let download = playbackSetting.cloneNode(true); // 拷贝一个节点
							let downloadText = download.querySelector('div:first-child');
							let video = element.querySelector("video");
							downloadText.innerText='下载';
							downloadText.style = 'font-size:13px';
							playbackSetting.after(download);
							element.setAttribute("dealwith","true");
							download.addEventListener("click",(e)=>{
								let playerUrl = video.children[0].src;
								commonFunctionObject.GMopenInTab(playerUrl);
							});
						});
					}
					downloader();
					setInterval(function(){
						downloader();
					},500);
				}else{
					async function downloader(a,b,c,flagCopy){
						try{
							//延迟加载等到是否完成
							let videoContainer = await commonFunctionObject.getElementObject(".xgplayer-controls");
							if(!videoContainer){
								return false;
							}
							let bottomMenus = document.querySelectorAll('.xg-right-grid');
							let bottomMenuLength = bottomMenus.length;
							let bottomMenu = bottomMenus.length>1 ? bottomMenus[bottomMenuLength - 2] : bottomMenus[bottomMenuLength - 1];
							let douyinVideoDownloaderDom = document.querySelector('#douyin-video-downloder');
							if(douyinVideoDownloaderDom){
								douyinVideoDownloaderDom.parentNode.parentNode.removeChild(douyinVideoDownloaderDom.parentNode);
							}

							// 拷贝一个节点
							let playbackSetting = bottomMenu.querySelector('.xgplayer-playback-setting');
							if(!playbackSetting){
								return false;
							}
							let download = playbackSetting.cloneNode(true);
							let downloadText = download.querySelector('div:first-child');
							downloadText.innerText='下载';
							downloadText.style = 'font-size:14px';
							downloadText.setAttribute('id','douyin-video-downloder');

							let autoplaySetting = document.querySelector('.xgplayer-autoplay-setting');
							if(!autoplaySetting){
								return false;
							}
							autoplaySetting.after(download);
              let playing = document.querySelector('.xgplayer-playing');
              let video = playing.querySelector('video');
              let videoTitle;
              let name = playing.querySelector('.account-name');
              if(name) {
                name = name.textContent;
                name = name.substr(1);
                videoTitle = name;
              }
              let title = playing.querySelector('.time');
              if(title) {
				title = title.textContent;
                title = title.replace(/^[^\d]+/,"");
                title = title.replace(/\s+$/,"");
                if(title.length>0) {
                  videoTitle = videoTitle ? videoTitle + "_" + title : title;
                }
              }
              title = playing.querySelector('.title');
              if(title) {
				title = title.textContent;
                title = title.replace(/^展开/,"");
                if(title.length>0) {
                    videoTitle = videoTitle ? videoTitle + "_" + title : title;
                }
              }

              let id = playing.querySelector('.xgplayer-detail-entry a.content-wrapper');
              if(id) {
                id = id.href;
                id = id.match(/\/video\/(\d+)/);
                if(id) {
                   id = id[1];
                   videoTitle = videoTitle ? videoTitle + "_" + id : id;
                }
              }
              if(!videoTitle) {
                var metas = document.getElementsByTagName('meta');
                for(var i=0;i<metas.length;i++) {
                  var meta = metas[i];
                  if(meta.name == "description") {
                    videoTitle = meta.content;
                    videoTitle = videoTitle.replace(/^(.*)\s+-\s+(.+?)于(.+?)发布在抖音.*/,'$2_$3_$1');
                    break;
                  }
                }
              }
              if(!videoTitle) {
                videoTitle = document.title;
              }
              if(flagCopy) {
                copyHTML(video.children[0].src + "    " + videoTitle)
              }
							document.querySelector("#douyin-video-downloder").addEventListener("click", (e)=>{
								let playerUrl = video.children[0].src;
								commonFunctionObject.GMopenInTab(playerUrl,{'title':videoTitle});
							});
						}catch(e){console.log(e)}
					}
					//监听鼠标
					window.addEventListener("wheel",downloader);
					window.addEventListener('keydown',function(e){
						if(e.code == 'ArrowDown' || e.code == 'ArrowUp'){
							downloader();
						}
					});
					//视频改变后触发
					async function domNodeInserted(){
						let findVideoInterval = setInterval(function(){
							let videoElement = document.querySelector("video");
							if(videoElement){
								videoElement.addEventListener('DOMNodeInserted',(e) => {
									downloader();
								});
								clearInterval(findVideoInterval);
							}
						}, 200);
					}
          XRZPanel.addAction('Copy Video Source',function(a,b,c){downloader(a,b,c,true)})
					domNodeInserted();
					downloader();
					window.addEventListener("click",downloader);

				}

			});

		};
		this.kuaishouVideoDownloader = function(){
			if(window.location.host !== "www.kuaishou.com"){
				return;
			}
			window.addEventListener('load',function(){
				async function downloader(){
					let kuaishouVideoDownloder = document.querySelector("#kuaishou-video-downloder");
					if(!kuaishouVideoDownloder){
						let downloadDIV = document.createElement("div");
						downloadDIV.style = "cursor:pointer;width:50px;height:40px;line-height:40px;text-align:center;background-color:#FFF;color:#000;position:fixed;top:200px;left:0px;z-index:999;";
						downloadDIV.innerText = "下载";
						downloadDIV.setAttribute('id','kuaishou-video-downloder');
						document.body.appendChild(downloadDIV);

						downloadDIV.addEventListener("click", function(e){
							let videoDom = document.querySelector('.player-video');
							if(!videoDom){
								console.log('没有找到DOM');
								return;
							}
							let videoSrc = videoDom.getAttribute('src');
							if(videoSrc.match(/^blob/)){
								console.log('blob视频无法下载');
								return;
							}
							commonFunctionObject.GMopenInTab(videoSrc);
						});
					}
				}
				document.querySelectorAll(".switch-item").forEach(function(value){
					value.addEventListener("click", function(){
						downloader();
					});
				})
				downloader();
				setInterval(function(){
					let kuaishouVideoDownloder = document.querySelector("#kuaishou-video-downloder");
					if(kuaishouVideoDownloder){
						if(window.location.href.match(/https:\/\/www\.kuaishou\.com\/short-video\/.*?/)){
							kuaishouVideoDownloder.style.display = "block";
						}else{
							kuaishouVideoDownloder.style.display = "none";
						}
					}
				}, 800);
			});
		};
		this.start = function(){
			this.douyinVideoDownloader();
			this.kuaishouVideoDownloader();

		};
	};
	(new shortVideoDownloader()).start();
})();
