// ==UserScript==
// @name         MyPlace Stacks Collector
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  URL收集器，通过配置网站URL和链接的正则表达式或XPath来自动收集链接
// @author       You
// @match        https://fs1.app/*
// @match        https://jable1.cc/*
// @match        https://91jable.sbs/*
// @match        https://*/playgaott/*
// @match        https://*/typegaott/*
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
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 配置规则 - 可以根据需要添加更多网站规则
    const CONFIG = {
        sites: [
            {
                name: "fs1.app",
                urlPattern: "https:\/\/(?:91jable.sbs|jable1.cc|fs1.app).*",
                linkSelectors: [
                    { type: "css", value: "h6.title a","after": function(href){return href.replace(/\/s0\//g,"\/")} }
                ]
            },
            {
                name: "playgaott",
                urlPattern: "\/(?:typegaott|playgaott)\/",
                linkSelectors: [
                    { type: "links", value: "\/playgaott\/"}
                ]
            },
          {
              name:"xhamster",
              urlPattern:"https:\/\/xhamster",
              wait:".video-page",
              linkSelectors: [
                {"type":"links",value:"https:\/\/xhamster[^\/]+\.[^\/]+\/videos\/"}
              ]
          },
          {
            name:"faphouse1",
            urlPattern:"https:\/\/faphouse",
            linkSelectors:[
              {"type":"css",value:"a.t-tv","after":function(href){return href.replace(/#.*$/g,"")}}
            ]
          },
          {
            name:"unths.k8s0u.top",
            urlPattern:"https:\/\/unths.k8s0u.top",
            linkSelectors:[
              {"type":"function",
               "value":function(){
                  var a = document.querySelectorAll("iframe")[0];
                  var b = a.contentDocument;
                  var links = [];
                  b.querySelectorAll("a").forEach(el => {
                    if(el.href && el.href.match("\/play\/")) {
                      links.push(el.href);
                    }
                  });
                  return [...new Set(links)]; // 去重
                }
              }
            ]
          },
          {
            name:"thriftyamos.com",
            urlPattern:"https:\/\/thriftyamos.com\/",
            linkSelectors:[{"type":"links","value":"\/video\.php\?"}],
          },
          {
            name:"91cg1.com",
            urlPattern:"https:\/\/(?:wiki.crxscjc.com|wiki.ynfhaill.cc|board.rdmuaxkva.cc)\/",
            linkSelectors:[{"type":"links","value":"\/archives\/\\d+\/$"}],
          },
          {
            name:'91cg1.com',
            urlPattern:"https:\/\/(?:board|wiki).*\/archives\/*",
            linkSelectors:[{"type":"links","value":"\/archives\/\\d+\/$"}],
          },
          {
            name:"91chiguatime.com",
            urlPattern:"https:\/\/(?:www.91chiguatime.com)\/",
            linkSelectors:[{"type":"links","value":"\/archives\/\\d+\/$"}],
          },

        ]
    };

    // 历史记录键名和最大数量
    const COLLECTED_HISTORY_KEY = 'collectedURLHistory';
    const MAX_HISTORY_SIZE = 1000;

    // 内存缓存历史记录，假设localStorage不会被外部改变
    let historyCache = null;

    // 初始化历史记录缓存
    function initHistoryCache() {
        if (historyCache === null) {
            try {
                const history = localStorage.getItem(COLLECTED_HISTORY_KEY);
                historyCache = history ? JSON.parse(history) : [];
            } catch (e) {
                historyCache = [];
            }
        }
    }

    // 开关状态键名
    const COLLECTOR_SWITCH_KEY = 'urlCollectorSwitch';

    // 获取开关状态
    function getCollectorSwitch() {
        try {
            return localStorage.getItem(COLLECTOR_SWITCH_KEY) !== 'false';
        } catch (e) {
            return true;
        }
    }

    // 设置开关状态
    function setCollectorSwitch(status) {
        try {
            localStorage.setItem(COLLECTOR_SWITCH_KEY, status.toString());
            console.log(`链接收集功能已${status ? '开启' : '关闭'}`);
        } catch (e) {
            console.error('无法保存开关状态:', e);
        }
    }

    // 获取历史记录（完全基于内存缓存）
    function getCollectedHistory() {
        initHistoryCache();
        return historyCache;
    }

    // 获取历史记录数量
    function getHistoryCount() {
        initHistoryCache();
        return Array.isArray(historyCache) ? historyCache.length : 0;
    }

    // 保存历史记录
    function saveCollectedHistory(history) {
        try {
            // 限制历史记录数量
            if (history.length > MAX_HISTORY_SIZE) {
                history = history.slice(-MAX_HISTORY_SIZE);
            }

            // 更新内存缓存
            historyCache = history;

            // 保存到localStorage
            localStorage.setItem(COLLECTED_HISTORY_KEY, JSON.stringify(history));
        } catch (e) {
            console.error('无法保存历史记录:', e);
        }
    }

    // 检查URL是否已收集过
    function isURLInHistory(url) {
        initHistoryCache();
        return Array.isArray(historyCache) && historyCache.includes(url);
    }

    // 添加URL到历史记录
    function addURLToHistory(url) {
        initHistoryCache();
        // 避免重复添加
        if (!historyCache.includes(url)) {
            historyCache.push(url);
            saveCollectedHistory(historyCache);
        }
    }

    // 批量添加URL到历史记录
    function addURLsToHistory(urls) {
        initHistoryCache();
        let hasNewUrls = false;

        // 过滤掉已存在的URL并添加新URL
        for (const url of urls) {
            if (!historyCache.includes(url)) {
                historyCache.push(url);
                hasNewUrls = true;
            }
        }

        // 只有在有新URL添加时才保存到localStorage
        if (hasNewUrls) {
            saveCollectedHistory(historyCache);
        }

        return hasNewUrls;
    }

    // 从历史记录中移除URL
    function removeURLFromHistory(url) {
        initHistoryCache();
        const index = historyCache.indexOf(url);
        if (index !== -1) {
            historyCache.splice(index, 1);
            saveCollectedHistory(historyCache);
            return true;
        }
        return false;
    }

    // 清空历史记录
    function clearCollectedHistory() {
        try {
            historyCache = [];
            localStorage.removeItem(COLLECTED_HISTORY_KEY);
            console.log('历史记录已清空');
        } catch (e) {
            console.error('清空历史记录失败:', e);
        }
    }

    // 等待URLStack加载完成
    function waitForURLStack() {
        return new Promise((resolve, reject) => {
            const checkInterval = setInterval(() => {
                if (typeof unsafeWindow.URLStack !== 'undefined') {
                    clearInterval(checkInterval);
                    resolve(unsafeWindow.URLStack);
                }
            }, 100);

            // 设置超时时间
            setTimeout(() => {
                clearInterval(checkInterval);
                reject(new Error('URLStack not found'));
            }, 5000);
        });
    }

    function waitForElement(css_selector) {
        return new Promise((resolve, reject) => {
            const checkInterval = setInterval(() => {
                const elements = document.querySelectorAll(css_selector);
                if (elements.length < 1) {
                    clearInterval(checkInterval);
                    resolve(elements.length);
                }
            }, 100);

            // 设置超时时间
            setTimeout(() => {
                clearInterval(checkInterval);
                reject(new Error('Element ' + css_selector + ' not found'));
            }, 5000);
        });
    }

    function getLinksByFunction(xfunc) {
      return xfunc();
    }

    // 根据XPath获取链接
    function getLinksByXPath(xpath) {
        const links = [];
        const result = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        for (let i = 0; i < result.snapshotLength; i++) {
            const node = result.snapshotItem(i);
            const url = node.nodeType === Node.ATTRIBUTE_NODE ? node.value : node.href;
            if (url) {
                links.push(url);
            }
        }
        return links;
    }

    // 根据CSS选择器获取链接
    function getLinksByCSSSelector(selector) {
        const links = [];
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            if (el.href) {
                links.push(el.href);
            }
        });
        return links;
    }

    // 根据正则表达式提取链接
    function getLinksByRegex(pattern) {
        const links = [];
        const regex = new RegExp(pattern, 'gi');
        const htmlContent = document.documentElement.outerHTML;
        let match;
        while ((match = regex.exec(htmlContent)) !== null) {
            links.push(match[0]);
        }
        return [...new Set(links)]; // 去重
    }

  function filterLinksByRegex(pattern) {
        const links = [];
        const regex = new RegExp(pattern, 'gi');
        const a = document.querySelectorAll('a');
        a.forEach(el => {
          if(el.href && el.href.match(regex)) {
            links.push(el.href);
          }
        });
        return [...new Set(links)]; // 去重
  }

    // 检查并自动管理开关状态
    async function autoManageSwitch() {
        try {
            const urlStack = await waitForURLStack();
            const isFull = urlStack.isFull();
            const currentStatus = getCollectorSwitch();
            var count = urlStack.count();
            // 如果URLStack已满且收集功能仍开启，则自动关闭
            if (isFull && currentStatus) {
                setCollectorSwitch(false);
                console.log(`URLStack已满(${count}/${urlStack.getMaxSize()})，自动关闭链接收集功能`);
                return false;
            }
            // 如果URLStack未满且收集功能已关闭，则自动开启
            else if (!isFull && !currentStatus && urlStack.count()<100) {
                setCollectorSwitch(true);
                console.log(`URLStack未满(${count}/${urlStack.getMaxSize()})，自动开启链接收集功能`);
                return true;
            }

            // 状态未改变
            return currentStatus && !isFull;
        } catch (error) {
            console.error('检查URLStack状态失败:', error.message);
            // 出错时保持当前开关状态
            return getCollectorSwitch();
        }
    }

    // 根据配置收集链接
    function collectLinksByConfig() {
        const currentURL = window.location.href;

        // 查找匹配的配置
        const matchingSite = CONFIG.sites.find(site =>
            new RegExp(site.urlPattern).test(currentURL)
        );

        if (!matchingSite) {
            console.log('未找到匹配的网站配置');
            return [];
        }

        console.log(`匹配到网站配置: ${matchingSite.name}`);

        const collectedLinks = [];

        // 根据配置中的选择器收集链接
        matchingSite.linkSelectors.forEach(selector => {
            try {
                /*
                if(selector.wait) {
                  await waitForElement(selector.wait);
                }
                */
                let links = [];
                switch (selector.type) {
                    case 'xpath':
                        links = getLinksByXPath(selector.value);
                        break;
                    case 'css':
                        links = getLinksByCSSSelector(selector.value);
                        break;
                    case 'regex':
                        links = getLinksByRegex(selector.value);
                        break;
                  case 'links' :
                        links = filterLinksByRegex(selector.value);
                        break;
                  case 'function' :
                        links = getLinksByFunction(selector.value);
                        break;
                    default:
                        console.warn(`不支持的选择器类型: ${selector.type}`);
                }

                // 过滤已收集过的链接
                if(selector.after) {
                  links = links.map(selector.after);
                }
                links = links.filter(link => !isURLInHistory(link));
                collectedLinks.push(...links);
            } catch (error) {
                console.error(`使用选择器 ${selector.type}:${selector.value} 时出错:`, error);
            }
        });

        // 去重
        const uniqueLinks = [...new Set(collectedLinks)];

        // 批量添加到历史记录
        if (uniqueLinks.length > 0) {
            addURLsToHistory(uniqueLinks);
        }

        return uniqueLinks;
    }

    // 收集当前页面配置的链接并添加到URLStack
    async function collectConfiguredLinks(force_mode) {
        // 自动管理开关状态
        if(!force_mode) {
          const shouldCollect = await autoManageSwitch();
          if (!shouldCollect) {
              console.log('链接收集功能已关闭或URLStack已满，跳过收集');
              return [];
          }
        }

        try {
            const urlStack = await waitForURLStack();
            const links = collectLinksByConfig();

            if(links.length > 0) {
              console.log(`找到${links.length}个URL。`)
            }

            const newUrls = links;


            if (newUrls.length === 0) {
                console.log('未找到任何新链接');
                return [];
            }
            var result = [];
            for(var i=0;i<newUrls.length;i++) {
              const currentURL = newUrls[i];
              const r = urlStack.add(currentURL);
              if(r.code == 0) {
              // 添加到历史记录
                addURLToHistory(currentURL);
                result.push(currentURL);
              }
              else if(r.code == -2) {
                  console.log('URLStack已满，自动关闭链接收集功能');
                  setCollectorSwitch(false);
                  break;
              }
              else {
                console.log('收集URL失败:', r.message);
              }
            }
            if(result.length>0) {
              console.log(`成功收集 ${results.length} 个链接`);
              console.log(`URLStack 现在有${urlStack.count()} 个链接`);
            }
            return results;
        } catch (error) {
            console.error('收集链接失败:', error.message);
            return [];
        }
    }

    // 收集当前页面URL
    async function collectCurrentPage() {
        // 自动管理开关状态
        const shouldCollect = await autoManageSwitch();
        if (!shouldCollect) {
            try {
                const urlStack = await waitForURLStack();
                console.log(`链接收集功能已关闭或URLStack已满，URLStack当前有${urlStack.count()}个链接`);
            } catch (error) {
                console.log('链接收集功能已关闭或URLStack已满');
            }
            return -1;
        }


            const urlStack = await waitForURLStack();
            const currentURL = window.location.href;

            // 检查当前URL是否已收集过
            if (isURLInHistory(currentURL)) {
                console.log(`页面URL已收集过，跳过: ${currentURL}`);
                return -1;
            }

            const r = urlStack.add(currentURL);
            if(r.code == 0) {
            // 添加到历史记录
              addURLToHistory(currentURL);
              console.log(`已收集页面URL: ${currentURL}: ${r.message}`);
            }
            else if(r.code == -2) {
                console.log('URLStack已满，自动关闭链接收集功能');
                setCollectorSwitch(false);
            }
            else {
              console.log('收集URL失败:', r.message);
            }
            return r;

    }


    // 自动收集函数
    async function autoCollect(force_mode) {
        // 自动管理开关状态
        if(!force_mode) {
          const shouldCollect = await autoManageSwitch();
          if (!shouldCollect) {
              try {
                  const urlStack = await waitForURLStack();
                  console.log(`链接收集功能已关闭或URLStack已满，URLStack当前有${urlStack.count()}个链接`);
              } catch (error) {
                  console.log('链接收集功能已关闭或URLStack已满');
              }
              return;
          }
        }
        // 等待页面加载完成
        if (document.readyState === 'loading') {
            await new Promise(resolve => {
                document.addEventListener('DOMContentLoaded', resolve);
            });
        }

        // 给页面一些时间完全渲染
        await new Promise(resolve => setTimeout(resolve, 3000));

        // 自动收集链接
        await collectConfiguredLinks(force_mode);

      try {
        const urlStack = await waitForURLStack();
        urlStack.save();
      }
      catch (error) {
                console.log('链接收集功能已关闭或URLStack已满');
      }
    }

    async function init_ui() {
      try {
         waitForURLStack().then(urlStack => {
          urlStack.addButton("Collect",function(){return autoCollect(1);})
         })
      }
      catch (error) {
                console.log('Error NO URLStack');
      }
    }
    // 将收集器功能暴露到全局作用域
    unsafeWindow.URLCollector = {
        collectCurrentPage: collectCurrentPage,
        collectConfiguredLinks: collectConfiguredLinks,
        // 添加开关控制方法
        getSwitch: getCollectorSwitch,
        setSwitch: setCollectorSwitch,
        toggleSwitch: function() {
            const currentStatus = getCollectorSwitch();
            setCollectorSwitch(!currentStatus);
            return !currentStatus;
        },
        // 添加历史记录相关方法
        getHistory: getCollectedHistory,
        getHistoryCount: getHistoryCount,
        isInHistory: isURLInHistory,
        addToHistory: addURLToHistory,
        addUrlsToHistory: addURLsToHistory,
        removeFromHistory: removeURLFromHistory,
        clearHistory: clearCollectedHistory,
        getMaxHistorySize: function() {
            return MAX_HISTORY_SIZE;
        },
        autoCollect:autoCollect,
    };

    console.log('URLCollector 已加载，将自动收集匹配的链接');
    // 显示初始状态
    if (!getCollectorSwitch()) {
        try {
            waitForURLStack().then(urlStack => {
                console.log(`链接收集功能已关闭，URLStack当前有${urlStack.count()}个链接`);
            });
        } catch (error) {
            console.log('链接收集功能已关闭');
        }
    }


    // 页面加载完成后自动开始收集
    autoCollect();
    init_ui();

})();