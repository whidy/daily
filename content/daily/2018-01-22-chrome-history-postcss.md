+++
title = "内网IP调整后引发谷歌浏览器历史记录的修改实现"
date = "2018-01-22"
author = "whidy"
+++
> 2018年1月22日 晴 一般

# ShadowRoot的认识 / PostCSS移动端ViewPort脚手架

## 内网IP调整引发的Chrome历史记录修改ShadowRoot的学习

由于IP经常变动, 导致本地项目的那些存在地址栏的历史记录就都失效了, 突然脑洞大开, 有没有办法修改本地历史记录的方法?
> 想法是: 假设我原IP是**192.168.1.51**, 新IP是**192.168.1.63**, 我历史记录有<http://192.168.1.51:8080/test.html>, 我通过某种办法强行修改Chrome历史记录将192.168.1.51替换成192.168.1.63, 这样, 下次在地址栏输入test, 他就能自动填充<http://192.168.1.63:8080/test.html>了.

现实是残酷的, Chrome软件的历史记录貌似是二进制文件, 也可能是出于安全考虑. 为了快速解决问题, 我就不打算去研究如何修改二进制文件了.

于是改了host, 映射了一个Ip到本地域名, 为了方便内网其他小白用户快速修改host, 我就搞了个bat文件给他们, 执行后就追加一条来修改host, 参考[批处理文件中ECHO命令显示换行](http://www.edbiji.com/doccenter/showdoc/31/nav/1049.html).

```bash
echo. >> %WINDIR%\system32\drivers\etc\hosts & echo 192.168.1.63 bs.ybj.com >> %WINDIR%\system32\drivers\etc\hosts
```

当然这样以后如果再换IP, 就要手动就改一下host文件了~ 如果偷懒改这个bat文件, 有追加一条新的同域名指向不同IP, 可能不会出问题, 也可能会导致每次访问页面卡20s左右出来. 当然这里我们不考虑文件修改权限的系统相关的问题~

引发的其他思考, 关于修改本地历史记录的想法诞生后, 我顺便在历史记录`chrome://history/`中搜索了一下**192.168.1.51**, 发现有两百多条, 我打算将他们导出成文本替换(其实没什么意义), 然而我发现, 在Console面板里, 这个历史记录居然无法通过普通的JS方法将所有的地址遍历输出, 通过观察Elements面板的DOM结构, 发现原因在于这个`#shadow-root (open)`这个节点内的DOM元素不能被直接获取到. 从来没有研究过[ShadowRoot](https://developer.mozilla.org/zh-CN/docs/Web/API/ShadowRoot)的我懵逼了, MDN上查到, 它与主DOM树分开渲染, 那么此时我是否有办法获取到DOM子树的根节点内的元素呢. 当然可以, 参考[How to access elements under \`shadow-root\` at 'chrome://downloads' using jquery and selenium?](https://stackoverflow.com/questions/44400482/how-to-access-elements-under-shadow-root-at-chrome-downloads-using-jquery), 原来有这个神奇的`/deep/`. 于是试着写了一段:

```javascript
const HISTORYITEMS = document.querySelectorAll('#history-app /deep/ #content /deep/ #history /deep/ #infinite-list /deep/ history-item /deep/ #title');
for (let i = 0; i < HISTORYITEMS.length; i++) {
  let item = HISTORYITEMS[i];
  let url = item.getAttribute('href');
  let name = item.getAttribute('title');
  console.log(`${i}: ${name}'的URL地址是${url}
  `);
}
```

> 由于默认显示条数不会全部显示出来, 所以可能须要手动滚动至底部加载完成后执行.

后来, 我还是抱以试试的想法去尝试着修改Chrome历史记录, 没想到居然还是很容易的. 确认及准备好以下工作:

1. 我的系统**Windows 10 64bit**
1. 我的Chrome版本**63.0.3239.132（正式版本） （64 位）**
1. 下载[HxD](https://mh-nexus.de/en/hxd/)编辑工具, [直接下载](https://mh-nexus.de/downloads/HxDSetupCHS.zip), 安装并打开软件
1. 关闭Chrome浏览器, 并打开用户个人配置相关文件的目录, (请修改对应的用户名whidy部分替换)
  ```bash
  C:\Documents and Settings\whidy\Local Settings\Application Data\Google\Chrome\User Data\Default
  ```
  备份好`History`, `History-journal`, `History Provider Cache`三个文件(防止误操作造成的Chrome破坏造成的损失)

**然后直接用HxD依次打开这三个文件, 使用编辑器的替换功能, 将192.168.1.51全部替换为192.168.1.63, 保存.**

完成后, 再次启动Chrome, 如果没有发生什么异常, 我想这个奇葩想法的功能就实现了. 我成功的替换了280多条历史记录~

## PostCSS的ViewPort移动端适配插件简单架子

内容相对简单, 其实就是介绍了一个插件, 可以直接clone下来测试, 并根据个人情况来配置[PostCSS学习指南终结篇](https://gitee.com/janking/Infinite-f2e/issues/IHIJ5), 之前也有研究过其他的插件, 还有css grid相关的学习, 不过过了几个月也没有实际用途就搁置了, 也算作废了.