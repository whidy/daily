---
layout: post
title: "提高网站可访问性的十个优化/Markdown语法研究/SSH/"
date: 2018-01-18
categories: website markdown ssh es6
---

1. 一早, SB就跟我说那个panBaidu不能用了. 查了下果然呗百度封了. 顺便发现一个不错的[软件收藏与分享站](http://www.shaoit.com/)
1. 阅读[Small Tweaks That Can Make a Huge Impact on Your Website’s Accessibility(对网站的可访问性带来巨大影响的几个小优化)](https://css-tricks.com/small-tweaks-can-make-huge-impact-websites-accessibility/)
    1. 文中说明了语义化的重要性, 也推荐了一些[HTML5的学习网站](http://html5doctor.com/article-archive/)
    1. 页面只用一个`main`标签, 并给他一个ID
    1. 请尽量使用原生定义的功能标签, 比如按钮就用`button`, 虽然要重置样式, 比直接使用`div`或者`a`看起来麻烦, 但是它可以有更多的原生功能, 例如自带键盘监听事件. 例如你或许可以通过`tab`键, 焦点在这个按钮上, 并敲打`enter`的时候, 就能触发事件了, 这个是其他元素做不到的哦~ 当然我个人觉得这个仁者见仁智者见智了
    1. 页面中强烈推荐只有一个`h1`标签, 其他的`h*`标签请合理的使用对应的级别
    1. 这条就跟设计有关了, 请采用合理的色彩对比度
    1. 用一些特殊的标签辅助一些会使用特殊功能(屏幕阅读器[aria-hidden](https://developer.mozilla.org/zh-CN/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-label_attribute)="true"`, 那么屏幕阅读器就会忽略这个标签, 后面再增加一个几乎不可见却又没有隐藏的`.visually-hidden`元素, 并写入提示信息, 屏幕阅读器就会读出这段内容, 然后他们就能听到这个提示语了, 于是两者都很happy了. 不过就目前我的经验和观察来看, 国内很少会有网站注意到网页辅助功能的运用
    1. 这点也是跟设计有关, 主要是说谨慎字体选择, 字体大小等排版, 还有需要高亮突出显示的一些关键元素
    1. 增加一些键盘事件绑定, 对某些键盘侠来说更加高效快捷, 并且看起来很酷, 另外有个小tips, 关于如何改变使用键盘当前焦距的元素额外样式, 使其看起来更美观醒目, 比如
         ```css
         .your-element {
             background: red;
         }
         .your-element:focus {
             outline: none; /* Reset the default */
             box-shadow: 0 0 0 3px black; /* A very obvious state change */
         }
         ```
        老实说, 我觉得都不好看哈哈哈哈.
    1. 对于不同状态的功能标签, 例如按钮, 请不要仅使用轻度的色彩调整来告知用户, 他已经成功操作过了, 最好还要加一条提示, 这样对某些弱视用户来说, 这个开发人员简直是程序员界一股清泉
    1. 最后推荐了几个不错的网站和专家, 对于页面可读性的提高的干货提供更为全面的学习和了解

1. 针对markdown语法中, 区块元素的代码写法中, 无法增加多余空格的问题, 提问[how to make spaces or url inside a code span with markdown syntax](https://stackoverflow.com/questions/48313066/how-to-make-spaces-or-url-inside-a-code-span-with-markdown-syntax), 因为上一期有个关于[`(aﾠ==1 && a== 2 &&ﾠa==3)`](https://github.com/whidy/daily/blob/master/posts/2018-01-17-ftp-css-js.md)的文章. 需要这样的特殊写法. 目前只知道在markdown中使用html标签来处理, 例如`<code>&nbsp;a</code>`, 但这又是不规范的MD写法, 等待解决中.
1. 粗读[多页为王：webpack多页应用架构专题系列](http://array_huang.coding.me/webpack-book/), 文中以webpack1.x来进行了一些介绍. 或许有些思路和技巧将来用得上.
1. 有个80年程序员大佬在我博客留言推荐远程操作VPS的工具可以用[Bitvise SSH](https://www.bitvise.com/ssh-client), 于是下载下来体验下并修改了SSH端口号.
    ```bash
    vi /etc/ssh/sshd_config
    ```
    改掉Port 对应22为其他想要的, 然后重启服务
    ```bash
    service sshd restart
    ```
    关闭当前连接后修改连接配置为新端口重新连一次就好了.
    另外Bitvise SSH果然方便, 自带FTP, 同步文件效率提升许多, 而且不用每次输入密码了. 屌炸天( •̀ ω •́ )y
1. 阅读[ECMAScript 6 入门](http://es6.ruanyifeng.com/), 上次学到函数的拓展, 重新从此处学习.
