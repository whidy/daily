+++
title = "高效前端开发 - Visual Studio Code"
date = "2019-10-10"
author = "whidy"
+++

# 高效前端开发 - Visual Studio Code

> 本文是根据我在公司演讲（2019年8月）的高效开发主题PPT重新总结发布的一篇文章。有兴趣了解PPT的可以前往百度网盘下载：[高效开发 - VSCode.pptx](https://pan.baidu.com/s/1AyHyDQ0DlxSdiVBsyJ5_Bw)，提取码: `yfkb`。

**Visual Studio Code**（后面简称VSCode）已经出来有几年了，为什么还要写这篇？原因是，我觉得这个编辑器强大到你不及时去了解尝试新的插件，你将没有办法时刻保持最高效的开发状态。也许本篇很多内容你已熟悉，但是我相信你依旧能从本文中受益。

## VSCode简介

> 适合自己的编辑器能改变你的工作方式和效率，如果你也在用VSCode不妨思考一下。

* Q1：一个编辑器真的值得花时间来介绍吗、还能提高效率？
* Q2：你的VSCode内置终端是CMD？Powershell还是？
* Q3：你了解你装的每个插件的用途吗？
* Q4：创建一个临时测试用的脚本，你会怎么操作最快速？

先看一张近几年的几款常见的IDE发展趋势

![IDE发展趋势](/static/images/2019-10-10-1.png)

显然VSCode突飞猛进，确实他在众多前端开发IDE中一直在更强大。来自官方的Slogan：**“Visual Studio Code 重新定义了代码编辑”**。

我简单总结了以下几点：

* 免费、开源、多平台
* 智能提示，代码片段，快速补全
* 方便的调试能力
* 内置Git
* 丰富的插件

## 常用插件推荐

### 快乐程序员必备插件v

作为一名快乐的前端开发工程师，必不可少的插件如下：

* [坤坤鼓励师](https://marketplace.visualstudio.com/items?itemName=sakura1357.cxk)
* [VSC Netease Music](https://marketplace.visualstudio.com/items?itemName=nondanee.vsc-netease-music)
* [epub reader](https://marketplace.visualstudio.com/items?itemName=renkun.reader)
* [VSCode Speech](https://marketplace.visualstudio.com/items?itemName=bierner.speech)
* …

当你发现开发的乐趣大大的，效率自然提高了。咳咳咳！好了不开玩笑了。上面几款插件确实对一部分有用，但重磅推荐的是下面这些。

### 实用开发插件推荐

🎉🎉🎉强烈推荐的几款插件：

* [Settings Sync](https://marketplace.visualstudio.com/items?itemName=Shan.code-settings-sync)：用于编辑器插件、设置相关等同步到GitHub Gist的插件，当多个开发设备开发环境统一非常有用。（兴趣阅读：[Visual Studio Code 设置同步到github的插件介绍及使用方法(Settings Sync)](https://www.whidy.cn/visual-studio-code-settings-sync-introduction.html)）
* [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)：用于检测JS代码规范的插件。
* [GitLens](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens)：查看git记录、对比git分支等强大的Git管理工具。
* [Vetur](https://marketplace.visualstudio.com/items?itemName=octref.vetur)：Vue开发者必备。
* [Bracket Pair Colorizer](https://marketplace.visualstudio.com/items?itemName=CoenraadS.bracket-pair-colorizer)：针对JS代码中的括号进行彩色配对。

🎉🎉比较推荐的几款插件：

* [Better Comments](https://marketplace.visualstudio.com/items?itemName=aaron-bond.better-comments)：非常醒目的注释，让代码更容易阅读。
* [Bookmarks](https://marketplace.visualstudio.com/items?itemName=alefragnani.Bookmarks)：打记号标签，通过快捷键快速在很长的代码中切换多个位置。
* [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)：快速启动一个本地服务器，对于编译好的静态项目可以快速访问。
* [Path Autocomplete](https://marketplace.visualstudio.com/items?itemName=ionutvmi.path-autocomplete)：文件路径补全，超级好用。
* [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)：代码格式化工具，也还行，上手快速，配置简单。
* [Version Lens](https://marketplace.visualstudio.com/items?itemName=pflannery.vscode-versionlens)：针对package.json的npm包依赖进行版本检测。

其他可选插件（就不做过多的介绍了）：

* [Material Theme](https://marketplace.visualstudio.com/items?itemName=Equinusocio.vsc-material-theme)：个人喜好主题。
* [Material Icon Theme](https://marketplace.visualstudio.com/items?itemName=PKief.material-icon-theme)：个人喜好ICON。
* [Debugger for Chrome](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome)：还可以不过大部分情况下我disabled。
* [Document This](https://marketplace.visualstudio.com/items?itemName=joelday.docthis)
* [Live Share](https://marketplace.visualstudio.com/items?itemName=MS-vsliveshare.vsliveshare)：多人协作。
* [Visual Studio IntelliCode](https://marketplace.visualstudio.com/items?itemName=VisualStudioExptTeam.vscodeintellicode)：微软官方的智能提示插件，但是我个人感觉有时候有点智障，一般我给disable了。
* [Import Cost](https://marketplace.visualstudio.com/items?itemName=wix.vscode-import-cost)：导入npm包的体积查看。
* [Winter is Coming Theme](https://marketplace.visualstudio.com/items?itemName=johnpapa.winteriscoming)：看起来还行的主题，不过我没装XD。

还有些我觉得也还不错，但是基本上是disabled状态的插件，也不过多介绍了。有兴趣可以搜索一下：

`Quokka`、`carbon-now-sh`或`Polacode`、`Color Highlight`、`Markdown All in One`、`Code Runner`、`LeetCode`、`JavaScript (ES6) code snippets`、`Python`、`PlantUML`等。

### 推荐卸载的插件

下面几个插件，我已经很久没用了，一般来说是曾经出现过严重异常但作者没修复，或已经有更好的插件替代了。

[Auto Rename Tag](https://marketplace.visualstudio.com/items?itemName=formulahendry.auto-rename-tag)：以前会产生CPU占用过高的异常，现在可能不可用了，我大概去年就没用过了。**而现在很多关于VSCode的文章依然推荐这个插件，作者不负责任！**兴趣阅读：[Visual Studio Code使用中CPU占用率异常暴增过高原因](https://segmentfault.com/a/1190000018041547)
[Path Intellisense](https://marketplace.visualstudio.com/items?itemName=christian-kohler.path-intellisense)：其实也挺好，不过作者两年没维护了，为保证稳定性，使用[Path Autocomplete](https://marketplace.visualstudio.com/items?itemName=ionutvmi.path-autocomplete)取代了。

## 关于插件的补充说明

为什么我强烈推荐的插件就几个，为什么很多不错的插件我安装了却要disable。因为插件确实会占用编辑器的性能，装的太多很可能造成编辑器使用异常，甚至同类插件存在冲突都有可能。我在演讲PPT之前，找了公司许多前端了解了他们开发的习惯，很多开发者安装插件并不知道具体用途或者安装了用了几次就不用了。那么我给的插件安装建议如下：

* 明确你所用的插件用途
* 针对不常用的插件进行关闭
* 针对某些项目才使用的插件请在workspace启用
* 不要同时启用多个类似功能的插件，比如格式化代码插件

这样尽量能保持开发环境稳定。这就是**Q3**的解答了，还满意吗？

## 编辑器设置

常用的快捷键，真的需要用心去学习，尽可能多记一些，这不仅是VSCode提升效率开发的方法，任何工具都是需要的。（以下内容Windows将command换成Ctrl即可）

* **command + k, command + s**：通过这个组合键，多看看快捷键
* **command + b**：侧栏展开收缩
* **command + j**：面板（问题、输出、调试、终端面板）展开收缩
* **command + ,**：修改设置
* **command + shift + p**：显示所有指令，等待输入执行
* **command + shift + e**：显示文件侧栏
* **command + shift + f**：显示搜索侧栏
* **command + shift + s**：显示调试侧栏
* **Option + command + s**：全部保存
* ...

还有很多代码上的快捷键，包括收缩、注释、多选（多行、内容）等等，网上介绍太多了，大家有兴趣可以进一步了解。

### 补充说明

如果你发现某些快捷键不能用了。那一定是有其他软件占用了全局快捷键，只能慢慢排查了，我知道的Windows下有款软件可以查看系统快捷键使用情况，叫做`Windows Hotkey Explorer`，大家自行下载一下。（兴趣阅读：[关于sublime text 3(3103)版本Ctrl+Alt+P无法正常使用解决办法](https://www.whidy.cn/sublime-text-3-3103-ctrl-alt-p-cannot-use.html)）

## VSCode高级设置

通过**command + ,**，我们来修改编辑器的默认设置，这里我不太喜欢他的可视化设置界面，我将他切换到代码模式，手动添加如下代码：

```json
{
  "editor.wordSeparators": "`~!@#$%^&*()=+[{]}\\|;:'\",.<>/?",
  "terminal.integrated.shell.windows": "C:\\Program Files\\Git\\bin\\bash.exe",
  "files.associations": {
    "*.tag": "html",
    "*.css": "css",
    "*.jsp": "html",
    "*.ejs": "html",
    "*.wxml": "html",
    "*.wxss": "css"
  }
}
```

上面三个设置说明

* 分隔符去掉了`–`，因为Html代码中的Css类名常用到，如果双击不能选中完整类名，好痛苦。
* 命令行修改原因？如果在Windows下开发，我无法忍受Windows的命令行或者PS需要按`Ctrl + C`后还要Y一下。所以换成了`Git Bash`，请注意你的Git安装路径进行调整。这就是**Q2**的解释！
* 其他语言的页面，需要使用HTML语法高亮配对的话，该设置可以针对不同文件后缀的文件做相同的语言模式开发。

上面是一些简单的配置，没有配置经验的可以先试试效果。接下来会有些复杂的设置。

### 结合插件的配置：

很多插件都有丰富的配置项来提高成产效率，下面举几个例子。

#### Prettier

编码风格需要全局配置的话，你就可以尝试如下配置：

```json
{
  "prettier.printWidth": 160,
  "prettier.singleQuote": true,
  "prettier.semi": false,
}
```

#### Path Autocomplete

项目中如果有内置文件夹映射到`@`，比如Nuxt、或者手动配置webpack的目录alias，那么下面这段配置很好用了：

```json
{
  "path-autocomplete.pathMappings": {
    "@": "${folder}/client",
  }
}
```

那么你在Nuxt项目中输入@，就能自动映射到项目目录的client，并提示client内的文件夹了。

#### Vetur

如果需要配合eslint，并保存自动格式化代码可以尝试下面设置：

```json
{
  "eslint.enable": true,
  "editor.formatOnSave": false,
  "eslint.autoFixOnSave": true,
  "eslint.validate": [
    {
      "language": "vue",
      "autoFix": true
    },
    {
      "language": "html",
      "autoFix": true
    },
    {
      "language": "javascript",
      "autoFix": true
    }
  ],
  "html.format.enable": false,
  "javascript.format.enable": false,
  "vetur.format.defaultFormatter.css": "prettier"
}
```

以上配置结合个人习惯进行调整即可。

## 其他技巧

> 该部分主要是PPT演示实操，故文章简单介绍一下。

针对开头的几个问题

### JavaScript调试

* 自定义`Launch.json`
* Code Runner插件解决
* Debugger for Chrome插件解决

前者建议创建一个专用的测试目录作为项目目录，配置好`Launch.json`，例如我这里配置如下：

```json
{
  "version": "1.0.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch file",
      "program": "${file}"
    }
  ]
}
```

这段配置写好后，你就可以对单个JS文件进行代码调试了。如果经常测试代码片段，那就启用Code Runner插件吧。

如果需要浏览器中的页面调试，Debugger for Chrome或者Live Server启动一个页面来调试也很方便了。

### 侧栏搜索进行内容查找

你或许知道对项目进行全局代码搜索，但是项目文件过多，搜索速度明显就慢了。提升搜索效率有很多方法：

> 默认的搜索只能看到一个输入框，也许你知道输入框左侧箭头点一下就可以实现替换功能了，然后右侧下面三个点，有更多高级的功能哦~

* 通过设置**包含的文件**或**排除的文件**来提升搜索效率，这里支持通配符`*`
* 通过**大小写识别**、**精确内容搜索**、**正则表达式**来更准确的搜索想要的内容。

### 快速打开项目中的文件

通过快捷键`command + p`，可以看到最近打开的文件，输入文件名可以非常方便的打开想要找到的文件。

### 快速打开项目

通过快捷键`control+ r`，可以快速选择需要打开最近或者想要查看的项目。

还有好多技巧其实都是离不开快捷键的，这里不多说了，大家自己多多探索。

## 思考及总结

认真阅读的你，我相信收获还是不少的。对于**Q1**的疑问，心中也有了答案。

其实还有非常重要的一点，要不断增加自己对编辑器的熟悉程度，一定要关注每次VSCode的更新日志，虽然每次都是英文的，可能看不懂，但是尽可能的过一遍，经常会有惊喜。

当然如果有兴趣，尝试自己写插件，满足个性需求也是很棒的，或者自己写snippet之类。

网络上关于VSCode相关介绍、技巧数不胜数，我还是写了这篇文章，我也是为了推动大家更好的使用这款编辑器为目的，希望能真正意义上提高前端开发效率。同时分享一个github仓：[令人惊叹的VSCode](https://github.com/viatsko/awesome-vscode)。

最后提出一个问题：

经历了这么多年的前端开发，我常用的编辑器也从Frontpage -> Dreamweaver(MX...) -> Sublime Text发展到现在VSCode。那么，**重度依赖VSCode真的好吗？**😁😁😁
