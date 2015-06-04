// ==UserScript==
// @name        myplace.baidu.yun.fileman
// @namespace   eotect@myplace
// @description 百度网盘文件管理
// @include     http://pan.baidu.com/disk/home*
// @include     http://yun.baidu.com/disk/home*
// @version     2.03
// @grant 		none
// Changelog
// 2014-10-17
//		Baidu API Changed, This Changed
//	2013-09-28
//		Add support for magnet links
// ==/UserScript==
if(!unsafeWindow) {
	unsafeWindow = window;
}
var $myPlace = $myPlace || unsafeWindow.$myPlace || {};
unsafeWindow.$myPlace = $myPlace;


(function(yun){

	var _L = yun._L;
	
	
	yun.API.diskHome = unsafeWindow.require("clouddisk-ui:widget/list-view/disk-home.js");
	

	
	var DC = yun.API.dataCenter;
	var DH = yun.API.diskHome;
	var TST = yun.API.toast;
	
	
	
	yun.fileman = {
		get_item_selected : function() {
			return DC.get('selectedList');
		},
		get_file_selected: function() {
			return DC.get('tmpl-selected-list')();
		},
		move: function(list,dest,callback) {
			yun.API.commonService.getWidgets("common:widget/fileMoveCopyManager/fileMoveCopyManager.js", function(e) {
				yun.fileMoveCopyManager = yun.fileMoveCopyManager || new e;			
					yun.fileMoveCopyManager.moveTo({
						list: list,
						filemanager: "move",
						succCallback: function(e, t) {
							if(callback) {
								callback(e, t) ;
							}	
						},
						destPath: dest
					});
				
			});
		},
		rename:	function(list,pos,end,exp,rpl,func) {
			var progress = '[' + pos + '/' + end + ']';
			if(pos>=end) {
				console.log(progress + " 重命名任务完成");
				yun.message(_L('Finished renaming $1 files',end),yun.MessageMode.MODE_SUCCESS);
				return func(end);
			}
			var file = list[pos];
			var oldname = file.server_filename;
			var newname = oldname.replace(exp,rpl);
			if(newname != oldname) {
				console.log(progress + " Rename " + oldname + " => " + newname);
			}
			else {
				console.log(progress + ' Rename ' + oldname + ' [Nothing to do]'); 
				setTimeout(function(){
					yun.fileman.rename(list,pos+1,end,exp,rpl,func)
				},2000);
				return 1;
			}
			return DH.rename(file.fs_id,newname,function() {
				setTimeout(function(){
					yun.fileman.rename(list,pos+1,end,exp,rpl,func)
				},2000);
				return 1;
			});
		},
	};
	yun.actions = {
		rename : function(exp,rpl) {
			var list = yun.fileman.get_file_selected();
			/*
			for(var i=0;i<list.length-1;i++) {
				yun.fileman.rename(list[i],exp,rpl,function(){});
			}
			*/
			if(list.length) {
				return yun.fileman.rename(list,0,list.length,exp,rpl,function(){DH.render();return 1;});
			}
			else {
				yun.message(_L('Error: No file selected'),yun.MessageMode.MODE_CAUTION);
			}
		},
		refresh : function() {
			DH.render();
		},
		moveTo: function(dest,callback) {
			var list = yun.fileman.get_file_selected();
			if(!list.length) {
				return yun.message(_L('Error: No file selected'),yun.MessageMode.MODE_CAUTION);
			}
			yun.fileman.move(list,dest,callback);
		},
	};
	
	$myPlace.$(document).ready(function(){
		function btn(text) {
			return $myPlace.$(
			'<div style="margin-left:6px;display:inline-block" class="module-list-toolbar"><a style="padding-left:10px;display:inline-block;" href="javascript:;" class="btn">' + 
				'<span class="btn-val">' + 	text + 	 '</span>' +
			'</a></div>'
			);
		}
		function buttonClick(what,arg1,arg2,arg3) {
			var self = yun.Fileman;
			var idPath = "FilemanPath";
			var idExp = "FilemanExp";
			var default_path = yun.Config.read(idPath) || '/testing';
			var default_exp = yun.Config.read(idExp) || '.*';
			if(!self.SaveDialog) {
				self.SaveDialog = new yun.SaveDialog(default_path,default_exp);
			}
			self.SaveDialog.setVisible(true);
			self.SaveDialog.OnConsent = function(source,target) {
				yun.Config.write(idPath,target);
				yun.Config.write(idExp,source);
				self.getList(what,function(all) {
					var files = yun.Utils.pickFiles(
						all,source,
						function(item,idx) {
							return "" + (idx+1) + "#" + item.server_filename;
						}
					);
					message(_L("Get $1 tasks",files.length) + '.');
					if(files.length > 0) {
						yun.actions.transferFiles(what,target,files,arg1,arg2,arg3);
					}
					return 1;
				});
			};
		}
		var self = yun.LinkSaver;
		var buttons = [
			{
				label:	_L('Refresh'),
				click:	function() {
					return yun.actions.refresh();
				}
			},
			{
				label:	  _L('Rename'),
				click:	function(){
					var exp = prompt(_L("Input regexp:"),yun.Config.read('LastRenameExp') || "");
					if(exp) {
						var rpl = prompt(_L("Input replacement:"),yun.Config.read("LastRenameReplacement") || "");
						yun.Config.write('LastRenameExp',exp);
						yun.Config.write('LastRenameReplacement',rpl);
						return yun.actions.rename(new RegExp(exp),rpl);
					}
				},
			},
			{
				label:	_L('Move4'),
				click:	function() {
					var dest = prompt(_L("Input target destination:"),yun.Config.read("LastTargetDest4"));
					if(dest) {
						yun.Config.write("LastTargetDest4",dest);
						return yun.actions.moveTo(dest,function(){yun.actions.refresh()});
					}
				},
			},
			{
				label:	_L('Move3'),
				click:	function() {
					var dest = prompt(_L("Input target destination:"),yun.Config.read("LastTargetDest3"));
					if(dest) {
						yun.Config.write("LastTargetDest3",dest);
						return yun.actions.moveTo(dest,function(){yun.actions.refresh()});
					}
				},
			},
			{
				label:	_L('Move2'),
				click:	function() {
					var dest = prompt(_L("Input target destination:"),yun.Config.read("LastTargetDest2"));
					if(dest) {
						yun.Config.write("LastTargetDest2",dest);
						return yun.actions.moveTo(dest,function(){yun.actions.refresh()});
					}
				},
			},
			{
				label:	_L('Move1'),
				click:	function() {
					var dest = prompt(_L("Input target destination:"),yun.Config.read("LastTargetDest1"));
					if(dest) {
						yun.Config.write("LastTargetDest1",dest);
						return yun.actions.moveTo(dest,function(){yun.actions.refresh()});
					}
				},
			},
		
		];
		pos = $myPlace.$('.list[node-type="btn-list"]')[0];//.parentNode;
		for(var i=0;i<buttons.length;i++) {
			var b = btn(buttons[i].label);
			b.click(buttons[i].click);
			b.insertBefore(pos);
			pos = b[0];
		}
	});
	unsafeWindow.myDisk = disk;
})($myPlace.baidu.yun);


