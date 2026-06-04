// ==UserScript==
// @name         MyPlace Stacks
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  URL存储和检索工具，支持随机、上一个、下一个等方式获取URL
// @author       You
// @match        https://fs1.app/*
// @match        https://jable1.cc/*
// @match        https://91jable.sbs/*
// @match        https://29gaodt.com/*
// @match        https://xhamster*.*/*
// @match        https://faphouse1.com/*
// @match        https://unths.k8s0u.top/*
// @match        https://thriftyamos.com/*
// @match        https://wiki.ynfhaill.cc/*
// @match        https://wiki.crxscjc.com/*
// @match        https://wiki.*/archives/*
// @match        https://wiki.*/category/*
// @match        https://board.*/archives/*
// @match        https://board.*/category/*
// @match        https://board.rdmuaxkva.cc/*
// @match        https://www.91chiguatime.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_addValueChangeListener
// ==/UserScript==

(function() {

    // 设置最大堆栈大小
    const MAX_STACK_SIZE = 800;

    // 域名映射表，用于规范化域名存储键名
    const DOMAIN_MAPS = {
        'fs1':"fs1.app",
        'fs1.app': 'fs1.app',
        'jable1.cc': 'fs1.app',
        '91jable.sbs':'fs1.app',
        '29gaodt.com': '29gaodt.com',
        'xhamster45.desi':'xhamster',
        'xhamster44.desi':'xhamster',
        'wiki.ynfhaill.cc':'91cg1.com',
        'wiki.crxscjc.com':'91cg1.com',
        'board.rdmuaxkva.cc':'91cg1.com',
        'www.91chiguatime.com':'91chiguatime.com',
    };

    class URLStackManager {
        constructor(domain = null) {
            // 使用域名映射表规范化域名
            this.real_domain = domain
            this.domain = DOMAIN_MAPS[domain] ? DOMAIN_MAPS[domain] : domain;
            if(domain.match('^(?:board|wiki)\.')) {
              this.domain = '91cg1.com';
            }
            domain = this.domain
            this.storageKey = domain ? `urls_${domain}` : 'urls';
            this.indexKey = domain ? `currentIndex_${domain}` : 'currentIndex';
            this.urls = GM_getValue(this.storageKey, []);
            if(this.domain != this.real_domain){
              //alert(domain);
              for(var i=0;i<this.urls.length;i++) {
                this.urls[i] = this.urls[i].replace(this.domain,this.real_domain)
              }
              //alert(this.urls.length)
            }
            this.currentIndex = GM_getValue(this.indexKey, -1);
        }

        // 获取URL的域名
        getDomainFromURL(url) {
            try {
                const urlObj = new URL(url);
                return urlObj.hostname;
            } catch (_) {
                return null;
            }
        }

        // 添加URL到存储中
        addURL(url) {
            if (!this.isValidURL(url)) {
                return {code:-1,message:'Invalid URL format'};
            }

            // 检查URL是否已存在，避免重复添加
            if (!this.urls.includes(url)) {
                // 检查是否已达到最大容量
                if (this.urls.length >= MAX_STACK_SIZE) {
                    return {code:-2,message:`URL stack is full. Maximum capacity is ${MAX_STACK_SIZE} URLs.`};
                }

                this.urls.push(url);
                // 注意：现在不立即保存，改为批量保存以提高性能
                // GM_setValue(this.storageKey, this.urls);

                // 更新信息栏显示
                if (typeof unsafeWindow.URLStack !== 'undefined' && typeof unsafeWindow.URLStack.updateInfoBar === 'function') {
                    unsafeWindow.URLStack.updateInfoBar();
                }
            }
            return {code:0,message:'OK'}
            //return this.urls.length - 1; // 返回添加的索引
        }

        // 验证URL格式
        isValidURL(string) {
            try {
                new URL(string);
                return true;
            } catch (_) {
                return false;
            }
        }

        // 获取随机URL
        getRandomURL() {
            if (this.urls.length === 0) {
                return null;
            }

            const randomIndex = Math.floor(Math.random() * this.urls.length);
            this.currentIndex = randomIndex;
            // 注意：现在不立即保存索引，改为批量保存以提高性能
            // GM_setValue(this.indexKey, this.currentIndex);
            return this.urls[randomIndex];
        }

        // 获取下一个URL
        getNextURL() {
            if (this.urls.length === 0) {
                return null;
            }

            this.currentIndex = (this.currentIndex + 1) % this.urls.length;
            // 注意：现在不立即保存索引，改为批量保存以提高性能
            // GM_setValue(this.indexKey, this.currentIndex);
            return this.urls[this.currentIndex];
        }

        // 获取上一个URL
        getPreviousURL() {
            if (this.urls.length === 0) {
                return null;
            }

            this.currentIndex = (this.currentIndex - 1 + this.urls.length) % this.urls.length;
            // 注意：现在不立即保存索引，改为批量保存以提高性能
            // GM_setValue(this.indexKey, this.currentIndex);
            return this.urls[this.currentIndex];
        }

        // 根据索引获取URL
        getURLByIndex(index) {
            if (this.urls.length === 0 || index < 0 || index >= this.urls.length) {
                return null;
            }

            this.currentIndex = index;
            // 注意：现在不立即保存索引，改为批量保存以提高性能
            // GM_setValue(this.indexKey, this.currentIndex);
            return this.urls[index];
        }

        // 获取所有URL
        getAllURLs() {
            return [...this.urls]; // 返回副本以防止外部修改
        }

        // 获取当前URL
        getCurrentURL() {
            if (this.urls.length === 0 || this.currentIndex < 0) {
                return null;
            }
            return this.urls[this.currentIndex];
        }

        // 删除特定URL
        removeURL(url) {
            const index = this.urls.indexOf(url);
            if (index !== -1) {
                this.urls.splice(index, 1);
                // 如果删除的是当前或之前的项，需要调整当前索引
                if (index < this.currentIndex) {
                    this.currentIndex--;
                } else if (index === this.currentIndex) {
                    this.currentIndex = -1;
                } else if (this.currentIndex >= this.urls.length) {
                    this.currentIndex = this.urls.length - 1;
                }

                // 注意：现在不立即保存，改为批量保存以提高性能
                // GM_setValue(this.storageKey, this.urls);
                // GM_setValue(this.indexKey, this.currentIndex);

                // 更新信息栏
                if (typeof unsafeWindow.URLStack !== 'undefined' && typeof unsafeWindow.URLStack.updateInfoBar === 'function') {
                    unsafeWindow.URLStack.updateInfoBar();
                }

                return true;
            }
            return false;
        }

        // 清空所有URL
        clearAll() {
            this.urls = [];
            this.currentIndex = -1;
            // 注意：现在不立即保存，改为批量保存以提高性能
            // GM_setValue(this.storageKey, this.urls);
            // GM_setValue(this.indexKey, this.currentIndex);

            // 更新信息栏
            if (typeof unsafeWindow.URLStack !== 'undefined' && typeof unsafeWindow.URLStack.updateInfoBar === 'function') {
                unsafeWindow.URLStack.updateInfoBar();
            }
        }

        // 获取URL数量
        getCount() {
            return this.urls.length;
        }

        // 检查是否为空
        isEmpty() {
            return this.urls.length === 0;
        }

        // 检查是否已满
        isFull() {
            return this.urls.length >= MAX_STACK_SIZE;
        }

        // 获取最大容量
        getMaxSize() {
            return MAX_STACK_SIZE;
        }

        // 批量保存URL列表和当前索引到持久化存储
        save() {
            if(this.domain != this.real_domain){
              //alert(domain);
              var nurls = []
              for(var i=0;i<this.urls.length;i++) {
                nurls.push(this.urls[i].replace(this.real_domain,this.domain));
              }
              GM_setValue(this.storageKey, nurls);
            }
            else {
              GM_setValue(this.storageKey, this.urls);
            }
            GM_setValue(this.indexKey, this.currentIndex);
        }
    }

    // 获取当前页面的域名
    var currentDomain = window.location.hostname;

    // 创建当前域名的实例作为全局堆栈
    const urlStack = new URLStackManager(currentDomain);

    //currentDomain = urlStack.domain
    // 域名管理器
    const domainStacks = {};

    // 设置全局堆栈为当前域名堆栈
    domainStacks[currentDomain] = urlStack;

    // 获取特定域名的堆栈管理器
    function getDomainStack(domain) {
        if (!domainStacks[domain]) {
            domainStacks[domain] = new URLStackManager(domain);
        }
        return domainStacks[domain];
    }



    // 导航函数，支持向前、向后和随机导航
    function nav_stack(dir) {
      var url;
      if(dir <0) {
        url = urlStack.getPreviousURL();
      }
      else if(dir == 0) {
        url = urlStack.getRandomURL();
      }
      else {
        url = urlStack.getNextURL();
      }



      if(!url) {
        alert("Stack is empty");
      }
      else {
        urlStack.removeURL(url);
        urlStack.save();
        window.location = url;
      }
    }

    // 创建单行控件显示堆栈信息和导航
    function createStackInfoBar() {
        // 创建控件容器
        const infoBar = document.createElement('span');
        infoBar.id = 'url-stack-info-bar';
        infoBar.style.cssText = `
            #position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            font-family: Arial, sans-serif;
            font-size: 14px;
            padding: 5px 10px;
            z-index: 10000;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-sizing: border-box;
        `;

        // 创建左侧信息显示区域
        const infoSpan = document.createElement('span');
        infoSpan.id = 'stack-info-text';
        infoSpan.textContent = `Stack: ${urlStack.getCount()}/${urlStack.getMaxSize()}`;
        infoSpan.style.cursor = 'pointer';
        infoSpan.addEventListener('click', () => {
            alert(`Current Stack Info:\nCount: ${urlStack.getCount()}\nMax Size: ${urlStack.getMaxSize()}\nIs Full: ${urlStack.isFull()?'Yes':'No'}`);
        });

        // 创建右侧导航按钮区域
        const navDiv = document.createElement('span');
        navDiv.style.display = 'flex';
        navDiv.style.gap = '10px';

        // 上一个按钮
        const prevBtn = document.createElement('button');
        prevBtn.textContent = '← Prev';
        prevBtn.style.cssText = `
            background: #444;
            color: white;
            border: none;
            padding: 3px 8px;
            cursor: pointer;
            border-radius: 3px;
        `;
        prevBtn.addEventListener('click', () => nav_stack(-1));

        // 随机按钮
        const randomBtn = document.createElement('button');
        randomBtn.textContent = 'Rand';
        randomBtn.style.cssText = `
            background: #444;
            color: white;
            border: none;
            padding: 3px 8px;
            cursor: pointer;
            border-radius: 3px;
        `;
        randomBtn.addEventListener('click', () => nav_stack(0));

        // 下一个按钮
        const nextBtn = document.createElement('button');
        nextBtn.textContent = 'Next →';
        nextBtn.style.cssText = `
            background: #444;
            color: white;
            border: none;
            padding: 3px 8px;
            cursor: pointer;
            border-radius: 3px;
        `;
        nextBtn.addEventListener('click', () => nav_stack(1));

              // 下一个按钮
        const copyBtn = document.createElement('button');
        copyBtn.textContent = 'Copy';
        copyBtn.style.cssText = `
            background: #444;
            color: white;
            border: none;
            padding: 3px 8px;
            cursor: pointer;
            border-radius: 3px;
        `;
        copyBtn.addEventListener('click', function() {
            navigator.clipboard.writeText(document.location.href);
            return 1;
        });

        // 组装控件
        navDiv.appendChild(prevBtn);
        navDiv.appendChild(randomBtn);
        navDiv.appendChild(copyBtn);
        navDiv.appendChild(nextBtn);

        infoBar.appendChild(infoSpan);
        infoBar.appendChild(navDiv);

        // 添加到页面
        //document.body.appendChild(infoBar);

        // 更新计数的函数

        return infoBar;
    }
    const infoBar = createStackInfoBar()

    function addButton(text,func) {
      const copyBtn = document.createElement('button');
        copyBtn.textContent = text;
        copyBtn.style.cssText = `
            background: #444;
            color: white;
            border: none;
            padding: 3px 8px;
            cursor: pointer;
            border-radius: 3px;
        `;
        copyBtn.addEventListener('click', func);
        infoBar.appendChild(copyBtn)
    }

   // 将API暴露到全局作用域
    unsafeWindow.URLStack = {
        addButton:(text,func) => addButton(text,func),
        add: (url) => urlStack.addURL(url),
        addLinks: (links) => urlStack.addURLArray(links),
        getRandom: () => urlStack.getRandomURL(),
        getNext: () => urlStack.getNextURL(),
        getPrevious: () => urlStack.getPreviousURL(),
        getByIndex: (index) => urlStack.getURLByIndex(index),
        getAll: () => urlStack.getAllURLs(),
        getCurrent: () => urlStack.getCurrentURL(),
        remove: (url) => urlStack.removeURL(url),
        clear: () => urlStack.clearAll(),
        count: () => urlStack.getCount(),
        isEmpty: () => urlStack.isEmpty(),
        isFull: () => urlStack.isFull(),
        getMaxSize: () => urlStack.getMaxSize(),
        // 新增保存方法，用于批量保存更改
        save: () => urlStack.save(),

        // 域名管理相关方法
        getDomainStack: (domain) => getDomainStack(domain),
        addForDomain: function(url) {
            const domain = urlStack.getDomainFromURL(url);
            if (domain) {
                return getDomainStack(domain).addURL(url);
            } else {
                throw new Error('Invalid URL, cannot extract domain');
            }
        },
        getDomainURLs: function(domain) {
            return getDomainStack(domain).getAllURLs();
        },
        getDomainCount: function(domain) {
            return getDomainStack(domain).getCount();
        },
        clearDomain: function(domain) {
            return getDomainStack(domain).clearAll();
        },

        // 当前域名相关方法
        getCurrentDomain: () => currentDomain,
        updateInfoBar: function() {
            const infoText = document.getElementById('stack-info-text');
            if (infoText) {
                infoText.textContent = `Stack: ${urlStack.getCount()}/${urlStack.getMaxSize()}`;
            }
        },
    };

    var $myPlace = $myPlace || unsafeWindow.$myPlace || {};
    unsafeWindow.$myPlace = $myPlace;
    var XRZPanel = $myPlace.panel;
    if(!XRZPanel.init()) return false;

    XRZPanel.add(infoBar);

    // 创建新的单行控件


    console.log(`URLStack for domain ${currentDomain} 已加载，可以通过 unsafeWindow.URLStack 访问`);
})();