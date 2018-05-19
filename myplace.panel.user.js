// ==UserScript==
// @name           myplace.panel
// @namespace      eotect@myplace
// @description    $myPlace.panel
// @include        http*
// @version        1.03
// @grant	none
// ==/UserScript==

if(!unsafeWindow) {
	unsafeWindow = window;
}
var $myPlace = $myPlace || unsafeWindow.$myPlace || {};
unsafeWindow.$myPlace = $myPlace;

(function(_){
	const PANEL_ID = "xrlin_panel";
	const PANEL_BOX_ID = "xrlin_panel_pbox";
	const PANEL_HOLDER_ID = "xrlin_panel_holder";
	const SEPARATOR_TEXT="&nbsp;&nbsp;";// &nbsp; &nbsp;";
	const PANEL_CONTROL_ID = 'xrlin_panel_control';
		function  debugPrint(text) {
			/*
			if(console) {
				console.log("Eotect Golbal Panle:" + text)
			}
			else {
				//GM_log("Eotect Golbal Panel:" + text);
			}
			return true;
			*/
		}
		
	var XRZPanel = {
		TEXT_SHOW : '+',
		TEXT_HIDE : '-',
		DOMParent : null,
		DOMPanel : null,
		DOMBox : null,
		DOMHolder : null,
		DOMControl : null,
		PANEL_STYLE	:	
				'padding: 4px;margin: 0px;z-index: 100000027;top: 30px;'
				+'right: 0px;width: auto;position: absolute;text-align: right;'
				+'font: 13px helvetica,arial,clean,sans-serif;display: block;'
				+'border: 1px solid #000;background-color: #FEFEFE;color: #010101;'
				+'opacity: 0.6;'
				+'',
		LINKBOX_STYLE:
				'margin: 0px;padding: 2px;text-align: center; '
				+'font: 13px helvetica,arial,clean,sans-serif;display: block;color: #030303;'
				+'',
		CLICKABLE_STYLE:
				'cursor:pointer;text-decoration:underline;',
		init : function() {
			debugPrint("Start on " + document.location);
			if(parent != window) {
				debugPrint("In a frame? Stop here!");
				return false;
			}
			if(document.getElementById(PANEL_ID)) {
				//debugPrint("Panel already created? Stop here!");
				this.DOMParent = document.body;
				this.DOMPanel = document.getElementById(PANEL_ID);
				this.DOMBox = document.getElementById(PANEL_BOX_ID);
				this.DOMHolder = document.getElementById(PANEL_HOLDER_ID);
				this.DOMControl = document.getElementById(PANEL_CONTROL_ID);
				return true;
			}
			panelwidth="100%";
			panelheight="40px";
			var panel=document.createElement("table");
			
			panel.id=PANEL_ID;
			panel.setAttribute('style',this.PANEL_STYLE);
			var tr = document.createElement('tr');
			//tr.style.border="1px solid black";

			/*
			var td = document.createElement('td');
			var control = document.createElement('span');
			control.id = 'panel_delete';

			control.innerHTML = '&nbsp;-';
			control.style.cursor = 'pointer';
			control.addEventListener('click',function() {
						XRZPanel.delete();return 1;
					},
					false);
			td.appendChild(control);   
			tr.appendChild(td);
			*/
			var td = document.createElement('td');
			var control = document.createElement('span');
			control.id = PANEL_CONTROL_ID;

			control.innerHTML = this.TEXT_HIDE;//'&lt;&lt;&lt;';
			control.style.cursor = 'pointer';
			control.addEventListener('click',function() {
						XRZPanel.toggle();return 1;
					},
					false);
			td.appendChild(control);
			
			tr.appendChild(td);
			
			
			var linkbox=document.createElement("td");
			linkbox.id= PANEL_BOX_ID;
			linkbox.setAttribute('style',this.LINKBOX_STYLE);
			tr.appendChild(linkbox);
			
			
			
			panel.appendChild(tr);
					
			// var ss = document.createElement('style');
			// ss.innerText = '.a {color:black;cursor:bean;    }';
			// panel.appendChild(ss);
			
			//document.body.insertBefore(holder,document.body.firstChild);
			document.body.insertBefore(panel,document.body.firstChild);
			// debugPrint("Panel box created");
			this.DOMParent = document.body;
			//this.DOMHolder = document.getElementById(PANEL_HOLDER_ID);
			this.DOMPanel = document.getElementById(PANEL_ID);
			this.DOMBox = document.getElementById(PANEL_BOX_ID);
			this.DOMControl = document.getElementById(PANEL_CONTROL_ID);
			
			return true;
		},

		add : function(elm,space) {
			if(this.DOMBox) {
				this.DOMBox.appendChild(elm);
				if(space) {this.addSpace(space)};
				return 1;
			}
			return null;
		},
		addSpace : function(count) {
			if(this.DOMBox) {
				var separator = document.createElement("span");
				var prepend;
				if(count < 0) {
					count = -count;
					prepend = 1;
				}
				if(count) {
					var space = '';
					for(var i=0;i<count;i++) {
						space = space + SEPARATOR_TEXT;
					}
					separator.innerHTML = space;				
				}
				else {
					separator.innerHTML = SEPARATOR_TEXT;
				}
				if(prepend) {
					return this.DOMBox.insertBefore(separator,this.DOMBox.firstChild);
				}
				else {
					return this.DOMBox.appendChild(separator);
				}
			}
			return null;
		},
		addLink	: function(url,text,space) {
			var a = document.createElement('a');
			a.href = url;
			a.innerHTML = text;
			a.setAttribute('style',this.CLICKABLE_STYLE);
			this.add(a,space);
		},
		addText	:	function(text,space) {
			return this.addAction(text,null,space);
		},
		addAction : function(text,func,space) {
			var a = document.createElement('span');
			if(func) {
				a.addEventListener('click',func);
				a.setAttribute('style',this.CLICKABLE_STYLE);
			}		
			a.innerHTML = text;
			this.add(a,space);
		},
		addButton	: function (state1,cond,state2) {
			var element = document.createElement('span');
			element.innerHTML = state1.html;
			element.setAttribute('style',this.CLICKABLE_STYLE);
			
			element.addEventListener('click',function(){
				var test = cond();
				if(test) {
					this.innerHTML = state2.html;
					state2.set(element,test);
				}
				else {
					this.innerHTML = state1.html;
					state1.set(element,test);
				}
			});
			this.addSpace();
			this.add(element);
			return element;
		},
		hide : function() {
			this.DOMBox.style.display = "none";
			this.DOMControl.innerHTML = this.TEXT_SHOW;//'&lt;&lt;&lt;';
		//    this.DomPanel.style.width='200px';
		},
		show : function() { 
			this.DOMBox.style.display = "block";
			this.DOMControl.innerHTML = this.TEXT_HIDE;//'&gt;&gt;&gt;';
			//this.DOMPanel.style.width='100%';
		},
		toggle : function() {
			if(this.DOMBox.style.display == "none") 
				this.show();
			else
				this.hide();
		},
		delete : function() {
			//this.DOMParent.removeChild(this.DOMHolder);
			this.DOMParent.removeChild(this.DOMPanel);
		}
	}
	var a = XRZPanel;
	a.init();
	_.panel = a;
})($myPlace);

