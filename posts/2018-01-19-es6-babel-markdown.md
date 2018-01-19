---
layout: post
title: "ES6学习/Babel配置学习疑问/Markdown代码块高亮支持语法列表"
date: 2018-01-19
categories: markdown es6 ecmascript2015 babel vscode
---

1. 需求开发讨论中
1. 想起来有个离线API手册查询软件, 叫[Zeal](https://zealdocs.org/), 装上了. 然后发现实际上有写文档的体验并不好- -. 查一下jQuery, Sass之类还是可以的.
1. Stackoverflow上面的问题[how to make spaces or url inside a code span with markdown syntax](https://stackoverflow.com/questions/48313066/how-to-make-spaces-or-url-inside-a-code-span-with-markdown-syntax)有了两个消息通知, 一个是居然有个人改了我的问题, 帮我修正语法错误, Stackoverflow上居然还有这种操作, 看了下改我问题的人的介绍, 看来是个完美主义者. 另外他回复提到了**零宽度空格**, 不过对我这个问题似乎没啥帮助.
1. 阅读[ECMAScript 6 入门](http://es6.ruanyifeng.com/)
1. 发现另一个专门用来格式化JavaScript/TypeScript/CSS的插件[**Prettier - Code formatter**](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode), 至少在js格式化方面要比之前我用的[Beautify](https://marketplace.visualstudio.com/items?itemName=HookyQR.beautify)好一些(Beautify插件提供的设置参数我尚未找到可能优化的地方). 例如这段代码, 原始代码如下
    ```javascript
    function foo({x,y=5}) {
        console.log(x,y);
    }
    ```
    Beautify格式化后:
    ```javascript
    function foo2({
        x,
        y = 5
    }) {
        console.log(x, y);
    }
    ```
    Prettier格式化后:
    ```javascript
    function foo2({ x, y = 5 }) {
        console.log(x, y);
    }
    ```
    关于SCSS/CSS格式化对比, 经过简单测试基本一致, 当然Prettier不足在于HTML格式化, 不过其实Beautify对HTML格式化效果个人感觉也不是很好, **因此最终决定采用Prettier**.
    Prettier默认会将JavaScript的引号转换为双引号, 如果需要修改为单引号请更改配置
    ```javascript
    "prettier.singleQuote": true,
    ```
    > 其实正是因为学习ES6上面的示例代码, 在Beautify处理后很不合理我才去探索其他插件的.
1. 学习ES6过程中遇到一个奇怪的编译现象, 按照目前了解的情况, babel的配置文件.babelrc, 可以[官方简单配置](https://babeljs.io/docs/plugins/preset-env/#usage)如下:
    ```javascript
    //babelrc-1
    {
        "presets": ["env"]
    }
    ```
    这样基本满足大部分需求了.

    我在进行学习ES6的[let命令基本用法末尾处](http://es6.ruanyifeng.com/#docs/let#%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95)测试过程中发现了一个奇怪的编译结果. 比如这段代码
    ```javascript
    //code-1
    for (let k = 0; k < 3; k++) {
        let k = 'abc';
        console.log(k);
    }
    ```
    输出:
    ```console
    abc
    ```
    仅执行了一次循环, 并非3次, 假设我改成
    ```javascript
    //code-2
    for (let i = 0; i < 3; i++) {
        console.log(i);
        let i = 'abc';
        console.log(i);
    }
    ```
    输出:
    ```console
    0
    abc
    ```
    显然, 变量`i`被"共享"使用了, 并没有如期在不同作用域下互不影响.

    再来看一段这样的
    ```javascript
    //code-3
    let tmp = 123;
    if (true) {
        console.log(tmp);
        tmp = 'temp';
        // let tmp = 'temp';
        console.log(tmp);
    }
    console.log(tmp);
    ```
    输出:
    ```console
    123
    temp
    temp
    ```
    这个很OK

    但如果这样
    ```javascript
    //code-3
    let tmp = 123;
    if (true) {
        console.log(tmp);
        // tmp = 'temp';
        let tmp = 'temp';
        console.log(tmp);
    }
    console.log(tmp);
    ```
    输出:
    ```console
    undefined
    temp
    123
    ```
    这个则应该是变量提升造成的吧, 毕竟本来就一个在外面一个在里面, 最后一个输出证明了在外面他还是123.

    可是我现在为什么和阮老师的结果不一样呢, 想了半天, 也没想出来, 要不试试node环境下跑一下, 于是开启终端, 进入node, 执行`code-1`结果是
    ```console
    abc
    abc
    abc
    ```
    node环境下达到预期. 但是为什么我babel编译的结果不同, 在痛苦中挣扎的我, 反复修改代码测试, 突然灵光一闪, 莫非是babel配置问题?
    于是修改.babelrc如下
    ```javascript
    //babelrc-2
    {
        "presets": [
            ["env", {
                "targets": {
                    "node": "current"
                }
            }]
        ]
    }
    ```
    再次编译, 终于OK了. 此时又引出来一个问题, 为什么需要这样配置. `env`默认设置不行吗? 官方是这样说的:
    > Without any configuration options, babel-preset-env behaves exactly the same as babel-preset-latest (or babel-preset-es2015, babel-preset-es2016, and babel-preset-es2017 together).
    >
    > 如果不配置选项的话, `env`的处理方式正好和latest(或者es2015, es2016, es2017的集合)一样

    好吧, 先不管了, 我就把babel配置按照以当前node环境进行编译吧, 但是噩梦诞生了...

    再次以新的配置`babelrc-2`编译后, `Uncaught ReferenceError`到处都是. 代码`code-2`, 输出面板提示错误
    ```console
    Error: Uncaught ReferenceError: i is not defined
    ```
    代码`code-3`, 输出面板提示错误
    ```console
    Error: Uncaught ReferenceError: tmp is not defined
    ```
    这个并不属于重复声明, 那么报错是否是因为`i`不在同一个区块(因为node环境下`code-1`输出3次abc, 已经证明i互不干扰), 所以需要重新定义才可以使用? 而`code-3`是暂时性死区导致的?

    即便我的想法是正确的, 但是依然有个问题就是我之前说的, 到底这个`.babelrc`配置怎么写呢? 当然可以根据需求来调整, 但是不同的配置, 不同的浏览器对es6代码解释不同, 可能会造成一些困扰和BUG, 这种问题该怎么处理呢? 不知道是不是我已经陷入误区了. 因此将这个问题暂时性记录下来, 希望在未来的学习中, 得到满意的答案~

1. 找到了Markdown语法中的code block所支持的syntax highlight语言列表, 太长了本来不想全写出来, 又怕原文[Syntax highlighting in markdown](https://support.codebasehq.com/articles/tips-tricks/syntax-highlighting-in-markdown)哪天没了- -, 所以放在本篇末尾, 手动记录一下:
    * Cucumber ('\*.feature')
    * abap ('\*.abap')
    * ada ('\*.adb', '\*.ads', '\*.ada')
    * ahk ('\*.ahk', '\*.ahkl')
    * apacheconf ('.htaccess', 'apache.conf', 'apache2.conf')
    * applescript ('\*.applescript')
    * as ('\*.as')
    * as3 ('\*.as')
    * asy ('\*.asy')
    * bash ('\*.sh', '\*.ksh', '\*.bash', '\*.ebuild', '\*.eclass')
    * bat ('\*.bat', '\*.cmd')
    * befunge ('\*.befunge')
    * blitzmax ('\*.bmx')
    * boo ('\*.boo')
    * brainfuck ('\*.bf', '\*.b')
    * c ('\*.c', '\*.h')
    * cfm ('\*.cfm', '\*.cfml', '\*.cfc')
    * cheetah ('\*.tmpl', '\*.spt')
    * cl ('\*.cl', '\*.lisp', '\*.el')
    * clojure ('\*.clj', '\*.cljs')
    * cmake ('\*.cmake', 'CMakeLists.txt')
    * coffeescript ('\*.coffee')
    * console ('\*.sh-session')
    * control ('control')
    * cpp ('\*.cpp', '\*.hpp', '\*.c++', '\*.h++', '\*.cc', '\*.hh', '\*.cxx', '\*.hxx', '\*.pde')
    * csharp ('\*.cs')
    * css ('\*.css')
    * cython ('\*.pyx', '\*.pxd', '\*.pxi')
    * d ('\*.d', '\*.di')
    * delphi ('\*.pas')
    * diff ('\*.diff', '\*.patch')
    * dpatch ('\*.dpatch', '\*.darcspatch')
    * duel ('\*.duel', '\*.jbst')
    * dylan ('\*.dylan', '\*.dyl')
    * erb ('\*.erb')
    * erl ('\*.erl-sh')
    * erlang ('\*.erl', '\*.hrl')
    * evoque ('\*.evoque')
    * factor ('\*.factor')
    * felix ('\*.flx', '\*.flxh')
    * fortran ('\*.f', '\*.f90')
    * gas ('\*.s', '\*.S')
    * genshi ('\*.kid')
    * glsl ('\*.vert', '\*.frag', '\*.geo')
    * gnuplot ('\*.plot', '\*.plt')
    * go ('\*.go')
    * groff ('\*.(1234567)', '\*.man')
    * haml ('\*.haml')
    * haskell ('\*.hs')
    * html ('\*.html', '\*.htm', '\*.xhtml', '\*.xslt')
    * hx ('\*.hx')
    * hybris ('\*.hy', '\*.hyb')
    * ini ('\*.ini', '\*.cfg')
    * io ('\*.io')
    * ioke ('\*.ik')
    * irc ('\*.weechatlog')
    * jade ('\*.jade')
    * java ('\*.java')
    * js ('\*.js')
    * jsp ('\*.jsp')
    * lhs ('\*.lhs')
    * llvm ('\*.ll')
    * logtalk ('\*.lgt')
    * lua ('\*.lua', '\*.wlua')
    * make ('\*.mak', 'Makefile', 'makefile', 'Makefile.*', 'GNUmakefile')
    * mako ('\*.mao')
    * maql ('\*.maql')
    * mason ('\*.mhtml', '\*.mc', '\*.mi', 'autohandler', 'dhandler')
    * markdown ('\*.md')
    * modelica ('\*.mo')
    * modula2 ('\*.def', '\*.mod')
    * moocode ('\*.moo')
    * mupad ('\*.mu')
    * mxml ('\*.mxml')
    * myghty ('\*.myt', 'autodelegate')
    * nasm ('\*.asm', '\*.ASM')
    * newspeak ('\*.ns2')
    * objdump ('\*.objdump')
    * objectivec ('\*.m')
    * objectivej ('\*.j')
    * ocaml ('\*.ml', '\*.mli', '\*.mll', '\*.mly')
    * ooc ('\*.ooc')
    * perl ('\*.pl', '\*.pm')
    * php ('\*.php', '\*.php(345)')
    * postscript ('\*.ps', '\*.eps')
    * pot ('\*.pot', '\*.po')
    * pov ('\*.pov', '\*.inc')
    * prolog ('\*.prolog', '\*.pro', '\*.pl')
    * properties ('\*.properties')
    * protobuf ('\*.proto')
    * py3tb ('\*.py3tb')
    * pytb ('\*.pytb')
    * python ('\*.py', '\*.pyw', '\*.sc', 'SConstruct', 'SConscript', '\*.tac')
    * rb ('\*.rb', '\*.rbw', 'Rakefile', '\*.rake', '\*.gemspec', '\*.rbx', '\*.duby')
    * rconsole ('\*.Rout')
    * rebol ('\*.r', '\*.r3')
    * redcode ('\*.cw')
    * rhtml ('\*.rhtml')
    * rst ('\*.rst', '\*.rest')
    * sass ('\*.sass')
    * scala ('\*.scala')
    * scaml ('\*.scaml')
    * scheme ('\*.scm')
    * scss ('\*.scss')
    * smalltalk ('\*.st')
    * smarty ('\*.tpl')
    * sourceslist ('sources.list')
    * splus ('\*.S', '\*.R')
    * sql ('\*.sql')
    * sqlite3 ('\*.sqlite3-console')
    * squidconf ('squid.conf')
    * ssp ('\*.ssp')
    * tcl ('\*.tcl')
    * tcsh ('\*.tcsh', '\*.csh')
    * tex ('\*.tex', '\*.aux', '\*.toc')
    * text ('\*.txt')
    * v ('\*.v', '\*.sv')
    * vala ('\*.vala', '\*.vapi')
    * vbnet ('\*.vb', '\*.bas')
    * velocity ('\*.vm', '\*.fhtml')
    * vim ('\*.vim', '.vimrc')
    * xml ('\*.xml', '\*.xsl', '\*.rss', '\*.xslt', '\*.xsd', '\*.wsdl')
    * xquery ('\*.xqy', '\*.xquery')
    * xslt ('\*.xsl', '\*.xslt')
    * yaml ('\*.yaml', '\*.yml')

明天周末了, 希望不要忘了Daily~