// ==UserScript==
// @name        myplace.baidu.yun.common
// @namespace   eotect@myplace
// @description $myPlace.baidu.yun.common
// @include     http://yun.baidu.com/share/*
// @include     http://pan.baidu.com/share/*
// @include     http://yun.baidu.com/pcloud/album/*
// @include     http://pan.baidu.com/disk/home*
// @version     1.010
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
var $ = unsafeWindow.$ || $myPlace.jQuery;
$myPlace.baidu = $myPlace.baidu || {};
$myPlace.baidu.yun = $myPlace.baidu.yun || {};

(function(d){
	var disk = unsafeWindow.disk;
	var FileUtils = unsafeWindow.FileUtils;
	var Page = unsafeWindow.Page;
	var Utilities = unsafeWindow.Utilities;
	function fixpath(a) {
		a = a.replace(/  >  /g,'/');
		a = a.replace(/^\s*>\s*/g,'/');
		if(!a.match(/^\//)) {
			a = '/' + a;
		}
		return a;
	}
	function readValue(key) {
		return $('#' + key).attr("value");
	}
	function setValue(key,value) {
		return $('#' + key).attr("value",value);
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
			}
		},
		Messager : function(tag) {		
			var r;
			if(!(Utilities && Utilities.useToast)) {
				var id  = 'xrlin_msg_area';
				r = $('#' + id);
				if(!r.length) {
					var html = '<span style="display:none;height:29px;margin-right:30px;"  class="toast-content" id="' +
							id + '"></span>';
					if(tag) {
						html = '<' + tag + '>' + html + '</' + tag + '>';
					}
					r = $(html);
				}
				r.ELEMENTID = id;
				r.say = function(text) {
					unsafeWindow.console.log(text);
					var b = $('#' + this.ELEMENTID);
					if(text && text!="") {
						b.show();
						b[0].innerHTML=text;
					}
					else {
						b.hide();
						b[0].innerHTML="";
					}
				};
			}
			else {
				r = $('<span></span>');
				r.say = function(text,mode) {
					unsafeWindow.console.log(text);
					var t = {
						toastMode:	disk.ui.Toast.MODE_SUCCESS,
						msg:		text,
						sticky:		false
					};
					if(mode) {
						switch(mode){
							case 1:
								t.toastMode = disk.ui.Toast.MODE_LOADING;
								t.sticky = true;
								break;
							case 2:
								t.toastMode = disk.ui.Toast.MODE_CAUTION;								
								break;
							case 3:
								t.toastMode = disk.ui.Toast.MODE_FAILURE;
								break;
						}
					}
					Utilities.useToast(t);
				};
			}
			return r;
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
			var element = $(html)[0];
			$(element).appendTo($('#' + c._mMsgContentId));
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
			var btn = $('#sd_button');
			var dd;
			if(disk.ui.MoveSaveDialog) {
				btn.click(function() {
					var dd = FileUtils;
					if(!dd._mMoveSaveDialog) {
						FileUtils._mMoveSaveDialog =  new disk.ui.MoveSaveDialog();
					}
                    dd._mMoveSaveDialog._mUI.pane.style.zIndex=12501;
					dd._mMoveSaveDialog.onConsent = function (D) {
							$('#' + path.id).attr('value',D);
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
			var element = $(html)[0];
			$(element).appendTo($('#' + c._mMsgContentId));
            c._mOnCancel = function() {
            	c.OnCancel && c.OnCancel(c);
            }
			c._mOnConsent = function() {
				source = readValue('sd_source');
				target = fixpath(readValue('sd_target'));
				setValue('sd_target',target);
				c.setVisible(false);
				if(c.OnConsent) {
					return c.OnConsent(source,target);
				}
			}
            c._mUI.pane.style.zIndex=12500;
			var btn = $('#sd_button');
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
							$('#sd_target').attr('value',D);
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
				if(Page.getCookie) {
					r = Page.getCookie(key);
					
				}
				else {
					r = unsafeWindow.localStorage.getItem(key)
				}
					if(r) r = r.replace(/\s+$/g,'');
				return r;
			},
			write	: function(key,value) {
				if(Page.setCookie) {
					return Page.setCookie(key,value,100000);
				}
				else {
					return unsafeWindow.localStorage.setItem(key,value)
				}
			}
		},
		Cache : {
		},
        UI : {
            getHeader : function() {
                var a = $('.homeheader');
                if(a && a[0]) {
                    return a[0];
                }
                else {
                    return undefined;
                }
            }
        },
		Downloader : function(props) {
			var self = this;
			this.props = props;
			this._button = function(text) {
				return $('<li><button style="display:block;height:29px;margin-right:5px" ' +
				'title="' + text + '" href="javascript:;" class="two-pix-btn">' + 
				text + 	'</button></li>');
			}
			this.addButton = function(label,pos) {
				if(!self.buttons) {
					self.buttons = {};
				}
				self.buttons.push(label,pos);
			}
			this.ready = function(){
				for(var i=0;i<self.buttons.length;i++) {
					var n = $(self.buttons[i][1]);
					var b = $(self._button(self.buttons[i][0]));
					if(n.length && b.length) {
						b.appendTo(n);
						b.click(function() {
							self.selectPath(function(A,B,C,D){
								self.getList(self.saveFiles,b[0],A,B,C,D);
							},b[0])
						});
					}
				}
			};
			this.getList = function(callback,eventSource,A,B,C,D){
			};
			
		},
	};
	$(document).ready(function() {
		var header = d.yun.UI.getHeader();
		if(header) {
			$myPlace.panel.addButton(
				{
					html: "-Header",
					set: function(){header.style.display='block';}
				},
				function() {
					return header.style.display != 'none';           
				},
				{
					html: "+Header",
					set: function(){header.style.display='none';}
				}
			);
			$myPlace.panel.show();
		}
	});
})($myPlace.baidu);
