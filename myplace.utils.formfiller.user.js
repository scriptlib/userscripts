// ==UserScript==
// @name           myplace.utils.formfiller
// @namespace      eotect@myplace
// @version			1.01
// @description    Sites registration helper
// @include        https://www.dropbox.com/register
// @include        https://*dropbox.com/referrals*
// @include        http://register.sdo.com/*
// @include        http://www.gokuai.com/regist_guide/*
// @include        http://email.163.com/*
// @include	     http://reg.email.163.com/mailregAll/reg0.jsp*
// @include        http://k.wps.cn/register/*
// @include        http://www.everbox.com/invite
// @include        *kanbox.com/invite/*
// @include        http://vdisk.me/?a=login*#register
// @include 		http://ikeepu.com/register/*
// @include	   *kuaipan.cn/register/*
// @include		http*://i.360.cn/reg*
// @include		http://pan.baidu.com/netdisk/beinvited*
// @include		http://i.xunlei.com/register.html
// @include 	https://reg.91.com/WebStaticPage/regforkx.html
// @include		http://reg.email.163.com/unireg/call.do?cmd=register.entrance*
// @grant 		none
// ==/UserScript==

if(!unsafeWindow) {
	unsafeWindow = window;
}


function start() {

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



var elements = new Array();
var inputs = document.getElementsByTagName("input");
var btns = document.getElementsByTagName("button");
var sels = document.getElementsByTagName('select');
var links = document.getElementsByTagName('a');
for(var i=0;i<inputs.length;i++) {elements.push(inputs[i]);}
for(var i=0;i<btns.length;i++) {elements.push(btns[i]);}
for(var i=0;i<sels.length;i++) {elements.push(sels[i]);}
for(var i=0;i<links.length;i++) {elements.push(links[i]);}

var SITES = new Array;


function register(info) {
	SITES.push(info);
}

function get_element(key,value) {
	for(var i=0;i<elements.length;i++) {
		var target = elements[i].getAttribute(key);
		if(target && target == value) {
			return elements[i];
		}
	}
	for(var i=0;i<elements.length;i++) {
		var target = elements[i].getAttribute(key);
		if(target && target.match(value)) {
			return elements[i];
		}
	}
}

function find_element(crit) {
	var t = get_element(crit.key,crit.value);
	return t;
}

function get_form(pageInfo) {
	var form = {};
	if(pageInfo.submit) {
		form.submit = find_element(pageInfo.submit);
	}
	if(pageInfo.username) {
		form.username = find_element(pageInfo.username);
	}
	if(pageInfo.email) {
		form.email = find_element(pageInfo.email);
	}
	if(pageInfo.password) {
		form.password = find_element(pageInfo.password);
	}
	if(pageInfo.repassword) {
		form.repassword = find_element(pageInfo.repassword);
	}
	form.info = pageInfo;
	return form;
}

function set_form(form,random) {
	var rname = random_name();
	var domain = form.info.emailDomain || '163.com';
	if(form.username) {
		if(form.username.value) {
		}
		else {
		}
		if(random) {
		}
		var nUsername = find_element(pageInfo.username);
		if(nUsername) {
			username = {element: nUsername, value : nUsername.value, random :random_name() };
		}
	}
	if(pageInfo.email) {
		var nEmail = find_element(pageInfo.email);
		
		if(nEmail) {
			email = {};
			email.element = nEmail;
			if(nEmail.value && (!username.value)) {
				email.value = nEmail.value;
				username.value = email.value.replace(/\@.*$/,'');
			}
			else if(username.value) {
				email.value = username.value + '@' + domain;
			}
			else {
				email.value = '';
			}
			if(username.random) {
				email.random = username.random + '@' + domain;
			}
			else {
				email.random = random_name() + '@' + domain;
			}
		}
	}
	if(pageInfo.password) {
		var nPassword = find_element(pageInfo.password);
		if(nPassword) {
			password = {};
			password.element = nPassword;
			password.value = pageInfo.password.text || fake_pass;
		}
	}
	if(pageInfo.repassword) {
		var nRepassword = find_element(pageInfo.repassword);
		if(nRepassword) {
			repassword = {};
			repassword.element = nRepassword;
			repassword.value = password.value || pageInfo.repassword.text || fake_pass;
		}
	}
	
	return {info:pageInfo,submit:submit,username:username,email:email,password:password,repassword:repassword};
}

function set_field(input,value) {
    if(input) {
        input.value = value;
    }
}
function get_field(name) {
    for(var i=0;i<elements.length;i++) {
        if(elements[i].id == name) {
            return elements[i];
        }
    }
}
function get_field_by_name(name) {
    for(var i=0;i<elements.length;i++) {
        if(elements[i].name == name) {
            return elements[i];
        }
    }
}
		


function set(key,name,value) {
	var elm = get_element(key,name);
	if(elm) {elm.value = value;}
	return elm;
}
function set_id(name,value) {
	return set('id',name,value);
}
function set_name(name,value) {
	return set('name',name,value);
}
function set_type(name,value) {
	return set('type',name,value);
}
function get(key,name) {
	var elm = get_element(key,name);
	return elm ? elm.value : null;
}
function check(key,name) {
    var elm = get_element(key,name);
    elm.checked = 1;
}
function fill (fname,lname,email,pass) {
    set('id',"fname",fname);
	set('id','lname',lname ? lname : fname);
    set('name',"password",pass);
    set('id',"email",email ? email : fname + "@163.com");
}

function copy_style(src,dst) {
	dst.setAttribute('class',src.getAttribute('class'));
	dst.setAttribute('style',src.getAttribute('style'));
	return dst;
}

var fake_pass='absfreedom';
var fill_form = document.createElement('input');
fill_form.type = 'button';
fill_form.style.width = '100px';
var random = fill_form.cloneNode(true);

fill_form.value = 'Fill Form';
fill_form.setAttribute('value','Auto Fill');
random.value = 'Random Fill';
random.setAttribute('value','Random Fill');

var button_submit;
var href = document.location.href;

if(href.match(/dropbox\.com/)) {
	button_submit = get_field("register-submit"); 
	if(button_submit) {
	       	fill_form.addEventListener("click",function() {
		        var email = get_field('email');
	        	if(email && email.value) {
		        	var lname = email.value;
			        lname = lname.replace(/^.+\@/,'');
			        fill(email.value,lname,email.value,fake_pass);
	        	}
			return 1;
		},false);   
		random.addEventListener("click",function(){ fill(random_name(),random_name(),"",fake_pass);return 1;},false);  
	}
}
else if(href.match(/sdo\.com/)) {
	button_submit = get_field("chkAgreement");
	if(button_submit) {
		button_submit.value = 'checked';
		fill_form.addEventListener("click",function() {set('id','password',fake_pass);return 1;},false);
		random.addEventListener('click',function() {
			set('id','username',random_name());
			set('id','UserEmailId',random_name() + '@163.com');
			set('id','password',fake_pass);
			return 1;
			},
			false
		);
	}       
}
else if(href.match(/reg\.email\.163\.com/)) {
	button_submit =  get_element('id','mainRegA');
	if(button_submit) {
		function setvalue() {
		       // set_name('gender',1);
                set_id('mainPwdIpt',fake_pass);
                set_id('mainCfmPwdIpt',fake_pass);

				//set_id('password',fake_pass);
                //set_id('passConfim',fake_pass);
				//set_id('passConfim1',fake_pass);				
                //set_id('passwordconfirm',fake_pass);
                
                var sel = get_element('id','secproblem');
				if(sel) {
					sel.options[11].selected = 1;
					set_id('cusproblem','Name of not-a-human-name?');
					set_id('secanswer','Eotect Nahn');
					set_id('year','1981');
					set_id('month','12');
					set_id('day','05');
				}
		};
		fill_form.addEventListener("click",function() {
				setvalue();
				return 1;
			},
			false
		);
        random.addEventListener("click",function() {
                var username = random_name();
				set_id('nameIpt',username);
                set_name('mainDomainSelect','@163.com');
                //set_name('username',username);
				setvalue();
				return 1;
			},
			false
		);	
	}
}
else if(href.match(/111email\.163\.com/)) {
	button_submit = get_element('type',/^submit$/);
	if(button_submit) {
		fill_form.addEventListener("click",function() {
				var username = get('id','txtUser');
				if(!username) {username = get('id','iptUser');}
				if(username.match(/^h.+/)) {
					set('id','txtPassword','shangshan');
					set('name','password','shangshan');
				}
				else {
					set('name','password',fake_pass);
					set('id','txtPassword',fake_pass);
				}
				return 1;
			},
			false
		);
		random.disabled = true;
	}
}

else if(href.match(/gokuai\.com/)) {
	button_submit = get_field("reg_btn");
	if(button_submit) {
		fill_form.addEventListener("click",function() {
			set('id','conpassword',fake_pass);
			set('id','password',fake_pass);
			return 1;	
		},
			false
		);
		random.addEventListener("click",function() {
			set('id','username',random_name());
			set('id','conpassword',fake_pass);
			set('id','password',fake_pass);
			return 1;	
		},
			false
		);				
	}
}
else if(href.match(/(k\.wps\.cn|kuaipan\.cn)\/account_register\//)) {
	button_submit = get_element('type','submit');
	if(button_submit) {
		fill_form.addEventListener("click",function() {
			set('id','pwd',fake_pass);
			set('id','re-pwd',fake_pass);
			return 1;	
		},
			false
		);
		random.addEventListener("click",function() {
            set('id','email',random_name() + '@163.com');
			set('id','pwd',fake_pass);
			set('id','re-pwd',fake_pass);
			return 1;	
		},
			false
		);				
	}
}
else if(href.match(/everbox\.com\/invite/)) {
    button_submit = get_element('type','submit');
	if(button_submit) {
        var elm = document.getElementById('invite_email');
		fill_form.addEventListener("click",function() {
            if(elm.value) {
                elm.value = elm.value + ";" + random_name() + "@163.com";
            }
            else {
                elm.value = random_name() + '@163.com';
            }
			return 1;	
		},
			false
		);
		random.addEventListener("click",function() {
            if(elm.value) {
                elm.value = elm.value + ";" + random_name() + "@163.com";
            }
            else {
                elm.value = random_name() + '@163.com';
            }
			return 1;	
		},
			false
		);				
	}
}
else if(href.match(/www\.kanbox\.com\/invite\//)) {
    button_submit = document.getElementById('key_regSumit');
    if(button_submit) {
        fill_form.addEventListener("click",function() {
            set_name('Pass',fake_pass);
            set_name('PassConfirm',fake_pass);
			return 1;	
		},
			false
		);
		random.addEventListener("click",function() {
            set_name('Email',random_name() + '@163.com');
            set_name('Pass',fake_pass);
            set_name('PassConfirm',fake_pass);
			return 1;	
		},
			false
		);				
	}
}
else if(href.match(/vdisk\.me\/\?a=login\&/)) {
    button_submit = get_element('name','register_submit');
    if(button_submit) {
        fill_form.addEventListener("click",function() {
            set_name('form_register_password',fake_pass);
            set_name('form_register_confirm',fake_pass);
			return 1;	
		},
			false
		);
		random.addEventListener("click",function() {
            set_name('form_register_email',random_name() + '@163.com');
            set_name('form_register_password',fake_pass);
            set_name('form_register_confirm',fake_pass);
			return 1;	
		},
			false
		);				
	}
}
else if(href.match(/ikeepu\.com\/register/)) {
	button_submit = get_element('type','submit');
	if(button_submit) {
		var uname = get_element('name','username');
		fill_form.addEventListener("click",function() {
			if(uname.value) {
				set_name('email',uname.value + '@163.com');
			}			
            set_name('password',fake_pass);
            set_name('repassword',fake_pass);
			return 1;	
		},
			false
		);
		random.addEventListener("click",function() {
			set_name('username',random_name());
			if(uname.value) {
				set_name('email',uname.value + '@163.com');
			}			
            set_name('password',fake_pass);
            set_name('repassword',fake_pass);
			return 1;	
		},
			false
		);		
	}
}
else if(href.match(/i\.360\.cn\/reg/)) {
	button_submit = get_element('id','regSubmitBtn');
	if(button_submit) {
		fill_form.addEventListener("click",function() {		
            set('id','password',fake_pass);
            set('id','rePassword',fake_pass);
			return 1;	
		},
			false
		);
		random.addEventListener("click",function() {
			set('id','loginEmail',random_name() + '@163.com');		
            set('id','password',fake_pass);
            set('id','rePassword',fake_pass);
			return 1;	
		},
			false
		);		
	}
}
else if(href.match(/http:\/\/pan\.baidu\.com\/netdisk\/beinvited/)) {
	button_submit = get_element('id','pass_reg_submit_0');
	if(button_submit) {
		var uname = get_element('id','pass_reg_username_0');
		fill_form.addEventListener("click",function() {
			if(uname.value) {
				set_id('pass_reg_email_0',uname.value + '@163.com');
			}			
            set_id('pass_reg_password_0',fake_pass);
            set_id('pass_reg_repassword_0',fake_pass);
			return 1;	
		},
			false
		);
		random.addEventListener("click",function() {
			set_id('pass_reg_username_0',random_name());
			if(uname.value) {
				set_id('pass_reg_email_0',uname.value + '@163.com');
			}			
            set_id('pass_reg_password_0',fake_pass);
            set_id('pass_reg_repassword_0',fake_pass);
			return 1;	
		},
			false
		);		
	}
}
else if(href.match(/https:\/\/reg\.91\.com\/WebStaticPage\/regforkx\.html/)) {
	button_submit = get_element('id','btnNext');
	if(button_submit) {
		fill_form.addEventListener('click',function(){
			set_id('txtPassword','qwertyu');
			set_id('txtConfirmPassword','qwertyu');
			set_id('txt_realname',unescape('%u5F6D%u6CE2'));
			set_id('txtIdCard','430681198602024024');
			set_id('txtTelphoneno','13800138000');
		},
		false);
		random.addEventListener('click',function(){
			var uname = random_name();
			set_id('txtUserNamePre',uname);
			set_id('txtUserName',uname);
			set_id('txtPassword','qwertyu');
			set_id('txtConfirmPassword','qwertyu');
			set_id('txt_realname',unescape('%u5F6D%u6CE2'));
			set_id('txtIdCard','430681198602024024');
			set_id('txtTelphoneno','13800138000');
		},
		false);
	}
}


register({
	url: 		'http:\/\/i.xunlei.com\/register.html',
	submit:		{ key:'id', value:'i_sm' },
	username:	{ key:'id', value:'i_nn' },
	email:		{ key:'id', value:'i_mp' },
	password:	{ key:'id', value:'i_pw' },
	repassword:	{ key:'id', value:'i_rp' },
});




if(!button_submit) {
	for(var i=0;i<SITES.length;i++) {
		var button_submit = find_element(SITES[i].submit);
		if(button_submit) {
			fill_form.addEventListener("click",function() {
				var form = get_form(SITES[i]);
				if(form.username && form.username.element) {
					form.username.element.value = form.username.value;
				}
				if(form.email && form.email.element) {
					form.email.element.value = form.email.value;
				}
				if(form.password && form.password.element) {
					form.password.element.value = form.password.value;
					form.repassword.element.value = form.password.value;
				}
				return 1;	
			},
				false
			);
			random.addEventListener("click",function() {
				var form = get_form(SITES[i]);
				if(form.username && form.username.element) {
					form.username.element.value = form.username.random;
				}
				if(form.email && form.email.element) {
					form.email.element.value = form.email.random;
				}
				if(form.password && form.password.element) {
					form.password.element.value = form.password.value;
					form.repassword.element.value = form.password.value;
				}
				return 1;	
			},
				false
			);
			break;
		}
	}
}

if(button_submit) {
	//copy_style(button_submit,fill_form);
	//copy_style(button_submit,random);
	button_submit.parentNode.appendChild(fill_form);
	button_submit.parentNode.appendChild(random);
}

};

start();


