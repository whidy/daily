+++
title = "Visual Studio Code使用中CPU占用率异常暴增过高原因"
date = "2018-02-13"
author = "whidy"
+++

今天要说的是一个困扰我好几个月的问题，Visual Studio Code（下文简称VSCode）在使用中突然增高，风扇开始狂转，温度骤增，影响心情的故障原因。

其实，无论是Windows还是OSX，很多人可能或多或少都遇到过VSCode突然就不好使了，我就遇到过好多次疑难杂症，折腾很久才弄出来，比如下面三点：

1. tab键突然就不好使了，卡顿很久或者压根无法缩进，并且sidebar的git那块功能彻底失效！
1. 写Markdown文档的时候，tab键的缩进只能向右，不能收回。。。这真是奇葩。
1. 使用中莫名其妙的风扇就响了起来，看看进程和温度，CPU满载执行，完全不知道怎么回事，这也是本次要专门提到的问题。

## 系统使用环境及VSCode状态检测

我使用的是黑苹果，当然这个与CPU占用率增高并无关系，通过`code --status`查看一些基本信息如下：

```
P750TM:~ whidy$ code --status

Version:          Code 1.30.2 (61122f88f0bf01e2ac16bdb9e1bc4571755f5bd8, 2019-01-07T22:48:31.260Z)
OS Version:       Darwin x64 17.7.0
CPUs:             Intel(R) Core(TM) i5-8600K CPU @ 3.60GHz (6 x 3600)
Memory (System):  16.00GB (5.22GB free)
Load (avg):       2, 2, 2
VM:               0%
Screen Reader:    no
Process Argv:     --inspect-extensions=9993
GPU Status:       2d_canvas:                    enabled
                  checker_imaging:              disabled_off
                  flash_3d:                     enabled
                  flash_stage3d:                enabled
                  flash_stage3d_baseline:       enabled
                  gpu_compositing:              enabled
                  multiple_raster_threads:      enabled_on
                  native_gpu_memory_buffers:    enabled
                  rasterization:                unavailable_software
                  video_decode:                 enabled
                  video_encode:                 enabled
                  webgl:                        enabled
                  webgl2:                       enabled
CPU %	Mem MB	   PID	Process
    0	    98	  1775	code main
    0	    49	  1776	   gpu-process
    0	   229	  1777	   window (settings.json — mpa-stat-sdk)
    0	     0	  1780	     /bin/bash -l
    0	   115	  1783	     extensionHost
    0	    82	  1787	       /Applications/Visual Studio Code.app/Contents/Frameworks/Code Helper.app/Contents/MacOS/Code Helper --nolazy --inspect=10785 /Applications/Visual Studio Code.app/Contents/Resources/app/extensions/json-language-features/server/dist/jsonServerMain --node-ipc --clientProcessId=1783
    0	    49	  1784	     watcherService
    0	    49	  1789	     searchService
    0	    33	  1785	   utility
    0	    82	  1817	   shared-process
    0	   311	  1830	   window (ald-stat.js — one-plus-sport)
    0	    49	  1831	     watcherService
    0	    98	  1832	     extensionHost
    4	    66	  1870	       electron_node eslintServer.js 
    0	   131	  1871	       electron_node tsserver.js 
    0	    66	  1879	         electron_node typingsInstaller.js typesMap.js 
    0	    49	  1835	     searchService
Workspace Stats: 
|  Window (ald-stat.js — one-plus-sport)
|  Window (settings.json — mpa-stat-sdk)
|    Folder (one-plus-sport): 273 files
|      File types: js(75) json(58) wxss(57) wxml(56) png(21) md(2)
|                  gitignore(1) xlsx(1) jpg(1) zip(1)
|      Conf files:
|    Folder (mpa-stat-sdk): 21 files
|      File types: js(13) md(3) json(2) zip(2) gitignore(1)
|      Conf files: gulp.js(1) package.json(1)
```

## 故障现象

先来看看正常情况下和非正常情况的运行情况对比图：

![正常情况下的截图](/images/2019-01-28-1.png)

上图为正常情况下的截图


![异常情况下的截图](/images/2019-01-28-2.png)

上图为异常情况下的截图

这个问题真的令我很苦恼，我这两张截图期间绝对没有做任何可能会产生高计算需求的工作，但是正常的操作怎么会出现这种情况呢。

## 故障分析及解决

于是进行了大量的搜索，百度就不用看了，屎一样的结果：

