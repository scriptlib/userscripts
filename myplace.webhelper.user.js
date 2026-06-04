// ==UserScript==
// @name        myplace.webhelper
// @namespace   MyPlace
// @match       https://pan.quark.cn/s/*
// @match       https://www.aliyundrive.com/s/*
// @match       https://www.alipan.com/*
// @match       https://pan.xunlei.com/s/*
// @grant       none
// @version     1.0
// @author      Eotect Nahn
// @description 3/10/2024, 3:46:26 AM
// @run-at      document-idle
// ==/UserScript==

(function() {

  var href = document.location.href;
  var counter = 0;

  function set_title() {
    counter++;
    console.log("Counter of set_title: " + counter);
    if(href.match(/pan\.quark\.cn/)) {
      var elm = document.getElementsByClassName("file-tit");
      if(elm.length) {
        document.title = "" + "网盘_夸克_" + elm[0].innerText;
        return 1;
      }
    }
    else if(href.match(/aliyundrive\.com/)) {
      var elms = document.getElementsByTagName("p");
      for(var i=0;i<elms.length;i++) {
        var elm = elms[i];
        var cs = elm.className;
        if(!cs.match(/^text-primary/)) {
          continue;
        }
        if(elm.title) {
          document.title = "" + "网盘_阿里_" + elm.title;
          return 1;
        }
      }
    }
    else if(href.match(/alipan\.com/)) {
      var elms = document.getElementsByTagName("p");
      for(var i=0;i<elms.length;i++) {
        var elm = elms[i];
        var cs = elm.className;
        if(!cs.match(/^title--/)) {
          continue;
        }
        if(elm.innerText) {
          document.title = "" + "网盘_阿里_" + elm.innerText;
          return 1;
        }
      }
    }
    else if(href.match(/https:\/\/pan\.xunlei\.com/)) {
      var elms = document.getElementsByTagName("li");
      for(var i=0;i<elms.length;i++) {
        var elms_a = elms[i].getElementsByTagName('a');
        if(!elms_a.length) {
          continue;
        }
        var elm = elms_a[0];
        if(elm.title) {
          document.title = "" + "网盘_迅雷_" + elm.title;
          return 1;
        }
      }

    }

    setTimeout(set_title,1000);

  }
  set_title();
})();