/*
// ==UserScript==
// @name        myplace.baidu.yun.fileman
// @namespace   eotect@myplace
// @description 百度网盘文件管理
// @include     http://pan.baidu.com/disk/home*
// @include     http://yun.baidu.com/disk/home*
// @version     1.02
// @grant 		none
// Changelog
//	2013-09-28
//		Add support for magnet links
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
	
	var Utilities = unsafeWindow.Utilities;
	var Messager = new yun.Messager('li');
	function message(text,mode) {
		return Messager.say(text,mode);
	}
	var _L = yun._L;
	yun.Fileman = {
		selectDirectory	: function(callback) {
			var E = Page.obtain();
			if (!E._mMoveCopyDialog) {
                E._mMoveCopyDialog = new disk.ui.MoveCopyDialog();
            }
            E._mMoveCopyDialog.onRefuse = function (_) {
                FileUtils.switchToDir(FileUtils.getDirMgr().getDir());
            };
            E._mMoveCopyDialog.onClose = function () {};
            E._mMoveCopyDialog.onConsent = function (D, F) {
				if(callback) {
					return callback(D,F);
				}
				return F;
			};
			E._mMoveCopyDialog.setVisible(true);
		},
		parseDirPath: function (_) {
            return _.substring(_.indexOf(":/") + 1);
        },
		saveFile : function(t) {
			var page = Page.obtain();
			return page.MoveCopy(t.type,t.files,t.path);
			//return yun.LinkSaver.doTransferFiles(t.path,t.filelist,t.uk,t.shareid,function(res){
				//message("RESULT: " + res);
			//});
		},
		saveFiles : function(type,path,f,onebyone) {
			var tasks = [];
			//f = f || FileUtils.SHARE_DATAS.currentChacheData;
			if((!f) || f.length < 1) {
				message(_L('No tasks.'));
				return;
			}
			if(onebyone) {
				for(var i=0;i<f.length;i++) {
					tasks.push({
						type:		type,
						path:		path,
						filename:	f[i].server_filename,
						files:		[f[i]],
					});
				}
			}
			else {
				var files_count = f.length;
				var flimit = Math.floor(files_count/5) + 1;
				if(flimit < 5) {
					flimit = 5;
				}
				var limit = flimit<30 ? flimit : 30;
				var pages_count = files_count / limit;
				if(pages_count*limit<files_count) pages_count++;
				for(var i=0;i<pages_count;i++) {
					var s = i*limit;
					var e = ((s + limit)>files_count) ? files_count : s+limit;
					tasks.push({
						type:		type,
						path:		path,
						filename:	f[s].server_filename,
						files:		f.slice(s,e),
					});
				}
			}
			var action = type == disk.ui.MoveCopyDialog.COPY ? _L("Copy") : _L("Move");
			yun.Utils.doTasks(this.saveFile,tasks,0,3000,function(task,idx,tasks){
				if(task) {
					message("[" + (idx+1) + "/" + tasks.length + "] " + action + _L("$1 files",task.files.length) + ': ' + task.filename + ' ...',1);
				}
				else {
					message(idx + _L("tasks done."));
				}
			});
		},
		getList: function (what,callback) {
			var data;			
			var _ = (FileUtils.getViewMode() == 1 ? FileUtils._mInfiniteGridView : FileUtils._mInfiniteListView);
			if(_) {
				data =  _.getCheckedItems();
				if(data.length<1) {
					data = _.getElementsData();
				}
			}
			yun.Cache.FilemanList = data;
			if(callback) {
				return callback(data);
			}
			return data;
		},
		saveMagnet:	function(path,str) {
			var url = "http://pan.baidu.com/rest/2.0/services/cloud_dl?bdstoken="+FileUtils.bdstoken;
 			var a1=str.indexOf('xt=urn:btih:');
			if(a1==-1){
				message(_L('Error: Invalid URI.'),2);
			}
			else {
				message(_L('Adding task...'),1);
				var a2=str.indexOf("&",a1);
				if(a2==-1){
					str=str.substring(a1+12);
				}
				else{
					str=str.substring(a1+12,a2);
				}
				str=str.toUpperCase();
				$.getJSON("http://pan.baidu.com/api/categorylist?channel=chunlei&category=7&num=1&page=1",function(json){
				$.post(url,	{
						method:"add_task",
						app_id:"250528",
						source_path:json.info[0].path,
						file_sha1:str,
						save_path:path,
						type:"2"
					},
					function(data,status){
						if(status=="success") {
							message(_L('Task added.'));
						}
						else {
							message(_L('Error: Failed to add task.'),2);
						}
					}
				)});
			}
		},
		openMagnetDownloader : function() {
			
			var self = this;
			var d = new yun.URIDialog(
				{
					id:'magnet_savedin',
					value:FileUtils.getDirMgr().getDir()
				},
				{
					id:'magnet_uri',
					value:''
				}
			);
			d.OnConsent = function(path,uri) {
				alert(uri);
				self.saveMagnet(path,uri);
			}
			d.setVisible(true);
		},
	}
	
	var page = Page.obtain();
	page.refresh = function(){
			FileUtils.getLocalCache().removeCategorys();
					try {
						var _ = disk.Context.getService(disk.Context.SERVICE_TOAST);
						_.setVisible(false);
						FileUtils.getLocalCache().removeAll();
						FileUtils.getLocalCache().removeCategorys();
						//disk.ui.DocReader.clearAllDocData();
						if (FileUtils.getModule() == "category") {
							FileUtils.triggerType(FileUtils.getType());
						} else {
							if (FileUtils.inSearchMode()) {
								//disk.ui.DocReader.clearAllDocData();
								FileUtils.issueProxyLoading(true, false);
								var G = FileUtils.resolveCurrentDirKey();
								FileUtils.loadDir(G == FileUtils.ROOT_ID ? "" : G);
							} else {
								//disk.ui.DocReader.clearAllDocData();
								FileUtils.issueProxyLoading(true, false);
								FileUtils.loadDir(FileUtils.resolveCurrentDirKey());
							}
						}
						Utilities.scheduleQueryQuota();
						Utilities.useToast({
							toastMode: disk.ui.Toast.MODE_LOADING,
							msg: "\u6b63\u5728\u52a0\u8f7d\u6570\u636e\uff0c\u8bf7\u7a0d\u5019&hellip;",
							sticky: true
						});
					} catch (H) {
						if (disk.DEBUG) {
							console.log("error on move or copy files ", H.message);
						}
						Utilities.useToast({
							toastMode: disk.ui.Toast.MODE_CAUTION,
							msg: (D == disk.ui.MoveCopyDialog.MOVE ? "\u79fb\u52a8" : "\u590d\u5236") + "\u6587\u4ef6\u5931\u8d25\uff0c\u8bf7\u7a0d\u5019\u91cd\u8bd5",
							sticky: false
						});
					}
					this._mPendingHighlights = null;
	},
	page.MoveCopy = function (D, C,DEST) {
		var E = Page.obtain();

		
		if (typeof C == "undefined") {
			C = FileUtils.getListViewCheckedItems();
		}
		if (C.length > 100) {
			Utilities.useToast({
				toastMode: disk.ui.Toast.MODE_CAUTION,
				msg: "\u4e00\u6b21\u64cd\u4f5c\u6587\u4ef6\u4e0d\u53ef\u8d85\u8fc7100\u4e2a",
				sticky: false
			});
		} else {
			if (D == disk.ui.MoveCopyDialog.COPY) {
				var B = 0;
				for (var A = 0, _ = C.length; A < _; A++) {
					B += C[A].size ? B : 0;
					if (!Utilities.hasEnoughSpacing(B)) {
						Utilities.useToast({
							toastMode: disk.ui.Toast.MODE_CAUTION,
							msg: "\u590d\u5236\u5931\u8d25\uff0c\u5269\u4f59\u7a7a\u95f4\u4e0d\u8db3",
							sticky: false
						});
						return;
					}
				}
			}
			var F=DEST;
			if (disk.DEBUG) {
				console.log("before move selected files and dirs to ", "[", F, "]", "and action type ", D);
			}
			var B = C;
			if (B.length > 0) {
				if (F == FileUtils.getDirMgr().getDir()) {
					if (disk.DEBUG) {
						console.log(">>>>we are hitting the same dir, reject this request");
					}
					Utilities.useToast({
						toastMode: disk.ui.Toast.MODE_CAUTION,
						msg: "\u60a8\u8981" + (D == disk.ui.MoveCopyDialog.MOVE ? "\u79fb\u52a8" : "\u590d\u5236") + "\u7684\u6587\u4ef6\u5df2\u7ecf\u5b58\u5728\u4e8e\u76ee\u6807\u8def\u5f84",
						sticky: false
					});
					FileUtils.switchToDir(F);
					return;
				}
				for (var A = 0, C, _ = B.length; A < _; A++) {
					C = FileUtils.parseDirPath(B[A].path);
					if (disk.util.DirectoryLocation.isDecendentsOf(F, C)) {
						Utilities.useToast({
							toastMode: disk.ui.Toast.MODE_CAUTION,
							msg: "\u4e0d\u80fd\u5c06\u6587\u4ef6" + (D == disk.ui.MoveCopyDialog.MOVE ? "\u79fb\u52a8" : "\u590d\u5236") + "\u5230\u81ea\u8eab\u6216\u5176\u5b50\u76ee\u5f55\u4e0b",
							sticky: false
						});
						FileUtils.switchToDir(FileUtils.getDirMgr().getDir());
						return;
					}
				}
				Utilities.useToast({
					toastMode: disk.ui.Toast.MODE_LOADING,
					msg: "\u6b63\u5728" + (D == disk.ui.MoveCopyDialog.MOVE ? "\u79fb\u52a8" : "\u590d\u5236") + "\u6587\u4ef6\uff0c\u8bf7\u7a0d\u5019&hellip;",
					sticky: true
				});
				FileUtils.sendMoveCopyFileMessage(D == disk.ui.MoveCopyDialog.MOVE, B, F == disk.util.DirectoryLocation.DIR_ROOT ? "/" : F, function (F) {
					FileUtils.getLocalCache().removeCategorys();
					try {
						var _ = disk.Context.getService(disk.Context.SERVICE_TOAST),
							A = (D == disk.ui.MoveCopyDialog.MOVE ? "\u79fb\u52a8" : "\u590d\u5236") + "\u6587\u4ef6\u5931\u8d25",
							B = null;
						_.setVisible(false);
						var C = $.parseJSON(F);
						if (C.errno == 0) {
							A = (D == disk.ui.MoveCopyDialog.MOVE ? "\u79fb\u52a8" : "\u590d\u5236") + "\u6587\u4ef6\u6210\u529f";
						} else {
							if (C.errno == 12) {
								B = E.dealCopyMoveBatchCallback1(C, D);
								if (B) {} else {
									A = "\u90e8\u5206\u6587\u4ef6" + (D == disk.ui.MoveCopyDialog.MOVE ? "\u79fb\u52a8" : "\u590d\u5236") + "\u6210\u529f";
								}
							}
						} if (disk.DEBUG) {
							console.log("move or copy files success, prepare to update local cache");
						}
						FileUtils.getLocalCache().removeAll();
						FileUtils.getLocalCache().removeCategorys();
						if(disk.ui.DocReader) {
							disk.ui.DocReader.clearAllDocData();
						}
						_.pending(function () {
							Utilities.useToast(B ? B : {
								toastMode: disk.ui.Toast.MODE_SUCCESS,
								msg: A,
								sticky: false
							});
						});
						if (FileUtils.getModule() == "category") {
							FileUtils.triggerType(FileUtils.getType());
						} else {
							if (FileUtils.inSearchMode()) {
								disk.ui.DocReader.clearAllDocData();
								FileUtils.issueProxyLoading(true, false);
								var G = FileUtils.resolveCurrentDirKey();
								FileUtils.loadDir(G == FileUtils.ROOT_ID ? "" : G);
							} else {
								disk.ui.DocReader.clearAllDocData();
								FileUtils.issueProxyLoading(true, false);
								FileUtils.loadDir(FileUtils.resolveCurrentDirKey());
							}
						}
						Utilities.scheduleQueryQuota();
						Utilities.useToast({
							toastMode: disk.ui.Toast.MODE_LOADING,
							msg: "\u6b63\u5728\u52a0\u8f7d\u6570\u636e\uff0c\u8bf7\u7a0d\u5019&hellip;",
							sticky: true
						});
					} catch (H) {
						
						if (disk.DEBUG) {
							console.log("error on move or copy files ", H.message);
						}
						if(!H.message.match(/disk.ui.DocReader/)) {
							Utilities.useToast({
								toastMode: disk.ui.Toast.MODE_CAUTION,
								msg: (D == disk.ui.MoveCopyDialog.MOVE ? "\u79fb\u52a8" : "\u590d\u5236") + "\u6587\u4ef6\u5931\u8d25\uff0c\u8bf7\u7a0d\u5019\u91cd\u8bd5",
								sticky: false
							});
						}
					}
					this._mPendingHighlights = null;
				});
			}
		}
    };
		
	$myPlace.$(document).ready(function(){
		function btn(text) {
			return $myPlace.$('<li><button style="display:block;height:29px;margin-right:5px" ' +
				'title="' + text + '" href="javascript:;" class="two-pix-btn">' + 
				text + 	'</button></li>');
		}
		function buttonClick(what,arg1,arg2,arg3) {
			var self = yun.Fileman;
			var idPath = "FilemanPath";
			var idExp = "FilemanExp";
			var default_path = yun.Config.read(idPath) || '/testing';
			var default_exp = yun.Config.read(idExp) || '.*';
			if(!self.SaveDialog) {
				self.SaveDialog = new yun.SaveDialog(default_path,default_exp);
			}
			self.SaveDialog.setVisible(true);
			self.SaveDialog.OnConsent = function(source,target) {
				yun.Config.write(idPath,target);
				yun.Config.write(idExp,source);
				self.getList(what,function(all) {
					var files = yun.Utils.pickFiles(
						all,source,
						function(item,idx) {
							return "" + (idx+1) + "#" + item.server_filename;
						}
					);
					message(_L("Get $1 tasks",files.length) + '.');
					if(files.length > 0) {
						self.saveFiles(what,target,files,arg1,arg2,arg3);
					}
					return 1;
				});
			};
		}
		var self = yun.LinkSaver;
		var buttons = [
			{
				label:	_L('Magnet downloader'),
				click:	function(){
					return yun.Fileman.openMagnetDownloader();
				},
			},
			{
				label:	_L('Move'),
				click:	function(){
					return buttonClick(disk.ui.MoveCopyDialog.MOVE);
				},
			},
			{
				label:	_L('Copy'),
				click:	function(){
					return buttonClick(disk.ui.MoveCopyDialog.COPY)
				},
			},
			{
				label:	_L('Move 1by1'),
				click:	function(){
					return buttonClick(disk.ui.MoveCopyDialog.MOVE,true);
				},
			},
			{
				label:	_L('Copy 1by1'),
				click:	function(){
					return buttonClick(disk.ui.MoveCopyDialog.COPY,true);
				},
			},
			{
				label:	_L('Refresh'),
				click:	function() {
					return page.refresh();
				}
			},
		];
		pos = $myPlace.$('.list[node-type="btn-list"]')[0];//.parentNode;
		for(var i=0;i<buttons.length;i++) {
			var b = btn(buttons[i].label);
			b.click(buttons[i].click);
			b.insertBefore(pos);
			pos = b[0];
		}
	});
	unsafeWindow.myDisk = disk;
})($myPlace.baidu.yun);

*/
