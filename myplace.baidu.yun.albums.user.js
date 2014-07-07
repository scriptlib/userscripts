// ==UserScript==
// @name        myplace.baidu.yun.albums
// @namespace   eotect@myplace
// @description 百度专辑批理转存
// @include     http://yun.baidu.com/pcloud/album/*
// @include		http://pan.baidu.com/pcloud/album/*
// @include     http://pan.baidu.com/s/*
// @include     http://yun.baidu.com/s/*
// @version     1.006
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
	var Utilities = unsafeWindow.Utilities;
	var Messager = new yun.Messager('li');
	function message(t,m) {
		return Messager.say.apply(t,m);
	}
	var _L = yun._L;
	
	yun.AlbumSaver = {
		transferFiles : function(album,D,_file,info) {
			
			album = album || disk.ui.album;
			var _obj = unsafeWindow._obj || [];
			unsafeWindow._file = _file;
			var B = D,
				C = [],
				_ = _obj.shareid || _obj;
			Utilities.useToast({
				toastMode: disk.ui.Toast.MODE_LOADING,
				msg: "\u6b63\u5728\u4fdd\u5b58 \"" + info +"\"\uff0c\u8bf7\u7a0d\u5019&hellip;",
				sticky: true,
				position: disk.ui.Panel.TOP
			});
			if (_.length > 0) {
				C.push("&shareid=");
				C.push(_);
			}
			$.ajax({
				type: "post",
				url: disk.ui.album.RestAPI.transfer,
				data: {
					access_token: FileUtils.bdstoken,
					from_uk: album._mUk,
					album_id: album._mAlbumId,
					to_path: B || "/",
					fsid_list: unsafeWindow.Array.toStringify(_file[0])
				},
				timeout: 100000,
				success: function (E) {
					try {
						var D = $.parseJSON(E);
					} catch (I) {
						if (disk.DEBUG) {
							console.log("[LOG]====>parse json error on show property dialog ", I.message);
						}
						Utilities.useToast({
							toastMode: disk.ui.Toast.MODE_CAUTION,
							msg: "\u6570\u636e\u9519\u8bef\uff0c\u8bf7\u7a0d\u5019\u91cd\u8bd5",
							sticky: false,
							position: disk.ui.Panel.TOP
						});
					}
					if (D == null) {
						Utilities.useToast({
							toastMode: disk.ui.Toast.MODE_CAUTION,
							msg: "\u7f51\u7edc\u9519\u8bef\uff0c\u8bf7\u7a0d\u5019\u91cd\u8bd5",
							sticky: false,
							position: disk.ui.Panel.TOP
						});
					} else if(D.errno == 0) {
						album.transferQuer(D.event_id);
					} else {
						Utilities.useToast({
							toastMode: disk.ui.Toast.MODE_FAILURE,
							msg: "\u4fdd\u5b58\u5931\u8d25\uff0c" + C,
							sticky: true,
							position: disk.ui.Panel.TOP,
							closeType: true
						});
					}
				}
			});
	},
		saveFile : function(t) {
			return yun.AlbumSaver.transferFiles(t.album,t.path,t.filelist,t.filename,function(res){
				//message("RESULT: " + res);
			});
		},
		saveFiles : function(target,f,what,album) {
			if((!f) || f.length < 1) {
				message(_L('No tasks.'));
				return;
			}
			var tasks = [];
			for(var i=0;i<f.length;i++) {
				tasks.push({
					path: target,
					album:album,
					filelist:[[f[i].fs_id]],
					filename:f[i].filename,
				});
			}
			yun.Utils.doTasks(this.saveFile,tasks,0,3000,function(task,idx,tasks){
				if(task) {
					message("[" + (idx+1) + "/" + tasks.length + "] " + _L('Saving') + ' ' + task.filename + ' ...',1);
				}
				else {
					message(idx + _L("tasks done."));
				}
			});
		},
		getList: function (callback,arg1,arg2,arg3,arg4) {		
			var lis = unsafeWindow.$('li.file-item');
			var files=[];
			if(yun.Cache.AlbumFileList) {
				files = yun.Cache.AlbumFileList;
			}
			else {
				for(var i=0;i<lis.length;i++) {
					var c = lis[i].getAttribute('class');
					var d = c.match(/fsid_(\d+)/);
					if(d) {
						files.push({fs_id:parseInt(d[1]),filename:lis[i].title,title:lis[i].title});
					}
				}
			}
			yun.Cache.AlbumFileList = files;
			if(callback) {
				return callback(files,arg1,arg2,arg3,arg4);
			}
			return files;
		},
	};
	$(document).ready(function(){
		pos = $('#barListView')[0].parentNode;
		function btn(text) {
			return $('<li><button style="display:block;height:29px;margin-right:5px" ' +
				'title="' + text + '" href="javascript:;" class="two-pix-btn">' + 
				text + 	'</button></li>');
		}
		function _buttonClick(what,arg1,arg2,arg3) {
			var idPath = "AlbumSaverPath";
			var idExp = "AlbumSaverExp";
			var default_path = yun.Config.read(idPath) || '/testing';
			var default_exp = yun.Config.read(idExp) || '.*';
			if(!self.SaveDialog) {
				self.SaveDialog = new yun.SaveDialog(default_path,default_exp,arg1,arg2,arg3);
			}
			self.SaveDialog.setVisible(true);
			self.SaveDialog.OnConsent = function(source,target) {
				yun.Config.write(idPath,target);
				yun.Config.write(idExp,source);
				self.getList(function(all) {
					var files = [];
					if(!source) {
						files = all;
					}
					else {
						var r = new RegExp(source);
						for(var i=0;i<all.length;i++) {
							var s = "" + (i+1) + "#" + all[i].title;							
							if(r.test(s)) {
								files.push(all[i]);
							}
						}
					}
					message(_L("Get $1 tasks",files.length) + '.');
					if(files.length > 0) {
						self.saveFiles(target,files,what,arg1,arg2,arg3);
					}
					return 1;
				},what);
			};
		}
		var _album = new unsafeWindow.disk.ui.album;
		var saveBtn1 = btn(_L('Save current page'));
		
		var self = yun.AlbumSaver;
		saveBtn1.click(function() {return _buttonClick("page",_album)});
		saveBtn1.insertBefore(pos);	
		Messager.insertBefore(saveBtn1);
		
		// var saveBtn2 = btn(_L('Save all page'));		
		// saveBtn2.click(function() {return _buttonClick("all",_album)});	
		// saveBtn2.insertBefore(saveBtn1);	
		// //var txtBox = $('<li><input id="select_path" style="display:block;height:29px;margin-right:5px"  value="' +default_path+'" type="text" name="Path"></li>');
		// //txtBox.insertBefore(saveBtn2);
		// Messager.insertBefore(saveBtn2);
		//if(document.location.href.match(/\/share\/link/)) {
			// saveBtn2.hide();
		// }
	});
	unsafeWindow.myDisk = disk;
})($myPlace.baidu.yun);


