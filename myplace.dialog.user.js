// ==UserScript==
// @name        myplace.dialog
// @namespace   eotect@myplace
// @description myplace.dialog
// @include     *
// @include		file://*
// @version     1
// @grant       none
// ==/UserScript==
if(!unsafeWindow) {
	unsafeWindow = window;
}
var $myPlace = $myPlace || unsafeWindow.$myPlace || {};
unsafeWindow.$myPlace = $myPlace;

$myPlace.dialog = {
		_CACHED : {},
		create : function(id,title,configs) {
			var dialog = document.getElementById(id);
			if(dialog) {
				dialog.parentNode.removeChild(dialog);
			}
			var html = '<div style="background-color: black; margin:0px;padding:0px;z-Index:32768"><span style="color: white; ">'
				+ title + '</span></div>'
				+'<div class="myplace_dialog_content" style="z-Index:32768" id="' + id + '_content"></div>'
				+'<div class="myplace_dialog_command" id="myplace.dialog.config.command" style="z-Index:32768;padding:0px 5px 10px 0px; text-align: right;">'
				+'<input class="myplace_dialog_command_cancel" id="'+ id + '_cancel" style="z-Index:32768;width:60px" value="Cancel" type="button">'
				+ '<input class="myplace_dialog_command_ok" id="'+ id + '_ok" style="z-Index:32768;margin-left: 10px; width: 70px;" value="OK" type="button">'
				+'</div>';
			dialog = document.createElement('div');
			dialog.innerHTML = html;
			dialog.setAttribute('style',"width:400px;top: 25%; left: 30%; border: 1px double black; background-color:#EEE;position: fixed;padding:0px;z-Index:32768");
			dialog.setAttribute('id',id);
			dialog.id = id;
			dialog.hidden = true;
			var s = {
				dialog: dialog,
				id: id,
				title: title,
				show: function(){dialog.hidden = false;},
				hide: function(){dialog.hidden = true;},
				set: function(name,value,title) {
					var dp = document.getElementById(id + '_content');
					var item_id = 'item_' + name;
					var item = document.getElementById(item_id);
					if(!item) {
						item = document.createElement('li');
						dp.appendChild(item);
					}
					title = title || name;
					value = value || '';
					item.innerHTML = title + '<br/>'
						+ '<input id="' + item_id + '" name="' + name + '" '
						+ 'style="width:100%;padding:5px 0px 5px 0px;z-Index:32768;" '
						+ 'type=text value="' + value + '">';
					item.setAttribute('style','padding:10px;z-Index:32768;');
					if(!s.configs) {
						s.configs = {};
					}
					s.configs[name] = value;
					return item_id;
				},
				get: function(name) {
					return s.configs[name];
				},
				getAll : function(){
					var n = {}
					for(var k in s.configs) {
						n[k] = s.configs[k];
					}
					return n;
				},
				_onCancel : function(){
					s.hide();
					var dp = document.getElementById(id + '_content');
					var inputs = dp.getElementsByTagName('input');
					for(var i =0;i<inputs.length;i++) {
						for(var j in s.configs) {
							if(inputs[i].name == j) {
								inputs[i].value = s.configs[j];
							}
						}
					}
					if(s.onCancel) {
						s.onCancel(s.configs);
					}
					else {
						//alert('Cancel');
					}
				},
				_onOK : function(){
					s.hide();
					var dp = document.getElementById(id + '_content');
					var inputs = dp.getElementsByTagName('input');
					if(!s.configs) {
						s.configs = {};
					}
					for(var i =0;i<inputs.length;i++) {
						s.configs[inputs[i].name] = inputs[i].value;
					}
					if(s.onOK) {
						return s.onOK(s.configs);
					}
					else {
						//alert('OK');
					}
				},
				load: function(show){
					document.body.appendChild(dialog);
					var btn = document.getElementById(id + '_cancel');
					btn.onclick = s._onCancel;
					btn = document.getElementById(id + '_ok');
					btn.onclick = s._onOK;
					if(show) {
						s.show();
					}
					else {
						s.hide();
					}
				},
				unload: function(){
					this.parentNode.removeChild(dialog);
				},
			};
			s.load(false);
			for(var i in configs) {
				s.set(i,configs[i]);
			}
			this._CACHED[id] = s;
			return s;
		},
		get	: function(dialog) {
			return this._CACHED[dialog];
		},
};

