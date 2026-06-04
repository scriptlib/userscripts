// ==UserScript==
// @name        Reflow- vegaai.net
// @namespace   MyPlace
// @match       https://www.vegaai.net/*
// @grant       none
// @version     1.04
// @author      Eotect Nahn
// @description 3/5/2024, 9:01:16 PM
// @run-at      document-idle
// ==/UserScript==

if(!unsafeWindow) {
	unsafeWindow = window;
}
var $myPlace = $myPlace || unsafeWindow.$myPlace || {};
unsafeWindow.$myPlace = $myPlace;

$myPlace.reflow = function() {

  var saved = document.getElementById('app');

  saved.style.display = "none";

  var topid = "xr_body";


  var container = document.getElementById(topid);
  if(container) {
    container.parentNode.removeChild(container);
  }
  container = document.createElement("div");
  container.setAttribute("id","xr_body");


  document.body.appendChild(container);
  container.style.display = "block";
  container.style.height = "100%";


  var bg = "#000000"
  var cg = "#FFFFFF";

  document.body.style.background = bg;
  document.body.style.color = cg;

  var table = document.createElement("div");
  table.style = "padding:10px;height: 100%; width: 100%;";
  table.style.background = bg;
  table.style.color = cg;

  table.innerHTML = '<table>' +
    '<tr id="xr_top1_row"><td id="xr_top1" style="vertical-align:top"></td></tr>' +
    '<tr id="xr_top2_row"><td id="xr_top2"  style="vertical-align:top"></td></tr>' +
    '<tr><td  style="vertical-align:top">'  +
      '<table><tr>' +
        '<td id="xr_left"  style="vertical-align:top"></td>' +
        '<td id="xr_right"  style="vertical-align:top"></td>' +
      '</tr></table>' +
    '</td></tr>' +
    '<tr id="xr_bottom_row"><td id="xr_bottom"  style="vertical-align:top"></td></tr>' +
    '</table>';
    /*
    '<div id="xr_left" style="position:fixed;padding:0 0 0 0;height:' + heightTop + 'px;">' +
      '<div id="xr_left_panel" style="padding:0 0 0 0;display:flex"></div>' +
     '</div>' +
    '<div id="xr_top" style="display:flex;position:fixed;margin:' + heightTop + 'px 0 0 0;height:' + heightInput + 'px;width:100%"></div>' +
    '<div id="xr_right" style="width:100%;margin:' + (heightTop + heightInput)  + 'px 0 0 0;border-top:1px dotted;overflow-y:scroll">' +
      '<div id="xr_right_content" style="padding-left:0px;"></div>' +
    '</div>';
  */

    /*
    '<div id="xr_left" style="flex:' + widthLeft + 'px;padding:0 0 0 0;width:' + widthLeft + 'px;height:100%;">' +
      '<div id="xr_left_panel" style="padding:' + heightTop + 'px 0 0 0"></div>' +
     '</div>' +

    '<div id="xr_right" style="flex:auto;width:100%;height:100%;padding:' + heightTop + 'px 0 0 0;border-left:1px dotted">' +
      '<div id="xr_top" style="position:fixed;top:0px;padding:20px 0px 20px 0px;height:10%;width:80%;z-index:1"></div>' +
      '<div id="xr_right_content" style="padding-left:30px;"></div>' +
    '</div>';
  */



    //'<div id="xr_bottom" style="height:50px"></div>' +

  /*
  var table = document.createElement("table");


  table.innerHTML =
    '<tr height="10%"><td id="xr_top"></td></tr>' +
    '<tr height="80%">' +
      '<td id="xr_left" width="10%" style="padding:10px;border:1px solid;vertical-align:top">' +
          '<div id="xr_left_panel" style="padding:0px"></div>' +
      '</td>' +
      '<td id="xr_right" width="90%" style="padding:10px;border:1px solid;overflow-y:scroll">' +
        '<div id="xr_right_content"></div>' +
      '</td>' +
    '</tr>' +
    '<tr height="10%"><td widht="10%"></td><td id="xr_bottom"></td></tr>';

  table.width = "100%";
  table.height = "100%";
  */



  container.appendChild(table);

  var heightCommand = 60;
  var heightInput = 60;
  var widthButton = 100;
  var widthLeft = 0;


  var top1 = document.getElementById("xr_top1");
  var top1_row = document.getElementById("xr_top1_row");
  var top2 = document.getElementById("xr_top2");
  var top2_row = document.getElementById("xr_top2_row");
  var left = document.getElementById("xr_left");
  var right = document.getElementById("xr_right");
  var bottom = document.getElementById("xr_bottom");
  var bottom_row = document.getElementById("xr_bottom_row");
  var panel;

  var content  = right;
  var inputbox = top2;


  var x = window.innerWidth;
  var y = window.innerHeight;


  //alert(x + " - " + y);
  if(x>y) {
    panel = left;
    widthLeft = widthButton + 60;

    left.style = "vertical-align:top;padding:" + heightInput + "px 0 0 0;display:flow;width:" + widthLeft + "px";
    top1_row.setAttribute("height","0");
  }
  else {
    panel = top1;
    panel.style = "vertical-align:top;padding:0 0 0 0;display:flex;width:100%";
    top1_row.setAttribute("height",heightCommand);

  }



  inputbox.style = "vertical-align:top;padding:0 0 0 " + widthLeft + "px;height:" + heightInput + "px;";
  top2_row.setAttribute("height",heightInput);

  content.style.padding = "10px";





  var config = {
    views : [],
    controls : [],
    default : 0,
  }



  function set_content(idx) {

    var views = config.views;

    if(!(views[idx] && views[idx][1])) {
      console.log("Cotent " + idx + " not exist!");
      return false;
    }
    for(var v in views) {
        if(views[v] && views[v][1]) {
          views[v][1].style.display = "none";
        }
      }

    var elm = views[idx][1];
    console.log("set content: " + idx);

    var p = document.getElementById('xr_right');
    var r = p.getBoundingClientRect();
    var x = window.innerWidth - r.left - 40;
    var y = window.innerHeight - r.top;
    if(views[idx][2]) {
      x = x - views[idx][2];
    }
    if(views[idx][3]) {
      y = y - views[idx][3];
    }
    if( x > y) {
      clientHeight = y;
    }
    else {
      clientHeight = x;
    }
     if((clientHeight + 200) > y) {
        clientHeight = y - 200;
      }
     if((clientHeight + 40) > x) {
        clientHeight = x - 40;
      }
    //clientHeight = clientHeight - 40;
    if(clientHeight > 800) {
      clientHeight = 800;
    }
    console.log("x=" + x + ", y=" + y + ", me=" + clientHeight);



    elm.style.width = clientHeight + "px";
    var oplay = elm.style.display1;
    if(oplay == "none") {
      oplay = "block";
    }
    elm.style.display = oplay ? oplay : "block";
    return true;

  }

    function new_btn(elm) {
      var p = document.createElement("div");
      p.style = "text-align:right;margin:5px;padding:5px;font-size:16pt;background:#F8D849;color:black;height:" + (heightCommand - 5*2) + "px;";
      if(typeof(elm) == "string") {
        var btn = document.createElement("button");
        btn.innerHTML = elm;
        btn.type = "button";
        btn.name = elm;
        elm = btn;
      }
      p.appendChild(elm);
      return [elm,p];
  }

  function link_element(btn,idx) {
    var text = btn.innerText;
    btn.onclick = function() {
      console.log("btn clicked:" + text + ": " + idx);
      set_content(idx);
    }
  }

  function add_view(text,elm,x,y) {
    config.views.push([text,elm,x,y]);
    content.appendChild(elm);
    elm.style.display1 = elm.style.display;
    elm.style.display = "none";
    return elm;
  }


  function add_control(elm,flex) {
    var cmd = document.createElement("div");
    cmd.setAttribute("style","width:100%;justify-content:left;align-items:left;display:flex");
    if(typeof(elm.push) == "function") {
      for(v in elm) {
        elm[v][0].style.flex = elm[v][1];
        elm[v][0].style.display = "auto";
        cmd.appendChild(elm[v][0]);
      }
    }
    else {
      elm.style.flex = flex;
      elm.style.display = "auto";
      cmd.appendChild(elm);
    }
    inputbox.appendChild(cmd);
  }


  var url = document.location.href;




  if(url.match(/imagetoimage/i)) {
    var draws = document.getElementsByClassName("draw-body-layout");
    var a = draws[0];
    var b = draws[1];
    //add_view("source",a);
    //add_view("result",b);
    add_view("result",b);
    add_view("source",a);
    add_view("setting",document.getElementsByClassName("shell-panel")[0]);

  }
  else if(url.match(/text2image/i)) {
    add_view("result",document.getElementsByClassName("draw")[0]);
    add_view("setting",document.getElementsByClassName("shell-panel")[0]);
  }
  else if(url.match(/hdmi/)) {
    var ct = document.getElementsByClassName("body")[1];
    ct.style.justifyContent = "flex-start";
    //var hs = document.getElementsByClassName("history")[0];
    add_view("content",ct.parentNode.parentNode,0,-260);
  }

  if(url.match(/imagetoimage|text2image/i)) {
      var saved_btn = document.getElementsByClassName("input-btn")[0];
      var work_btn = new_btn("Go!");
      work_btn[0].onclick = function(e,f,g,h) {
         set_content(0);
         return saved_btn.childNodes[0].click(e,f,g,h);
      }

      //work_btn.setAttribute("style","height:10px;margin:5px;");
      //cmd.appendChild(work_btn[1]);



      var input_text = document.getElementsByClassName("create-input")[0];

      input_text.setAttribute("style","width:100%;min-width:140px;max-width:700px;height:" + (heightInput-10) + "px;margin:5px;border:1px solid yellow;");
      input_text.parentNode.setAttribute("style","width:80%");

      //cmd.appendChild(input_text.parentNode);


      var edit_config = document.getElementsByClassName("panel-group")[1];
      var edit_entry = edit_config.getElementsByClassName("panel-item")[0];
      edit_entry.parentNode.removeChild(edit_entry);

      add_control(edit_entry,1);
      add_control([[work_btn[1],0],[input_text.parentNode,1]]);
  }
  else if(url.match(/\/hdmi/i)) {
    add_control(document.getElementsByClassName('create-btn')[0],1);
  }


  //views.push(["preview",document.getElementsByClassName("preview-wrap")[0]]);
  //add_view("setting",document.getElementsByClassName("shell-panel")[0]);



  set_content(config.default);


  for(v in config.views) {
    var btn = new_btn(config.views[v][0]);
    link_element(btn[1],v);
    panel.appendChild(btn[1]);
  }

  var xrlin_panel = document.getElementById("xrlin_panel");
  if(xrlin_panel) {
    xrlin_panel.style.position = "";
    var pbtn = new_btn(xrlin_panel);
    panel.appendChild(pbtn[1]);
  }



  $myPlace.saved = saved;
}

if($myPlace.panel) {
  //$myPlace.panel.addNewLine();
  $myPlace.panel.addSpace();
  $myPlace.panel.addAction("Reflow",$myPlace.reflow);
  //$myPlace.reflow();
}



