// ==UserScript==
// @name        myplace.baidu.yun.share.home
// @namespace   eotect@myplace
// @description myplace.baidu.yun.share.home
// @include     http://yun.baidu.com/share/home?*
// @include     http://pan.baidu.com/share/home?*
// @version     0.2
// @grant none
// Change Log
//	2013-09-27
//		Hide docwrapper when dialog is open
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
	var yun = $myPlace.baidu.yun;
	var FileUtils = unsafeWindow.FileUtils;
	var _L = yun.share._L;
	var message = yun.share.message;
	yun.share.home = {
		getFiles : function(what,callback){
			if(what && what == "all") {
				if(yun.Cache.AllFileList) {
					callback(yun.Cache.AllFileList);
					return yun.Cache.AllFileList;
				}
				var count = FileUtils.SHARE_DATAS.loadedAllCount;
				var limit = FileUtils.SHARE_DATAS.pageSize
				var pages = Math.floor(count/limit);
				if(limit*pages<=count) pages++;
				var lists = [];
				function getPage(page) {
					var start=(page-1)*limit;
					if(start+limit>count) {
						limit = count - start;
					}
					message('[' + page + '/' + pages + '] ' + _L("Request share list") + _L("Page") + page + ' ...',1);
						yun.GetShareList(start,limit,function(data){
							for(var i=0;i<data.records.length;i++) {
								if(data.records[i].filelist) {
									for(var j=0;j<data.records[i].filelist.length;j++) {
										data.records[i].filelist[j].path = decodeURIComponent(data.records[i].filelist[j].path);
									}								
								}
								lists.push(data.records[i]);
							}
							if(start+limit>=count) {
								yun.Cache.AllFileList = lists;
								if(typeof callback == 'function') {
									callback(lists);
								}
							}
							else {
								getPage(page+1);
							}
							return lists;
						});			
				}
				return getPage(1);
			}
			else {
				data = FileUtils.SHARE_DATAS.currentChacheData;	
				for(var i=0;i<data.length;i++) {
					for(var j=0;j<data[i].filelist.length;j++) {
							data[i].filelist[j].path = decodeURIComponent(data[i].filelist[j].path);
					}
				}
			}
			if(typeof callback == 'function') {
				callback(data);
			}
			return data;
		},
	};
	$(document).ready(function(){
		var pos = $('#barCmdViewList')[0];
		if(pos) {
			pos = $(pos.parentNode);
			var btn1 = $('<li><button style="display:inline;height:29px;margin-right:5px" ' +
				'title="' + _L('Save all page') + '" href="javascript:;" class="two-pix-btn">' + 
				_L('Save all page') + 	'</button></li>');
			btn1.click(function(){
				yun.share.save(yun.share.home,'all');
			});	
			btn1.insertBefore(pos);
			pos = btn1;
			var btn2 = $('<li><button style="display:inline;height:29px;margin-right:5px" ' +
				'title="' + _L('Save current page') + '" href="javascript:;" class="two-pix-btn">' + 
				_L('Save current page') + 	'</button></li>');
			btn2.click(function(){
				yun.share.save(yun.share.home,'current');
			});	
			btn2.insertBefore(pos);		
		}
		else {
			alert("Error bad script, myplace.baidu.yun.share.home");
			return;
		}
	});
})();