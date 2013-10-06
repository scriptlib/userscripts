// ==UserScript==
// @name        myplace.baidu.yun.share
// @namespace   eotect@myplace
// @description 百度云网盘分享转存
// @include     http://yun.baidu.com/share/*
// @include     http://pan.baidu.com/share/*
// @include     http://pan.baidu.com/s/*
// @version     1.01
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
	yun.share = {
		_L	:	yun._L,
		message : message,
		doTransferFiles: function (D, A, E, C, _) {
			var self = yun.share;
            var B = {
                path: D,
                filelist: $.stringify(A)
            };
			//message(_L("Posting") +' '+ RestApi.TRANSFER,1);
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
			return yun.share.doTransferFiles(t.path,t.filelist,t.uk,t.shareid,function(res){
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
					message(_L("$1 tasks done.",idx),0);
				}
			});
		},
		save:	function(handler,what) {
			var self = yun.share;
			var idPath = "sharePath";
			var idExp = "shareExp";
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
				handler.getFiles(what,function(all) {
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
						message(_L("Ignore $1 albums",albumCount) + ", " + _L("Get $1 tasks",files.length) + '.');
					}
					else {
						message(_L("Get $1 tasks",files.length) + '.');
					}
					if(files.length > 0) {
						self.saveFiles(target,files);
					}
					return 1;
				});
			};
		},
	};
})($myPlace.baidu.yun);



