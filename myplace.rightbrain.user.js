// ==UserScript==
// @name        myplace.rightbrain
// @namespace   MyPlace.rightbrain
// @match       https://rightbrain.art/*
// @match       https://152.136.108.28/*
// @match       https://vegaai.net/*
// @version     1.0.1
// @author      Eotect Nahn
// @description 3/24/2023, 1:14:44 PM
// @version     1.0.0
// @grant       none
// @run-at      document-idle
// @grant    GM_setValue
// @grant    GM_getValue
// ==/UserScript==
if(!unsafeWindow) {
	unsafeWindow = window;
}
var $myPlace = $myPlace || unsafeWindow.$myPlace || {};
unsafeWindow.$myPlace = $myPlace;

(function(_){


    var d = {};

    function add_tag(n,o) {
      var no = o;
      no = no.replace(/[,，　　]+/,", ");
      n = n.replace(/[,，　　]+/,", ");
      var an = n.split(/,\s*/);
      var ao = no.split(/,\s*/);
      var nn = new Array();
      for(var i=0;i<ao.length;i++) {
        var t = ao[i];
        if(!an.includes(t)) {
          nn.push(t);
        }
      }
      for(var i=0;i<an.length;i++) {
        var t = an[i];
        if(!ao.includes(t)) {
            nn.push(t);
        }
      }
      return nn.join(", ");
    }

    function tag_click(e) {
        var input = document.getElementsByClassName("create-input");
        var t = e.target.getAttribute("value");
        if(input.length>0) {
          input = input[0];
          var text = input.value;
          input.value = add_tag(t,text);
          input.dispatchEvent(new Event("input"));
        }
      }

    function get_config() {
       var panels = document.getElementsByClassName("panel-item");
          var inputs = {};
          for(var i=0;i<panels.length;i++) {
            var panel = panels[i];
            var cn = panel.childNodes[0].innerText;
            var ci = panel.getElementsByTagName('input');
            if(ci.length>0) {
              inputs[cn] = ci[0];
            }
          }
      return inputs;
    }

    var default_tags = ["1:一位亚洲女性，诱惑，简单开放的衣服","2:一位亚洲女性，深V，丰满，诱惑，简单开放的衣服","full-body:full-body shot","heat designs:intricate heat distortion designs","detailed:highly detailed","sharp:sharp focus","一位女性","亚洲","性感","深V","毛衣","丰满","湿身","透明","薄纱","露肩","吊带","缕空"];

    function update_tags(ct) {
      var olds = ct.getElementsByClassName("myplace-vega-tag");
      for(var i=olds.length-1;i>=0;i--) {
        ct.removeChild(olds[i]);
      }
       var saved_tags  = GM_getValue("vega-tags");
      var tags = default_tags;
      if(saved_tags) {
        tags = saved_tags.split("|");
      }

          for(var i=0;i<tags.length;i++) {
              var t = tags[i];
              var v = t;
              var m = t.match(/^([^:]+):(.+)$/);
              if(m && m.length>1) {
                t = m[1];
                v = m[2];
              }
              var e = document.createElement("span");
              e.innerHTML = t + "<br/>";
              e.setAttribute("value",v);
              e.setAttribute("class","myplace-vega-tag");
              ct.appendChild(e);
              e.addEventListener("click",tag_click);
              e.setAttribute("style","text-decoration:underline;text-color:yellow;color:yellow;padding:5px;");
              //var s = document.createElement("span");
              //s.setAttribute("style","width:10px");
              //ct.appendChild(s);
          }

    }
    function start() {
        var inputbox = document.getElementsByClassName("contain");
        if(inputbox.length>0) {
          inputbox = inputbox[0];
          if(inputbox.getAttribute("myplace.vega")) {
            return;
          }
          inputbox.setAttribute("myplace.vega",1);
          var ct = document.createElement("div");
          ct.setAttribute("class","myplace-vega-panel");
          ct.setAttribute("style","position:absolute;width:120px;top:10%;left:92%");


          var note = document.createElement("div");
          note.setAttribute("style","text-decoration:underline;text-color:white;color:white;padding:5px;font-size: 60px;position: fixed;top: 0px;");
          note.innerHTML = "N";
          note.setAttribute("class","myplace-vega-note");
          note.onclick = function(e) {
            var t = prompt("Notes:",e.target.innerHTML);
            if(t) {
              e.target.innerHTML = t;
            }
          }
          ct.appendChild(note);

          var ctags = document.createElement("div");
          ctags.setAttribute("class","myplace-vega-tags");
          update_tags(ctags);
          ct.appendChild(ctags);

          var btnstyle = "display: flex;	align-items: center;	height: 44px;	border-radius: 6px;	margin:10px 0 10px;padding: 0 10px;	background: #f8d849;	color: #000;	font-size: 14px;	font-weight: 600;	transition: all .3s;	cursor: pointer;";
          var inputbtn = document.getElementsByClassName("input-btn");
          if(inputbtn.length>0) {

            var stags = document.createElement("button");
            stags.innerHTML = "TAGS";
            stags.setAttribute("style",btnstyle)
            stags.setAttribute("class","myplace-vega-tags-btn");
            stags.onclick = function(e) {
              var d = GM_getValue("vega-tags");
              if(!d) {
                d = default_tags.join("|");
              }
              GM_setValue("vega-tags",prompt("Input tags:",d));
              var c = document.getElementsByClassName("myplace-vega-tags");
              if(c.length>0) {
                update_tags(c[0]);
              }
            }
            ct.appendChild(stags);

            var o = inputbtn[0];
            var c = document.createElement("button");
            c.innerHTML = "生成+";
            c.setAttribute("style",btnstyle)
            c.setAttribute("class","myplace-vega-btn");
            c.onclick = function(e,f,g,h) {
              var n = get_config()["随机种子"];
              if(n) {
                var n1 = new Number(n.value);
                if(!n1) {
                  n1 = 1;
                }
                else if(n1<1) {
                  n1 = 1;
                }
                else {
                  n1 = n1 + 1;
                }
                n.value = n1;
                n.dispatchEvent(new Event("input"));
              }
              return o.childNodes[0].click(e,f,g,h);
            }
            ct.appendChild(c);
          }
          inputbox.appendChild(ct);
        }
    }

  function toggle_display(c) {
    var elm = document.getElementsByClassName(c)[0];
    var hide = elm.getAttribute("toggle_display");
    if(hide && hide == "0") {
      elm.setAttribute("toggle_display","1");
      elm.style.display = "";
    }
    else {
      elm.setAttribute("toggle_display","0");
      elm.style.display = "none";
    }
    return 1;
  }

    d.start = start;
    //d.start();
    if(_.panel) {
      _.panel.addAction("<",function(){toggle_display("menu",">","<")});
      _.panel.addSpace();
      _.panel.addAction("Prompt",start);
      _.panel.addSpace();
      _.panel.addAction(">",function(){toggle_display("shell-panel","<",">")});
    }
	_.vega = d;
})($myPlace);