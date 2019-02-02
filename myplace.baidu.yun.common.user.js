// ==UserScript==
// @name        myplace.baidu.yun.common
// @namespace   eotect@myplace
// @description $myPlace.baidu.yun.common
// @include     http://yun.baidu.com/share/*
// @include     http://pan.baidu.com/share/*
// @include     http://yun.baidu.com/pcloud/album/*
// @include		http://pan.baidu.com/pcloud/album/*
// @include     http://pan.baidu.com/disk/home*
// @include     http://yun.baidu.com/disk/home*
// @include     http://pan.baidu.com/s/*
// @include     http://yun.baidu.com/s/*
// @include     https://yun.baidu.com/share/*
// @include     https://pan.baidu.com/share/*
// @include     https://yun.baidu.com/pcloud/album/*
// @include		https://pan.baidu.com/pcloud/album/*
// @include     https://pan.baidu.com/disk/home*
// @include     https://yun.baidu.com/disk/home*
// @include     https://pan.baidu.com/s/*
// @include     https://yun.baidu.com/s/*
// @version     1.05
// @grant none
// Changelog
//	2013-09-28
//		Add support for magnet links
//	2013-09-27
//		Grant NONE, unsafeWindow => window;
//		Add OnCancel event for SaveDialog
// ==/UserScript==


if(!unsafeWindow) {
	unsafeWindow = window;
}
var $myPlace = $myPlace || unsafeWindow.$myPlace || {};
unsafeWindow.$myPlace = $myPlace;

//alert('myplace.baidu.yun.common:' + $myPlace.jQuery);
$myPlace.baidu = $myPlace.baidu || {};
$myPlace.baidu.yun = $myPlace.baidu.yun || {};
unsafeWindow.$BY = $myPlace.baidu.yun;
		
