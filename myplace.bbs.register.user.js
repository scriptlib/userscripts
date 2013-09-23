// ==UserScript==
// @name           myplace.bbs.register
// @namespace      xiaoranzzz
// @include        http*://*/register.php*
// @include        http*://*/reg.php*
// @include		 http*://*/1register78.php*
// @include		 http*://*mod=register*
// @include			http*://*/forum/*register*.php*
// ==/UserScript==
function start() {
var $ = unsafeWindow.$;
var damnass='a' + 'b' + 'sfreed' + 'o' + 'm';
var damnname='t' + '' + 'i' + 'da';
damnname += '' + '' + 's' + 'e' + 's';
function random_int(max,min) {
    max = max ? max : 100;
    min = min ? min : 0;
    return Math.floor((max-min-1)*Math.random()+min);
}
function random_name(length) {
    length = length ? length : random_int(10,8);
    var source = "aaaabcdeeeefghiiiiijklmnooooopqrstuuuuvwxyz";//ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var s_len = source.length;
    var result="";
    for(var i=0;i<length;i++) {
        result += source.substr(random_int(s_len-1,0),1);
    }
    return result;
}

function get_field(INPUTS,name) {
    for(var i=0;i<INPUTS.length;i++) {
        if(INPUTS[i].name.match(name,"i")) {
            return INPUTS[i];
        }
    }
}

function set_field(input,value) {
    if(input) {
        input.value = value;
    }
}

var INPUTS = document.getElementsByTagName("input");
function set(name,value) {
    set_field(get_field(INPUTS,name),value);
}

try {
    unsafeWindow.wait = 0;
    unsafeWindow.secs = 0;
    if(unsafeWindow.timer && unsafeWindow.update) {
        unsafeWindow.update = function() {return 1;};
        unsafeWindow.timer();
        var bt = get_field(document.getElementsByTagName("button"),"rulesubmit"); 
        if(bt) {
            bt.click();
        }
    }
}
catch(e) {
}

function fill_form (user,email,pass) {
	var exp_user = new RegExp('^(username|regname|g3MGJn|9hEBZ7)$');
	var exp_pass = new RegExp('^(password|regpwd|password2|regpwdrepeat)$');
	var exp_email = new RegExp('^(email|regemail|X0Cr57|Ze75Eh)$');
	var div_reg = document.getElementById('reginfo_a');
	if(div_reg) {
		var elements = div_reg.getElementsByTagName('input');
		var fields = new Array();
		for(var i=0;i<elements.length;i++) {
			var t = elements[i].getAttribute('type');
			if(t && t == 'hidden') {
				continue;
			}
			fields.push(elements[i]);
		}
		if(fields.length > 3) {
			fields[0].value = user;
			fields[1].value = fields[2].value = pass;
			fields[3].value = email ? email : user + '@hotmail.com';
		}
		return;
	}
	for(var i=0;i<INPUTS.length;i++) {
		var id = INPUTS[i].getAttribute('id');
		var name = INPUTS[i].getAttribute('name');
		var type = INPUTS[i].getAttribute('type');
		if(type && type == 'password') {
			INPUTS[i].value = pass;
		}
		if(!name) {
			name = id;
		}
		if(name) {
			if(name.match(exp_user)) {
				INPUTS[i].value = user;
			}
			else if(name.match(exp_pass)) {
				INPUTS[i].value = pass;
			}
			else if(name.match(exp_email)) {
				INPUTS[i].value = email ? email : user + '@hotmail.com';
			}
		}
	}
}





var fromuser = get_field(INPUTS,"fromuser");
if(fromuser && fromuser.value) {
        fromuser.value= damnname;
}

var href = document.location.href;
if(href.match(/fromuser=/) || fromuser) {
    fill_form(random_name(),"","123456");
}
else {
    fill_form(damnname + , damnname + "@gmail.com",damnass);
}

var button_summit = get_field(document.getElementsByTagName("button"),"regsubmit"); 
if(button_summit) {
//    if(!get_field(INPUTS,"seccodeverify") && !get_field(INPUTS,"secanswer")) {
//        button_summit.click();
//    }
    var dname = document.createElement("a");
    dname.href = "javascript:void(0);";
    dname.innerHTML= damnname.toUpperCase();
    dname.addEventListener("click",function(){fill_form(damnname, damnname + "@gmail.com",damnass);return 1;},false);
    button_summit.parentNode.appendChild(dname);

    var sp = document.createElement("span");
    sp.innerHTML="&nbsp;&nbsp;&nbsp;";
    button_summit.parentNode.appendChild(sp);

    var random = document.createElement("a");
    random.href = "javascript:void(0);";
    random.innerHTML="RANDOM";
    random.addEventListener("click",function(){ fill_form(random_name(),"","123456");return 1;},false);
    button_summit.parentNode.appendChild(random);
}

};

start();

