// ==UserScript==
// @name        myplace.baidu.yun.share.home
// @namespace   eotect@myplace
// @description myplace.baidu.yun.share.home
// @include     http://yun.baidu.com/share/home?*
// @include     http://pan.baidu.com/share/home?*
// @version     1.02
// @grant none
// Change Log
//	2014-05-04
//		[功能:保存全部]增加重复项目的检测和删除.
//	2013-09-27
//		[界面]打开保存界面的时候，隐藏docwrapper.
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
	function DeleteDuplicated(lists) {
		var newlist = [];
		var records = {};
		var ignored = 0;
		for(var i=0;i<lists.length;i++) {
			if(!lists[i].title) {
				newlist.push(lists[i]);
			}
			else if(!lists[i].filelist) {
				newlist.push(lists[i]);
			}
			else if(!lists[i].filelist.length) {
				newlist.push(lists[i]);
			}
			else {
				var KEY = lists[i].filelist[0].path + lists[i].filelist.length;
				if(records[lists[i].title] && records[lists[i].title] == KEY ) {
					ignored++;
					//console.log('[' + ignored + ']Duplicated item ignored: "' + lists[i].title + '".');
					continue;
				}
				else {
					records[lists[i].title] = KEY;
					newlist.push(lists[i]);
				}
			}
		}
		if(lists.length > newlist.length) {
			console.log('Original list contains ' + lists.length + ' items, ' + ignored + ' items duplicated, list reduced to ' + newlist.length + ' items.');
		}
		return newlist;
	}
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
				var page_start = 1;
				var page_end = pages;
				var page_exp = prompt(_L("Select pages range...") + '(1 - ' + pages + ')',"1 - " + pages); 
				if(page_exp) {
					var m = page_exp.match(/^\s*(\d+)\s*-\s*(\d+)$/);
					if(m) {
						if((+m[1]) > (+m[2])) {
							page_start = +m[2];
							page_end = +m[1];
						}
						else {
							page_start = +m[1];
							page_end = +m[2];
						}
					}
					else if(m = page_exp.match(/^\s*(\d+)\s*$/)) {
						page_start = +m[1];
						page_end = +m[1];
					}
				}
				if(page_start < 1) {
					page_start = 1;
				}
				if(page_end < 1) {
					page_end = 1;
				}
				console.log('Page:' + page_start + ', ' + page_end);
				function getPages(currentPage,pageTo,cb) {
					if(!currentPage) {
						currentPage = 1;
					}
					if(currentPage < 1) {
						currentPage = 1;
					}
					if(currentPage > pageTo) {
						lists = DeleteDuplicated(lists);
						yun.Cache.AllFileList = lists;
						if(cb && typeof(cb) == 'function') {
							cb(lists);
						}
					}
					else {
						message('[' + currentPage + '/' + page_end + '] ' + _L("Request share list") + _L("Page") + currentPage + ' ...',1);
						getPage(currentPage,function(nextPage){
							if(nextPage) {
								getPages(+1+currentPage,pageTo,cb);
							}
						});
					}
					return lists;
				}
				function getPage(page,cb) {
					var start=(page-1)*limit;
					if(start+limit>count) {
						limit = count - start;
					}
					yun.GetShareList(start,limit,function(data){
							if(!(data && data.records)) {
								message(_L("Request share list") + _L("Page") + page + ' , ' + _L('Error') + ' ' + 'return nothing',1);
							}
							else {
								for(var i=0;i<data.records.length;i++) {
									if(data.records[i].filelist) {
										for(var j=0;j<data.records[i].filelist.length;j++) {
											data.records[i].filelist[j].path = decodeURIComponent(data.records[i].filelist[j].path);
										}								
									}
									lists.push(data.records[i]);
								}
							}
							//if(start+limit>=count) {
								//DeleteDuplicated(lists);
								//yun.Cache.AllFileList = lists;
								if(cb && typeof(cb) == 'function') {
									cb(1+page);
								}
							//}
							return lists;
					});	
					return lists;
				}
				//return getPages(35,39,callback); //DEBUG TESTING
				getPages(+page_start,+page_end,callback);
				return lists;
			}
			else {
				data = FileUtils.SHARE_DATAS.currentChacheData;	
				for(var i=0;i<data.length;i++) {
					if((!data[i].filelist) && data[i].operation.filelist) {
						data[i].filelist = data[i].operation.filelist;
					}
					if(!data[i].filelist) {
						continue;
					}
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
        //var elements = $('inline-file-col');
        //for(var i=0;i<elements.length;i++) {
        	//$('<span>' + (i+1) + '</span>').insertBefore(elements[i]);
        //}
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
			//alert("Error bad script, myplace.baidu.yun.share.home");
			return;
		}
	});
})();
