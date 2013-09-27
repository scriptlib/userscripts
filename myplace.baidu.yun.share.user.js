// ==UserScript==
// @name        myplace.baidu.yun.share
// @namespace   eotect@myplace
// @description 百度云网盘分享转存
// @include     http://yun.baidu.com/share/*
// @include     http://pan.baidu.com/share/*
// @version     1.003
// @grant none
// Change Log
//	2013-09-27
//		Hide docwrapper when dialog is open
// ==/UserScript==

if(!unsafeWindow) {
	unsafeWindow = window;
}
var $myPlace = $myPlace || unsafeWindow.$myPlace || {};
unsafeWindow.$myPlace = $myPlace;
var $ = unsafeWindow.$ || $myPlace.jQuery;
$myPlace.baidu = $myPlace.baidu || {};
$myPlace.baidu.yun = $myPlace.baidu.yun || {};

(function(yun){
	var disk = unsafeWindow.disk;
	var FileUtils = unsafeWindow.FileUtils;
	var Page = unsafeWindow.Page;
	var RestApi = disk.api.RestAPI;
	var Messager = new yun.Messager('li');
	function message(text,mode) {
		return Messager.say(text,mode);
	}
	var _L = yun._L;
	yun.LinkSaver = {

		doTransferFiles: function (D, A, E, C, _) {
			var self = yun.LinkSaver;
            var B = {
                path: D,
                filelist: $.stringify(A)
            };
			message(_L("Posting") +' '+ RestApi.TRANSFER,1);
            $.post(RestApi.TRANSFER  + "&from=" + encodeURIComponent(E) + "&shareid=" + C, B, function (B) {
                var A = null;
                try {
                    A = $.parseJSON(B);
                } catch (C) {
                    A = null;
                }
                if (typeof _ == "function") {
                    _(A);
                }
            });
        },
		parseDirPath: function (_) {
            return _.substring(_.indexOf(":/") + 1);
        },
		saveFile : function(t) {
			return yun.LinkSaver.doTransferFiles(t.path,t.filelist,t.uk,t.shareid,function(res){
				//message("RESULT: " + res);
			});
		},
		saveFiles : function(path,f) {
			var tasks = [];
			//f = f || FileUtils.SHARE_DATAS.currentChacheData;
			if((!f) || f.length < 1) {
				message(_L('No tasks.'),2);
				return;
			}
			for(var i=0;i<f.length;i++) {
				var fl = [];
	
				for(var j=0;j<f[i].filelist.length;j++) {
					//fl.push(decodeURIComponent(f[i].filelist[j].path));
					fl.push(f[i].filelist[j].path);
				}
				tasks.push({
					path: path,
					filelist:fl,
					uk:f[i].uk,
					shareid:f[i].shareid,
					filename:f[i].title,
				});
			}
			yun.Utils.doTasks(this.saveFile,tasks,0,3000,function(task,idx,tasks){
				if(task) {
					message("[" + (idx+1) + "/" + tasks.length + "] " + _L('Saving') + ' ' + task.filename + ' ...',1);
				}
				else {
					message(idx + _L("tasks done."),0);
				}
			});
		},
		getList: function (what,callback) {
			var data;
			if(FileUtils.viewShareData) {
				var f = $.parseJSON(FileUtils.viewShareData);
				data = [{
					shareid:	FileUtils.share_id,
					uk:			FileUtils.sysUK,
					filelist:	[{path:f.path}],
					server_filename	:	f.server_filename,
					fs_id	:	f.fs_id,
					title:		f.server_filename,
				}]
			}
			// else if(document.location.href.match(/baidu\.com\/share\/link\?.*shareid=\d+/)){
				// var l = document.location.href;
				// var t = l.match(/shareid=(\d+)/);
				// var f = {};
				// if(t) f.shareid=t[1];
				// t = l.match(/uk=(\d+)/);
				// if(t) f.uk=t[1];
				// t = l.match(/fid=(\d+)/);
				// if(t) f.filelist=[t[1]];
				// data = [f];
			// }
			else if(what && what == "all") {
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
					message(_L("Request share list") + " [" + page + '/' + pages + ']'+ _L("Page"),1);
					//if((start+limit)>=count) {
						yun.GetShareList(start,limit,function(data){
							//alert(data.records.length);
							for(var i=0;i<data.records.length;i++) {
								for(var j=0;j<data.records[i].filelist.length;j++) {
									data.records[i].filelist[j].path = decodeURIComponent(data.records[i].filelist[j].path);
								}								
								lists.push(data.records[i]);
							}
							if(start+limit>=count) {
								yun.Cache.AllFileList = lists;
								callback(lists);
							}
							else {
								getPage(page+1);
							}
							return lists;
						});
					//}
					/*
					else {
						yun.GetShareList(start,limit,function(data,start,limit){
							alert(data.records.length);
							for(var i=0;i<data.records.length;i++) {
								lists.push(data.records[i]);
							}
							//lists.push(data);
							getPage(page+1);
						});
					}
					*/					
				}
				return getPage(1);
			}
			else {
				if(FileUtils.SHARE_DATAS) {
					data = FileUtils.SHARE_DATAS.currentChacheData;
				}
				else {
					var _ = FileUtils._mInfiniteGridView || FileUtils._mInfiniteListView;
					if(_) {
						data =  _.getCheckedItems();
						if(data.length<1) {
							data = _._mElementsData;
						}
					}
					if(data.length<1) {
						message("Error, or sharing list is empty.",2);
						return;
					}
					else {
						var cdata = [];
						for(var i=0;i<data.length;i++) {
							cdata.push( {
								shareid:	FileUtils.share_id,
								uk:			FileUtils.sysUK,
								filelist:	[data[i]],
								title:		data[i].server_filename,
							})
						}
						data = cdata;
					}
				}
			}
			for(var i=0;i<data.length;i++) {
				if(data[i].filelist) {
					for(var j=0;j<data[i].filelist.length;j++) {
						data[i].filelist[j].path = decodeURIComponent(data[i].filelist[j].path);
					}
				}
				else {
					data[i].filelist = [{path:data[i].path}];
				}
				if(!data[i].title) {
					data[i].title = data[i].server_filename;
				}
			}
			yun.Cache.PageFileList = data;
			if(callback) {
				return callback(data);
			}
			return data;
		},
	};
	$(document).ready(function(){
		var pos = $('#barCmdViewList')[0];
		if(pos) {
			pos = pos.parentNode;
		}
		else {
			pos = $('.entity-icon')[0] || $('#shareqr')[0];
		}
		if((!pos) && $('#share_nofound_des').length) {
			var h = document.location.href;
			var m = h.match(/\/share\/link\?.*uk=\d+/);
			if(m) {
				var t = h.replace(/\/share\/link\?/,'/share/home?');
				$('<div align="center"><a href="' + t + '">User Home</a></br></div>').insertBefore($('#share_nofound_des'));
			}
			return;
		}
		function btn(text,tag) {
			var ht = '<button style="display:block;height:29px;margin-right:5px" ' +
				'title="' + text + '" href="javascript:;" class="two-pix-btn">' + 
				text + 	'</button>';
			if(tag) {
				ht = '<' + tag + '>' + ht + '</' + tag + '>';
			}
			return $(ht);
		}
		function _buttonClick(what) {
			var idPath = "LinkSaverPath";
			var idExp = "LinkSaverExp";
			var default_path = yun.Config.read(idPath) || '/testing';
			var default_exp = yun.Config.read(idExp) || '.*';
			if(!self.SaveDialog) {
				self.SaveDialog = new yun.SaveDialog(default_path,default_exp);
			}
            var docwraper=$('#docWraper');
            docwraper.length && docwraper.hide();
			self.SaveDialog.setVisible(true);
            self.SaveDialog.OnCancel = function() {
                docwraper.length && docwraper.show();
            }
			self.SaveDialog.OnConsent = function(source,target) {
                docwraper.length && docwraper.show();
				yun.Config.write(idPath,target);
				yun.Config.write(idExp,source);
				self.getList(what,function(all) {
					var albumCount = 0;
					var files = [];
					if(!source) {
						files = all;
					}
					else {
						var r = new RegExp(source);
						for(var i=0;i<all.length;i++) {
							if(all[i].feed_type == 'album') {
								albumCount++;
								continue;
							}
							var s = "" + (i+1) + "#" + all[i].title;							
							if(r.test(s)) {
								files.push(all[i]);
							}
						}
					}
					if(albumCount>0) {
						message(_L("Ignore $1 albums",albumCount) + ", " + _L("Get $1 tasks",files.length) + '.',2);
					}
					else {
						message(_L("Get $1 tasks",files.length) + '.',2);
					}
					if(files.length > 0) {
						self.saveFiles(target,files);
					}
					return 1;
				});
			};
		}
		var self = yun.LinkSaver;
		
		if (FileUtils.viewShareData) {			
			var saveBtn0 = btn(_L('Save file'));
			saveBtn0.click(function() {return _buttonClick("file")});
			saveBtn0.insertBefore(pos);	
			Messager.insertAfter(saveBtn0);
		}
		else {
			var saveBtn1 = btn(_L('Save current page'),'li');		
			saveBtn1.click(function() {return _buttonClick("page")});
			saveBtn1.insertBefore(pos);	
						
			var saveBtn2 = btn(_L('Save all page'),'li');		
			saveBtn2.click(function() {return _buttonClick("all")});	
			saveBtn2.insertBefore(saveBtn1);	
			//var txtBox = $('<li><input id="select_path" style="display:block;height:29px;margin-right:5px"  value="' +default_path+'" type="text" name="Path"></li>');
			//txtBox.insertBefore(saveBtn2);
			Messager.insertBefore(saveBtn2);
			if(document.location.href.match(/\/share\/link/)) {
				saveBtn2.hide();
			}
		}
	});
	unsafeWindow.myDisk = disk;
})($myPlace.baidu.yun);



