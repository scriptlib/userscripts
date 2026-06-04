// ==UserScript==
// @name        Copy page html source
// @namespace   MyPlace
// @description  一键复制当前页面的完整 HTML 源代码（包含所有 DOM，即 document.documentElement.outerHTML）
// @author       Hunyuan AI 助手
// @match        https://fs1.app/*
// @match        https://jable1.cc/*
// @match        https://91jable.sbs/*
// @match        https://29gaodt.com/*
// @match        https://faphouse1.com/*
// @grant        GM_notification
// @grant        GM_setClipboard
// ==/UserScript==


( function() {
var $myPlace = $myPlace || unsafeWindow.$myPlace || {};
unsafeWindow.$myPlace = $myPlace;
var XRZPanel = $myPlace.panel;
if(!XRZPanel.init()) return false;
    'use strict';

    // 复制页面 HTML 的核心函数
    function copyPageHTML() {
        const htmlContent = document.documentElement.outerHTML;
        // 方法 1：使用现代的 copy() 函数（在控制台中可用，但可能受跨域限制，不一定在 GM 脚本中总是有效）
        // 但在 GreaseMonkey/Tampermonkey 中通常可以工作
        if (typeof copy === 'function') {
            try {
                copy(htmlContent);
            } catch (e) {
                fallbackCopy(htmlContent);
                return;
            }
        } else {
            // 方法 2：使用 GM_setClipboard（推荐，更可靠，需要 @grant GM_setClipboard）
            fallbackCopy(htmlContent);
            return;
        }

        // 提示用户
        showNotification('✅ 页面 HTML 已复制到剪贴板！');
    }

    // 备用复制方法：使用 GM_setClipboard（需要脚本声明 @grant GM_setClipboard）
    function fallbackCopy(content) {
        if (typeof GM_setClipboard === 'function') {
            GM_setClipboard(content);
            showNotification('✅ 页面 HTML 已通过 GM_setClipboard 复制！');
        } else {
            // 终极备用：尝试使用传统的 execCommand（不推荐，可能失效）
            try {
                const textarea = document.createElement('textarea');
                textarea.value = content;
                textarea.style.position = 'absolute';
                textarea.style.left = '-9999px';
                document.body.appendChild(textarea);
                textarea.select();
                const successful = document.execCommand('copy');
                document.body.removeChild(textarea);
                if (successful) {
                    showNotification('✅ 页面 HTML 已复制（通过 execCommand）');
                } else {
                    showNotification('❌ 复制失败，请手动复制');
                }
            } catch (e) {
                showNotification('❌ 复制失败：' + e.message);
            }
        }
    }

    // 显示通知（使用 GM_notification 或 alert）
    function showNotification(message) {
        if (typeof GM_notification === 'function') {
            GM_notification({
                text: message,
                title: 'Copy Page HTML',
                timeout: 3000
            });
        } else {
            // 如果没有 GM_notification，使用简单的 alert（不太优雅，但能用）
            alert(message);
        }
    }

    XRZPanel.addAction("Copy Source",copyPageHTML)
})();

