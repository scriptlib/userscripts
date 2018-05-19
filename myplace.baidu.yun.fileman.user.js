// ==UserScript==
// @name        myplace.baidu.yun.fileman
// @namespace   eotect@myplace
// @description 百度网盘文件管理
// @include     http://pan.baidu.com/disk/home*
// @include     http://yun.baidu.com/disk/home*
// @include     https://pan.baidu.com/disk/home*
// @include     https://yun.baidu.com/disk/home*
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
	
	
	//yun.API.diskHome = unsafeWindow.require("clouddisk-ui:widget/list-view/disk-home.js");
	

	
	
	
	yun.fileman = {
		get_item_selected : function() {
			var tree = yun.fileman.list();
			return tree.getCheckedItems();
		},
		get_file_selected: function() {
			var tree = yun.fileman.list();
			return tree.getCheckedItems();
		},
		list : function(){
			return require("disk-system:widget/pageModule/list/listInit.js");
		},
		move: function(list,dest,callback) {
			yun.fileMoveCopyManager = yun.fileMoveCopyManager || require('disk-system:widget/system/fileService/fileMoveCopy/fileMoveCopy.js');
			return yun.fileMoveCopyManager.moveTo(
						list,
						dest,
						callback
			);
		},
		batch_move:	function(list,pos,end,dest,func) {
			var progress = '[' + pos + '/' + end + ']';
			if(pos>=end) {
				console.log(progress + " 移动任务完成");
				yun.message(_L('Finished moving $1 files',end),yun.MessageMode.MODE_SUCCESS);
				return func(end);
			}
			var file = list[pos];
			var filename = file.server_filename;
			var basename = filename.replace(/^.*[\/\\]/,"");
			basename = basename.replace(/_[A-Fa-f0-9]{40}/,"");
			basename = basename.replace(/\.([^\.]+)$/,"");
			basename = basename.replace(/\.(?:torrent|TORRENT|MASKED|MASKED\(\d+\)|[uU][rR][Ii])$/,"","i");
			file.dest = dest + "/" + basename;
			console.log(progress + " Moving " + filename  + " => " + dest);
			return yun.fileman.move(
				[file],
				file.dest,
				function() {
					setTimeout(function(){
						yun.fileman.batch_move(list,pos+1,end,dest,func)
					},2000);
				}
			);
		},
		rename : function(file,newname,callback){
			return yun.API.fileManager.reName(file.path,callback,newname);
		},
		bat_rename:	function(list,pos,end,func) {
			var progress = '[' + (pos+1) + '/' + end  + ']';
			if(pos>=end) {
				console.log("重命名任务完成");
				yun.message("重命名任务完成",'success');
				//yun.message(_L('Finished renaming $1 files',end),yun.MessageMode.MODE_SUCCESS);
				return func(end);
			}
			var file = list[pos];
			var newname = file.newname;
			console.log(progress + ' RENAME ' + file.oldname + ' => ' + file.newname);
			yun.message(progress + ' RENAME ' + file.oldname + ' => ' + file.newname,'loading');
			return yun.fileman.rename(file,newname,function() {
				setTimeout(function(){
					yun.fileman.bat_rename(list,pos+1,end,func)
				},2000);
				return 1;
			});
		},
	};
	yun.actions = {
		rename : function(exp,rpl) {
			var list = yun.fileman.get_file_selected();
			var newlist = [];
			for(var i=0;i<list.length-1;i++) {
				var file = list[i];
				var oldname = file.server_filename;
				file.oldname = oldname;
				var newname = oldname.replace(exp,rpl);
				if(newname == oldname) {
					console.log('[NO CHANGE]' + oldname);
				}
				else {
					file.newname = newname;
					newlist.push(file);
				}
			}
			if(newlist.length) {
				return yun.fileman.bat_rename(newlist,0,newlist.length,function(){yun.actions.refresh();return 1;});
			}
			else {
				yun.message(_L('Error: Nothing to do'),yun.MessageMode.MODE_CAUTION);
			}
		},
		refresh : function() {
			return yun.API.message.trigger("system-refresh");
			//DH.render();
		},
		moveTo: function(dest,callback,batch) {
			var list = yun.fileman.get_file_selected();
			if(!list.length) {
				return yun.message(_L('Error: No file selected'),yun.MessageMode.MODE_CAUTION);
			}
			if(batch) {
				return yun.fileman.batch_move(list,0,list.length,dest,callback);
			}
			else {
				yun.fileman.move(list,dest,callback);
			}
		},
	};
	
	$myPlace.$(document).ready(function(){
		function btn(btndef) {
			var text = btndef.label;
			var title = btndef.title || text;
			return $myPlace.$(
			'<div class="g-button" title="' + title + '"><a href="javascript:;" class="g-button-right">' + 
				'<span class="btn-val">' + 	text + 	 '</span>' +
			'</a></div>'
			);
		}
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
					var dialog = $myPlace.dialog.get('rename');
					if(!dialog) {
						dialog = $myPlace.dialog.create('rename',_L('Rename'));
						dialog.set('LastRenameExp',yun.Config.read('LastRenameExp'),_L("Input regexp:"));
						dialog.set('LastRenameReplacement',yun.Config.read('LastRenameReplacement'),_L("Input replacement:"));
						dialog.onOK = function(){
							var exp = dialog.get('LastRenameExp');
							var rpl = dialog.get('LastRenameReplacement');
							yun.Config.write('LastRenameExp',exp);
							yun.Config.write('LastRenameReplacement',rpl);
							return yun.actions.rename(new RegExp(exp),rpl);
						}
					}
					dialog.show();
				},
			},
			{
				label:	_L('BS Move'),
				click:	function() {
					var confs = {
						id:'LastTargetDestBS',
						title: _L("Input target destination:"),
					};
					confs.value = yun.Config.read(confs.id);
					var dialog = $myPlace.dialog.get('bsmove');
					if(!dialog) {
						dialog = $myPlace.dialog.create('bsmove',_L('BS Move'));
						dialog.set(confs.id,confs.value,confs.title);
						dialog.onOK = function(){
							confs.value = dialog.get(confs.id);
							yun.Config.write(confs.id,confs.value);
							return yun.actions.moveTo(confs.value,function(){yun.actions.refresh()},1);
						}
					}
					dialog.show();
				}
			}
		];
		var BTNCOUNT = 7;
		for(var i=BTNCOUNT;i>0;i--) {
			buttons.push(
			{
				label:	_L('Move'+i),
				index	:	i,
				title:	yun.Config.read("LastTargetDest" + i) || _L('Move' + i),
			});
		};
		function btn_click(idx,target) {
			return function(){
				var confs = {
					id:'LastTargetDest' + idx,
					title: _L("Input target destination:"),
				};
				confs.value = yun.Config.read(confs.id);
				var dialog = $myPlace.dialog.get('move' + idx);
				if(!dialog) {
					dialog = $myPlace.dialog.create('move' + idx,_L('Move'+idx));
					dialog.set(confs.id,confs.value,confs.title);
					dialog.onOK = function(){
						confs.value = dialog.get(confs.id);
						yun.Config.write(confs.id,confs.value);
						target.setAttribute('title',confs.value);
						return yun.actions.moveTo(confs.value,function(){yun.actions.refresh()},false);
					}
				}
				dialog.show();
			};
		}
		//pos = $myPlace.$('div#layoutMain')[0];pos = pos.firstChild;
		pos = $myPlace.$('div#layoutMain a.g-button')[0];
		var box = $myPlace.$('<div style="display:inline-block"></div>');
		box.insertBefore(pos);
		// a.g-button')[0];//.parentNode;
		for(var i=buttons.length-1;i>=0;i--) {
			var b = btn(buttons[i]);
			if(!buttons[i].click) {
				b.click(btn_click(buttons[i].index,b[0]));
			}
			else {
				b.click(buttons[i].click);
			}
			box.append(b);
			//b.insertBefore(pos);
			//pos = b[0];
		}
	});
	unsafeWindow.myDisk = disk;
})($myPlace.baidu.yun);