![渣渣百度搜索结果](/images/2019-01-28-3.png)

前5篇内容完全一致，结论：`"search.followSymlinks":true`，在我这一点用也没用。顺便吐槽，我完全不理解，在中国尤其是CSDN，为什么一个简单的小问题，一大堆人转载，完全一样的内容，如果真的是神一般的技巧，敢不敢多写一点，为什么这样能解决问题，出现故障的原因呢，无脑抄袭就算了，做笔记请使用自己的笔记本，比如有道云笔记，印象笔记不好吗，难道没人知道你是抄的？简直浪费搜索时间！垃圾！

吐槽完毕，该用google了，实际上，我一开始就没用百度，只是写这篇文章，担心有人遇到过这样的问题，写过相同的解决方案，说我是抄来的。就索性百度搜一下。用谷歌自然用英文，虽然我英语很渣，但是谷歌懂我。只需要几个关键词：

![谷歌搜索结果](/images/2019-01-28-4.png)

无论是微软官方的issue查，还是stackoverflow查，总能有很大的收获，但是，我这个问题比较特殊，我尝试过最基本的两种处理办法：

1. 屏蔽所有插件测试
1. 重置自定义的`settings.json`文件

然而都不好使。可怜我英文也不是特别好，有可能有些有用的信息被我忽略掉了。

> 这里补充一下，其实大部分原因，可以通过官方提供的自排除方案来检查[Performance Issues](https://github.com/Microsoft/vscode/wiki/Performance-Issues)，我很推荐遇到CPU占用率过高的情况下先看看这篇文章。

不过也不是全无收获，至少开头提到的三个问题，前两个查出来了。

第一个问题是插件`Auto Rename Tag`造成的，这个至少在一年前是非常流行的，我自己也觉得很好用，就一直装了，完全想不到这个简单的功能居然会造成VSCode某些功能异常，去插件主页看看，作者也不更新维护了，插件评价页面全是一星，可见目前已经是垃圾插件了[查看评论](https://marketplace.visualstudio.com/items?itemName=formulahendry.auto-rename-tag#review-details)，不过过年很多无脑转载的还在推荐这个插件，所以为了避免大家入坑，**建议不要使用Auto Rename Tag**。

第二个问题也是插件问题，就是`Markdown All in One`这个插件导致缩进功能不好使，原因我也不知道，其实这个问题并不严重，有强烈依赖改插件的朋友还是可以继续使用，我也很推荐这个插件写markdow，有些还是挺便捷的，不过我是删了哈哈哈，看个人意愿了~

好了第三个问题才是最重要的，我反复观察了很久，做了大量测试和查阅文档，终于得出结论：

1. 当且仅当VSCode的窗口大于1个的时候，才会出现该现象
1. 出现异常经常出现在切换不同窗口之后发生
1. 我发现切换窗口后出现异常就搜索关键词`two/multi vscode switch cause a high cpu useage`终于找到了一丝丝线索，仔细阅读了下面几篇：
    * [Switching between VSCode windows with any custom app switcher causes high CPU usage](https://github.com/Microsoft/vscode/issues/38516)
    * [application processes consume ~200% CPU combined](https://github.com/Microsoft/vscode/issues/41557#issuecomment-369675851)
    * [Extreme CPU usage when multiple windows are open](https://github.com/Microsoft/vscode/issues/46998#issuecomment-377499474)
    * [Renderer high CPU on OSX with custom window switchers](https://github.com/electron/electron/issues/12606)

我终于，发现了一个问题，我切换VSCode的窗口的方式有问题！！！我是用了**罗技鼠标的快捷键功能**导致，如图：

![罗技鼠标设置界面](/images/2019-01-28-5.png)

![罗技鼠标设置界面](/images/2019-01-28-6.png)

啊，我的天啊！我反复尝试，在多个窗口，直接用键盘的<code>Cmd + `</code>来切换内部应用窗口，妥妥的一点毛病都没有。

## 结论

很多情况下VSCode功能异常都是插件引起的，尝试关闭所有插件来检查，建议阅读[Performance Issues](https://github.com/Microsoft/vscode/wiki/Performance-Issues)。

其次是**第三方Switcher应用切换VSCode窗口会造成异常！比如常用的鼠标功能键！

啊，坑了我好多个月，反复重装VSCode和系统都没法解决的毛病终于解决了。。。以后只能用<code>Cmd + `</code>来切换了~