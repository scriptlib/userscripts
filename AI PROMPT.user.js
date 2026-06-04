// ==UserScript==
// @name        AI PROMPT
// @namespace   Violentmonkey Scripts
// @match       https://www.promeai.pro/*
// @grant       none
// @version     1.0
// @author      -
// @description 8/3/2024, 4:27:51 AM
// ==/UserScript==

(function(){
  var mpd_html = ' ' +
'<button id="mpd_display">[-]</button>'+
'<div id="mpd_content">'+
'<span id="prompt_text"></span><br />'+
'<hr/>' +
'<select id="prompt_btn0"  >+</select>'+
'<select id="prompt_btn1"  multiple="true">+</select>'+
'<select id="prompt_btn2" >+</select>'+
'<select id="prompt_btn3" >+</select>'+
'<select id="prompt_btn4" >+</select>'+
'<select id="prompt_btn5" multiple="true">+</select>'+
'<select id="prompt_btn6" >+</select>'+
'<select id="prompt_btn7" multiple="true">+</select>'+
'<select id="prompt_btn8" >+</select>'+
'<select id="prompt_btn9" style="display:none" >+</select>'+
'</div>';

  var mpd = document.createElement("div");
mpd.setAttribute("id","myplace_prompt_dialog");
mpd.setAttribute("style","position:absolute;border:solid 1px;z-index:32768;background:white;top:0px;left:0px;display:block;");
mpd.innerHTML = mpd_html;
document.body.appendChild(mpd);


var dresses = [
   "无",
   "衣服",
   "时尚的衣服",
   "古典的礼服",
   "高贵典雅的旗袍",
   "古代欧洲贵族夫人的衣服",
   "都市职业女性的衣服",
   "透明的黑色蕾丝薄纱性感睡衣",
   "网纱宽松透明吊带睡裙",
   "吊带裙丝绒",
   "纯色中长款连衣裙",
   "春装新款桑蚕丝长袖t恤",
   "洋气polo上衣",
   "宽松打底针织衫",
   "休闲运动欧货卫衣高级洋气",
   "新款洋气宽松休闲西服外套",
   "香云纱短外套哈伦裤套装女",
   "不规则纯棉t恤女短袖",
   "白色雪纺衬衫",
   "夜场礼服",
   "女公关晚礼服裙",
   "T恤",
   "蕾丝内衣",
   "T恤和牛仔短裙",
   "T恤和蕾丝裙",
   "T恤和牛仔裤",
  "黑色丝袜和短裙",
  "浴巾",
  "浴袍",
  "破布",
  "皮衣",
  "皮裙",
   "蕾丝",
   "毛衣",
   "露背装",//backless outfit
   "连身裙",//sweater dress
   "碎花长裙",
   "背心",//tank top
   "雪纺连衣裙",//chiffon dress
   "紧身衣",//leotard
   "汉服",//hanfu
   "高领衬衫",//collared shirt
   "排球服",//volleyball uniform
   "运动服",//sportswear
   "竞赛泳衣",//competition swimsuit
   "学校泳衣",//school swimsuit
   "连体泳衣",//one-piece swimsuit
   "泳装",//swimsuit
   "系绳比基尼",//string bikini
   "比基尼",//bikini
   "正面系带比基尼上衣",//front-tie bikini top
   "巫女服",//Miko clothing
   "小披风",//poncho
   "宇航服",//Space suit
   "乳胶衣",//latex_bodysuit
   "透明晚礼服",//[see-through:evening dress:0.3]
   "修女服",//nun clothes
   "实验袍",//lab coat
   "休闲服(素上衣、牛仔裤)",//casual wear
   "夏日长裙",//summer long skirt
   "便利店工作服",//convenience store uniforms
   "连身裙",//dress
   "丁字紧身衣",//thong leotard
   "罗纹毛衣",//ribbed sweater
   "束腹",//corset
   "露腹短上衣",//crop top
   "赛车服",//racing suit
   "护士服",//nurse
   "西装",//business suit
   "浴袍",//bathrobe
   "日式浴衣",//yukata
   "长袍",//robe
   "圣诞装",//santa
   "哥特洛丽塔风格",//gothic_lolita
   "马猴烧酒风格",//mahou shoujo
   "女仆装",//Maid dress
   "西服(black黑)",//black suit
   "兜帽斗篷",//Cape hood
   "军装",//military uniform
   "披风",//cloak
   "白色风衣",//white_windbreaker
   "大衣",//overcoat
   "战壕风衣",//trench_coat
   "风衣",//wind coat
   "外套",//coat
   "晚礼服",//evening dress
   "战斗服",//combat suit
   "学校制服",//school_uniform
   "甜美的洛丽塔",//sweet_lolita
   "网纹衣",//fishnet top
   "魔女风格服",//Witch dress
   "抹胸",//strapless tank top, navel cutout
   "派克大衣",//parka
   "紧身连体衣",//zentai
   "紧身衣",//bodysuit
   "皮夹克",//leather jacket
   "防弹衣",//bulletproof_vest
   "蛛网纹路",//spider web print
   "雨衣",//Raincoat
   "睡衣",//nightgown
   "街头风格服饰",//street wear
   "铠甲",//armor
   "动力甲",//power armor
   "连帽衫",//hoodie
   "圆领卫衣",//sweatshirt
   "神父/修生黑袍",//Cassock
   "工装",//dungarees
   "希腊服饰",//Greek clothes
   "V领针织毛衣（无袖背心）",//V-NECK SWEATER VEST
   "道袍",//Taoist robe
   "军大衣",//Army overcoat
   "荷叶边衬衫",//frillded shirt
   "长袖运动服",//Standing collar long windbreaker
   "蕾丝边内衣",//lace-trimmed bra
   "肚皮舞者",//Belly Dancer
   "无袖衬衫",//sleeveless_shirt
   "OL套装",//office lady suit
   "兔女郎",//Bunny Girl
   "和服",//japanese_clothes
   "红格衬衫",//Red Plaid Shirts
   "体操服",//student training wear
   "婚纱",//wedding_dress
   "军礼服",//Military officer dress
   "运动胸罩",//sports bra
   "啦啦隊",//cheerleading
   "连体服",//jumpsuit
   "牛仔裤",//jeans
   "吊带牛仔裤",//Denim suspenders
   "牛仔短裤",//denim shorts
   "吊带裤",//trousers with suspenders
   "灯笼裤",//bloomers
   "透视睡衣",//See-through Pajamas
   "骆驼趾/骆驼肌(紧身效果)",//cameltoe
   "紧身裤",//leggings
   "丁字裤",//thong
   "短裤",//shorts
   "高腰裤",//high-waist pants
   "红色短裤",//red shorts
   "瑜伽裤",//yoga pants
   "腰围裙",//waist apron
   "围裙",//apron
   "蓬蓬裙",//pettiskirt
   "夏日连衣裙",//summer dress
   "露肩连衣裙",//off-shoulder dress
   "迷你裙",//miniskirt
   "铅笔裙",//pencil skirt
   "长裙",//Long skirt
   "雨裙",//Rainskirt
   "微型短裙",//microskirt
   "黑百褶裙",//black pleated skirt
   "吊带裙",//suspender skirt
   "现代洛丽塔",//lolita fasion
   "哥特式洛丽塔",//lolita gothic
   "包臀裙",//sheath dress
   "轻纱广袖裙",//Light gauze wide sleeve skirt
   "带褶连衣裙",//pleated dress
   "睡裙",//night dress
   "经典白色衬衫裙",//Classic white shirtdress
   "白色铅笔连衣裙",//white pencil dress
   "复古摩登连衣裙",//Vintage 1920s flapper dress with fringe and beaded embellishments
   "童话公主礼服",//Fairy tale princess gown with delicate lace and sparkly gems
   "挂脖连衣裙",//halter neck dress
   "西装外套连衣裙",//blazer dress
   "闪亮金色露肩迷你连衣裙",//A glittering gold mini dress with a off-the-shoulder top
   "黑色和金色亮片迷你连衣裙",//A black and gold sequin mini dress
   "黑色缎面吊带连衣裙",//A black satin slip dress
   "一件时尚的黑色高领连衣裙",//A sleek black turtleneck dress
   "波西米亚别致印花长裙",//Boho-chic maxi skirt with prints
   "扇形下摆白色蕾丝连衣裙",//white lace dress with a scalloped hem
   "荷叶边迷你裙搭配简单的白色T恤",//mini skirt with a ruffled hem paired with a simple white t-shirt
   "黑色蕾丝短款上衣搭配高腰白色中长半身裙",//A black lace crop top with a high-waisted white midi skirt
   "闪亮水晶装饰无肩带舞会礼服",//Embellished Strapless Ball Gown with Sparkling Crystals
   "淡色薄纱半身裙",//Pastel Tulle Skirt
   "荷叶边连衣裙",//Peplum Dress
   "瑜伽服",//Yoga Attire
   "空姐制服",//Flight Attendant Uniform
   "警察制服",//police uniform
   "医生的白大褂",//Doctor‘s White Coat
   "白色衬衫裙",//Classic white shirtdress
];

var prompts = [
    ["一个","两个","三个","多个","a",""],
    ["皮肤光滑白皙的","性感的","漂亮的","短发的","完美的","身材很好的","胸部丰满的","丰满的"," perfect"," short hair"," beatiful"," sexy"," full-bosomed"," bosomy"," curvy"," busty"," big boobs"," large bosom"," pleasing curves","mature"],
    ["韩国","中国","欧洲","美国","北欧","南欧"," korean","chinese"," west"," east"],
    ["女人","女人，","女人的祼体","woman","lady","women","ladies"],
    ["穿着","披着","围着","裸体","露出","wearing","naked","exposing","无"],
    [
      "高领的","复古摩登的","荷叶边的",
      "扇形下摆的","波西米亚的","黑色缎面的",
      "雪纺的","休闲的","职业的","情趣的",
      "色情的","居家的","性感的","深V的",
      "大开口的","低胸的","一字领的","露肩的",
      "无肩带","无袖的","平领的","透明的",
      "黑色的","白色的","黄色的","丰满的",
      "胸部","胸罩","奶头","阴部","无"
    ],
    dresses,
    ["无","和牛仔裤","和裤子","和短裤","和短裙","和皮裙","，摆出性感诱惑的姿势","，露出很白很白的乳房","，露出奶头","，露出","，站着","，坐着","，跪着","，蹲着","，躺着","，手指捏着","，双手抓住"," exposing"],
    ["无","在地上","在床上","在屋里","在路边","在海边","奶头","乳房","一边的奶头","一边的乳房","nipples","tits"],
    ["。"],
];

var ID_SEL_OPT ="prompt_btn";


function update_prompt() {
    var texts = [];
    var saved = [];

     for(var i=0;i<prompts.length;i++) {
        var sel = document.getElementById(ID_SEL_OPT+i);
        var defv = [];
        for(var j=0;j<sel.length;j++) {
            if(sel.options[j].selected) {
                var t = sel.options[j].text
                if(t !="无") {
                  if(t.match(/^[a-zA-Z0-9 ]+$/)) {
                    texts.push(" " + t)
                  }
                  else {
                    texts.push(t);
                  }
                }
                defv.push(j);
            }
        }
        saved.push(defv.join("-"));
    }
    localStorage.setItem("mpd_selected",saved);
    var prompt_string = texts.join("");

    var input_area = document.getElementById("input_area");
    if(input_area) {
      var old = input_area.value;
      if(old) {
        var re = /(\(.+?\))/g;
        var mt = old.match(re);
        if(mt) {
          prompt_string = mt.join(",") +"," + prompt_string;
        }
      }
      input_area.value = prompt_string;
      input_area.textContent = prompt_string;
      input_area.dispatchEvent(new Event("input"));
    }
    document.getElementById("prompt_text").innerHTML = prompt_string;
}

var texts = ["","","","","","","","","",""];

function set_prompt(options) {
    for(var i=0;i<options.length;i++) {
        var v = options[i];
        if(typeof(v) !="undefined") {
            var sel = document.getElementById(ID_SEL_OPT+""+i);
            if(sel) {
                v.split("-").forEach(function(a){sel.options[a].selected=1});
            }
        }
    }
    update_prompt();
}

function prompt_btn_click(a,b,c) {
    update_prompt();
}

function new_opt(v) {
    var opt =  document.createElement("option");
    opt.text = v;
    return opt;
}

function mpd_display_toggle() {
    var dialog = document.getElementById("mpd_content");
    var display = dialog.style.display;
    var btn = document.getElementById("mpd_display");
    if(display && display =="none") {
        dialog.style.display ="block";
        btn.innerHTML ="[-]";
    }
    else {
        dialog.style.display ="none";
        btn.innerHTML ="[+]";
    }
}

function find_login() {
  var $myPlace = unsafeWindow.$myPlace;
  if(!$myPlace) {
    $myPlace = window.$myPlace;
  }
  if(!($myPlace && $myPlace.panel)) {
    return;
  }
  var elms = document.querySelectorAll(".userContent span");
  for(var i=0;i<elms.length;i++) {
    var text = elms[i].textContent;
    if(text && text.match(/Log in/i)) {
          var  b = elms[i].cloneNode();
          $myPlace.panel.add(b);
    }
  }
}

function set_elements(prompts) {

    for(var i=0;i<prompts.length;i++) {
        var sel = document.getElementById(ID_SEL_OPT+i);
        if(sel) {
            for(var j=0;j<prompts[i].length;j++) {
                sel.add(new_opt(prompts[i][j]));
            }
            if(i == 1 || i == 5 || i==6) {
              sel.setAttribute("style","border-style:double;width:160px");
            }
            else {
              sel.setAttribute("style","border-style:double;");
            }
            sel.addEventListener("click",(event)=>{prompt_btn_click(i)});
            sel.addEventListener("selected",(event)=>{prompt_btn_click(i)});

        }
    }
}


set_elements(prompts);

var mpd_display = document.getElementById("mpd_display");
if(mpd_display) {
  mpd_display.click = mpd_display_toggle;
  mpd_display.addEventListener("click",(event)=>{mpd_display_toggle()});
}


function load() {
        var def = ["0","3-1-5-0-2","0","0","0","0-1","0","0","0","0"];
        var saved = localStorage.getItem("mpd_selected");
        if(saved) def = saved.split(",");
        set_prompt(def);
        find_login();
};
load();

window.addEventListener("DOMContentLoaded",(event)=>{load()});


})();