(function(d){
	var disk = unsafeWindow.disk;
	var FileUtils = unsafeWindow.FileUtils;
	var Page = unsafeWindow.Page;
	var Utilities = unsafeWindow.Utilities;
	function fixpath(a) {
		a = a.replace(/%2F/g,'/');
		a = a.replace(/[\s  ]*>[  \s]*/g,'/');
		//a = a.replace(/^\s*>\s*/g,'/');
		if(!a.match(/^\//)) {
			a = '/' + a;
		}
		return a;
	}
	function readValue(key) {
		return document.getElementById(key).value;
	}
	function setValue(key,value) {
		return document.getElementById(key).value = value;
	}
	
	
d.yun = {
		LocaleStringMaps : {
			'Target path:':'\u76ee\u6807\u8def\u5f84\uff1a',
			'Selection filter(Regexp):':'\u9009\u62e9\u8fc7\u6ee4\u5668\uff08\u6b63\u5219\u8868\u8fbe\u5f0f\uff09\uff1a',
			'Saving' : "\u6B63\u5728\u4FDD\u5B58",
			'Posting' : "\u6B63\u5728\u8BF7\u6C42",
			'Save all page' : "\u4FDD\u5B58\u5168\u90E8",
			'Save current page' :"\u4FDD\u5B58\u5F53\u524D\u9875",
			'Tasks'	: "\u4E2A\u4EFB\u52A1",
			'Get'	:  "\u5F97\u5230",
			'Done'	: "\u5B8C\u6210",
			'Save To' : "\u4FDD\u5B58\u5230",
			"tasks done." : "\u4e2a\u4efb\u52a1\u5b8c\u6210\u3002",
			"$1 tasks done." : '\u5b8c\u6210$1\u4e2a\u4efb\u52a1\u3002',
			','	:	"\uff0c",
			'Request share list' : '\u8BF7\u6C42\u6587\u4EF6\u5217\u8868\uFF1A',
			'Page'	: '\u9875',
			"Error, or sharing list is empty." : '\u9519\u8BEF\uFF0C\u6216\u8005\u5171\u4EAB\u5217\u8868\u4E3A\u7A7A\u3002',
			"Ignore $1 albums" : '\u5FFD\u7565\u4E86$1\u4E2A\u4E13\u8F91',
			"Get $1 tasks" : '\u5F97\u5230$1\u4E2A\u4EFB\u52A1',
			'Select...' :	'\u9009\u62e9...',
			'No tasks.'	:	'\u6ca1\u6709\u4efb\u52a1\u3002',
			'Save file' :	'\u4FDD\u5B58\u6587\u4ef6',
			'$1 files'	:	'$1\u4e2a\u6587\u4ef6',
			'Copy':	'\u590D\u5236',
			'Move': '\u79FB\u52A8',
			'Copy 1by1': '\u9010\u4e2a\u590D\u5236',
			'Move 1by1': '\u9010\u4e2a\u79FB\u52A8',
			'Refresh':'\u5237\u65b0',
			'Error: Invalid URI.':'\u9519\u8bef\uff1aURI\u683c\u5f0f\u4e0d\u6b63\u786e\u3002',
			'Adding task...':'\u6b63\u5728\u6dfb\u52a0\u4efb\u52a1\u3002\u3002\u3002',
			'Task added.':'\u6210\u529f\u6dfb\u52a0\u4efb\u52a1\u3002',
			'Error: Failed to add task.':'\u9519\u8bef\uff1a\u6dfb\u52a0\u4efb\u52a1\u5931\u8d25\u3002',
			'Magnet downloader':'\u4e0b\u8f7d\u78c1\u529b\u94fe',
			'Save in:':'\u4fdd\u5b58\u4f4d\u7f6e\uff1a',
			'URI:':'\u94fe\u63a5(URI)\uff1a',
			'Quick Save':'\u5feb\u901f\u4fdd\u5b58',
			'Select pages range...':'Select pages range...',
			'Rename':'重命名',
			'Error: No file selected':'错误: 没有选择文件或文件夹',
			'Input regexp:':'匹配以下条件（正则表达式）：',
			'Input replacement:':'替换为：',
			'Move1'	: '移动1',
			'Move2'	: '2',
			'Move3'	: '3',
			'Move4'	: '4',
			'Move5'	: '5',
			'Move6'	: '6',
			'Move7'	: '7',
			'Move8'	: '8',
			'BS Move' : '超级移动',
			'Refresh'	:'刷新',
			'Input target destination:'	:'输入:目标文件夹',
			'Finished renaming $1 files':'重命名了$1个文件',
			'Finished moving $1 files':'移动了$1个文件',
			'LeftPanel' : '侧边栏',
		},

		_L : function(text,arg1,arg2,arg3,arg4){
			var maps = d.yun.LocaleStringMaps;
			if(typeof text == 'undefined') {
				return text;
			}

			if(typeof maps[text] == 'undefined') {
				return text;
			}
			var t = maps[text];
			var args = [arg1,arg2,arg3,arg4];
			for(var i=1;i<=args.length;i++) {
				if(typeof args[i-1] != 'undefined') {
					t = t.replace(new RegExp('\\$' + i,"g"),args[i-1]);
				}
			}
			return t;
		},
		
		message : function(msg,mode,sticky) {
			var doc = unsafeWindow.document || document || window.document;
			if(!doc) {
				return false;
			}
			var msgId = 'baiduyun_services_msgbox';
			var msgbox = doc.getElementById(msgId);
			var text = '<font color="red">百度云: </font>' + msg;
			if(!msgbox) {
				msgbox = doc.createElement('div');
				msgbox.id = msgId;
				msgbox.addEventListener('click',function(){this.style.display='none';});
				msgbox.setAttribute('style',
					'z-index: 32768; ' 
					+'position: fixed; top: 20px;'
					+'text-align:center;display: block; padding: 10px;'
					+'background-color:#ee7;color:#000;opacity:0.8;'
				);
				doc.body.appendChild(msgbox);
			}
			msgbox.innerHTML = text;
			msgbox.style.display = 'block';
			if(!sticky) {
				setTimeout(function(){
					if(msgbox) {
						msgbox.style.display = 'none';
					}
				},3000);
			}
			return true;
		},
		
		Utils	: {
			doTasks : function(doer,tasks,idx,delay,callback) {
				if(d.yun.Utils.doTasks.FORCESTOP) {
					return 2;
					if(typeof callback == 'function') {
						callback(2,'FORCESTOP');
					}
				}
				if(idx<0) idx=0;
				if(tasks.length < 1) {
					return;
				}
				if(idx >= tasks.length) {
					if(callback) {
						callback(null,idx,tasks);
					}
					return;
				}
				t=tasks[idx];
				doer(t);
				if(callback) {
					callback(t,idx,tasks);
				}
				idx++;
				setTimeout(function(){d.yun.Utils.doTasks(doer,tasks,idx,delay,callback)},delay);
			},
			pickFiles : function(all,source,callback_getprop,callback_ignore) {
				if(!source) {
						return all;
				}
				var files = [];
				if(source.match(/^\s*Range:/)) {
					var rangeexp = source.match(/^\s*Range:(.+?)\s*$/);
					rangeexp = rangeexp[1];
					var exps = rangeexp.split(/\s+/);
					for(var i=0;i<exps.length;i++) {
						var exp = exps[i];
						if(exp.match(/^\s*\d+\s*$/)) {
							var n = exp.match(/^\s*(\d+)\s*$/);
							if(n && n[1] && n[1]>0 && n[1]<=all.length){
								if(callback_ignore && callback_ignore(all[n[1]-1],n[1]-1)) {
									console.log("Ignore item NO." + n[1]);
								}
								else {
									files.push(all[n[1]-1]);
								}
							}
						}
						else if(exp.match(/^\s*\d+-\d+\s*$/)) {
							var n = exp.match(/^\s*(\d+)-(\d+)\s*$/);
							if(n && n[1] && n[2]) {
								for(var i=n[1];i<=n[2] && i<=all.length;i++) {
									if(callback_ignore && callback_ignore(all[i-1],i-1)) {
									console.log("Ignore item NO." + i);
									}
									else {
										files.push(all[i-1]);
									}
								}
							}
						}
					}
				}
				else {
					source = source.replace(/\^\^/g,'[\\s\\._\\-\\+]*'); //分隔符快捷方式
					//alert(source);
					var r = new RegExp(source,'i');
					for(var i=0;i<all.length;i++) {
						if(callback_ignore && callback_ignore(all[i],i)) {
							continue;
						}
						else if(r.test(callback_getprop(all[i],i))) {
							files.push(all[i]);
						}
					}
				}
				return files;
			},
		},
		URIDialog : function(path,uri) {
			if(!path) path= {value:"/Incoming",id:'uridialog_path'};
			if(!uri)  uri = {value:'',id:'uridialog_uri'};
			var c;
			if(disk.ui.SelectDialog) {
				c = new disk.ui.SelectDialog();
			}
			else {
				c = new disk.ui.AlertDialog();
			}
			var html = '<div class="saveDialog" style="display:block;text-align:left">'+
					'<span style="display:block">'+
					d.yun._L('Save in:')+
					'</span><input style="height:20px;width:280px;margin-left:10px;" id="' +
					path.id +
					'" type=text value="' + 
					path.value + 
					'" class="target_path">' + 
					'<button style="display:inline;margin-left:20px" type="button" class="" id="sd_button">' + d.yun._L('Select...') + '</button>' +
					'<br/>' +
					'<span style="display:block">'+
					d.yun._L('URI:')+
					'</span>' +
					'<input style="height:20px;width:280px;margin-left:10px;" id="'+
					uri.id + 
					'" type=text value="' + 
					uri.value + 
					'" class="source_selection">' +
					'<div class="hr"></div>'+
					'</div>';
			var element = $myPlace.$(html)[0];
			$myPlace.$(element).appendTo($myPlace.$('#' + c._mMsgContentId));
            c._mOnCancel = function() {
            	c.OnCancel && c.OnCancel(c);
            }
			c._mOnConsent = function() {
				var pvalue = fixpath(readValue(path.id));
				var uvalue = readValue(uri.id);
				setValue(path.id,pvalue);
				c.setVisible(false);
				if(c.OnConsent) {
					return c.OnConsent(pvalue,uvalue);
				}
			}
            c._mUI.pane.style.zIndex=12500;
			var btn = $myPlace.$('#sd_button');
			var dd;
			if(disk.ui.MoveSaveDialog) {
				btn.click(function() {
					var dd = FileUtils;
					if(!dd._mMoveSaveDialog) {
						FileUtils._mMoveSaveDialog =  new disk.ui.MoveSaveDialog();
					}
                    dd._mMoveSaveDialog._mUI.pane.style.zIndex=12501;
					dd._mMoveSaveDialog.onConsent = function (D) {
							$myPlace.$('#' + path.id).attr('value',D);
							c.setVisible(true);
					}
					c.setVisible(false);
					dd._mMoveSaveDialog.setVisible(true);
				});
			}
			else {
				btn.hide();
			}
			return c;
		},
		SaveDialog : function(path,regexp,album) {
			if(!path) path="/Incoming";
			if(!regexp) regexp='?';
			var c;
			if(disk.ui.SelectDialog) {
				c = new disk.ui.SelectDialog();
			}
			else {
				c = new disk.ui.AlertDialog();
			}
			var html = '<div class="saveDialog" style="display:block;text-align:left">'+
					'<span style="display:block">'+d.yun._L('Target path:')+'</span>' +
					'<input style="height:20px;width:280px;margin-left:10px;" id="sd_target" type=text value="' + path + '" class="target_path">' + 
					'<button style="display:inline;margin-left:20px" type="button" class="" id="sd_button">' + d.yun._L('Select...') + '</button>' +
					'<br/>' +
					'<span style="display:block">'+
					d.yun._L('Selection filter(Regexp):')+
					'</span>' +
					'<input style="height:20px;width:280px;margin-left:10px;" id="sd_source" type=text value="' + regexp + '" class="source_selection">' +
					'<div class="hr"></div>'+
					'</div>';
			var element = $myPlace.$(html)[0];
			$myPlace.$(element).appendTo($myPlace.$('#' + c._mMsgContentId));
            c._mOnCancel = function() {
            	c.OnCancel && c.OnCancel(c);
            }
			c._mOnConsent = function() {
				source = readValue('sd_source');
				target = fixpath(readValue('sd_target'));
				setValue('sd_target',target);
				c.setVisible(false);
				console.log('source=' + source);
				console.log('target=' + target);
				if(c.OnConsent) {
					return c.OnConsent(source,target);
				}
			}
            c._mUI.pane.style.zIndex=12500;
			var btn = $myPlace.$('#sd_button');
			var dd;
			if(disk.ui.MoveSaveDialog) {
				btn.click(function() {
					var dd = album ? album : FileUtils;
					if(!dd._mMoveSaveDialog) {
						FileUtils._mMoveSaveDialog =  new disk.ui.MoveSaveDialog();
						dd._mMoveSaveDialog = FileUtils._mMoveSaveDialog;
					}
                    dd._mMoveSaveDialog._mUI.pane.style.zIndex=12501;
					dd._mMoveSaveDialog.onConsent = function (D) {
							$myPlace.$('#sd_target').attr('value',D);
							c.setVisible(true);
					}
					c.setVisible(false);
					dd._mMoveSaveDialog.setVisible(true);
				});
			}
			else {
				btn.hide();
			}
			return c;
		},
		GetShareList : function(start,limit,func1,func2) {
			var requestCategoryApi = "/pcloud/feed/getsharelist";
			var requestAlbumApi = "/pcloud/album/getlist";
			/*
			http://yun.baidu.com/pcloud/feed/getsharelist?t=1378808717496&start=540&limit=60&category=0&auth_type=1&query_uk=3172540305
			*/
			var _ = FileUtils.SHARE_DATAS.currentCat;
            var A = "";
			var B = {
				t: +new Date(),
				start: FileUtils.SHARE_DATAS.currentPage * FileUtils.SHARE_DATAS.pageSize,
				limit: FileUtils.SHARE_DATAS.pageSize
			};
			if(start) B.start = start;
			if(limit) B.limit = limit;
			if (_ == 10) {
				A = requestAlbumApi;
			} else {
				B.category = _;
				B.auth_type = 1;
				A = requestCategoryApi;
			}
			B.query_uk = FileUtils.SHARE_DATAS.currentUK;
			return $.getJSON(A,B,
				function(_){
					if(func1) func1(_,start,limit);
				},
				function(_){
					if(func2) func2(_,start,limit);
				}
			);
		},
		Config : {
			read	: function(key) {
				var r;
				var from;
				if(!unsafeWindow.localStorage) {
					from = 'Cookie';
					r = Page.getCookie(key);
				}
				else {
					from = 'localStorage';
					r = unsafeWindow.localStorage.getItem(key)
				}
					if(r) r = r.replace(/\s+$/g,'');
				console.log('Config.Read: [' + from + ']' + key + "=" + r)
				return r;
			},
			write	: function(key,value) {
				if(!unsafeWindow.localStorage) {
					console.log('Config.Write: [Cookie]' + key + "=" + value)
					return Page.setCookie(key,value,100000);
				}
				else {
					console.log('Config.Write: [localStorge]' + key + "=" + value)
					return unsafeWindow.localStorage.setItem(key,value)
				}
			}
		},
		Cache : {
		},
        UI : {
            getHeader : function() {
                var a = $myPlace.$('.homeheader');
                if(a && a[0]) {
                    return a[0];
                }
                else {
                    return undefined;
                }
            }
        },
	};
	
	if(typeof(unsafeWindow.require) == 'function') {
		var require = unsafeWindow.require;
		var API = {
			context : require("system-core:context/context.js"),
//			commonService : require("common:widget/commonService/commonService.js"),
//			control : require("disk-system:widget/system/util/message.js"),
//			dataCenter : require("common:widget/data-center/data-center.js"),
			page : require("system-core:system/uiService/page/page.js"),
			fileManager : require("disk-system:widget/system/fileService/fileManagerApi/fileManagerApi.js"),
			message : require("system-core:system/baseService/message/message.js"),
		} ;
		d.yun.API = API;
		d.yun.MessageMode = {
			SUCCESS	:	'success',
			FAILUE	:	'failue',
			CAUTION	:	'caution',
			LOADING :	'loading',
		};
		d.yun.message = function(msg,mode,sticky) {
			return API.context.instanceForSystem.ui.tip({
					msg: msg,
					mode: mode || 'caution',
					autoClose: !sticky,
					hahClose: 1,
			});
		};
	}
			
	
})($myPlace.baidu);
