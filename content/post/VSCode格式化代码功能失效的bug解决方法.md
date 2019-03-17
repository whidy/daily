+++
title = "VSCode格式化代码功能失效的bug解决方法"
date = "2018-02-13"
author = "whidy"
+++

# VSCode格式化代码功能失效的bug解决方法

> 前不久我装上了[黑苹果](http://www.whidy.net/w350etq-k590s-install-hackintosh-macos-high-sierra-summary.html)，那么为了快速转移开发环境，我使用了VSCode(Visual Studio Code下面简称VSCode)的插件`Settings Sync`来同步个人设置和其他常用插件，如果不熟悉`Settings Sync`的可以参考之前我写的一篇文章[《Visual Studio Code 设置同步到github的插件介绍及使用方法(Settings Sync)》](http://www.whidy.net/visual-studio-code-settings-sync-introduction.html)来使用。

## 现象

当然本文并不是介绍同步，而是要说同步后的编码过程中出现的异常。在Mac下安装好VSCode，用`Settings Sync`同步成功后，接着git clone正在开发的项目到本地，开发过程中，却发现一个非常奇怪的问题：**所有的格式化代码的功能都失效了**。Mac下使用快捷键“Alt+Shift+F”（我用的windows键盘），却提示，“`当前没有安装“xxx”文件的文档格式化程序。`”！我的Vue，SCSS代码都无法正常格式化！这个非常令人不爽，难道Mac下的VSCode会有格式化代码功能的缺失？和Windows版本的VSCode功能不一致？我觉得不太可能。于是重启回到Windows 10，重新拉了项目测试，毫无问题。无论是Windows还是Mac，都是最新版的Visual Studio Code。

## 分析

无奈之下去google了一下格式化代码的问题，发现很多人都遇到过，有的人说重装VSCode，但是我才新装的，所以排除了，但是重装这个词让我想起一个东西，就是这些格式化代码工具，例如`Vetur`，`Prettier`，他们正常运行的时候都是会在编辑器中产生一个服务或者提示，而失效状态下是看不到的。于是我尝试把Vetur插件停用，重新加载再启用，然而还是无效！

想来想去，插件也安装了，编辑器也是新装的，为何插件没起到作用，突然记起之前Windows下的输出面板中是有`Vue Language Server`的，而现在却没有，是不是要重新安装插件呢，或者说通过Settings Sync自动化同步插件安装的功能还存在一些其他的问题呢？

### 解决方案

带着疑问我尝试着将Vetur和Prettier卸载，然后再重新安装，启动VSCode，打开项目，切换到一个Vue页面，终于看到了Vetur的服务，比如下面这张图中表现了正常的格式化功能的效果（截图为我解决问题后的图片）

![正常的格式化插件效果](/images/2018-06-21-1.png)

图中看到这里有个Vue Language Server，才是真正表示Vetur插件正常，右下角还有个Prettier，说明一切正常，再试了一下使用快捷键“Alt+Shift+F”，也终于可以正常格式化代码了！问题完美解决。

## 结论

有时候自动化工具安装的插件可能会存在一些问题，虽然不排除我这个问题发生的偶然性。

另一方面，重装软件有时候能解决问题，不过需要针对问题分析，从最小的改变逐渐排除故障。如果我把VSCode重装，再用Settings Sync同步一次，也许的确可以解决问题，但是也有可能依旧存在问题，而从插件重装下手才是比较省时省力的。

那么，如果开发中依赖插件的部分功能失效了，你也可以尝试重装插件，或许问题就能快速解决了～