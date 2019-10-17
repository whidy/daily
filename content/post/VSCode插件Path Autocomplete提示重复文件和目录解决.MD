+++
title = "VSCode插件Path Autocomplete高级技巧"
date = "2019-10-17"
author = "whidy"
+++

曾经介绍过[`Path Autocomplete`](https://marketplace.visualstudio.com/items?itemName=ionutvmi.path-autocomplete)是一款非常不错的VSCode插件。当然出了**最基本的路径补全提示**，还有些高级技巧和使用中可能遇到的小问题，在此和大家分享下。

## 映射目录

当你项目中的Webpack使用了[`resolve.alias`](https://webpack.js.org/configuration/resolve/#resolvealias)，webpack.config.js配置如下：

```javascript
module.exports = {
  //...
  resolve: {
    alias: {
      Utilities: path.resolve(__dirname, 'src/utilities/'),
      Templates: path.resolve(__dirname, 'src/templates/')
    }
  }
};
```

那么项目之前引入的一个文件的方法假设是：

```
import Utility from '../../utilities/utility';
```

现在就可以写成：

```
import Utility from 'Utilities/utility';
```

问题来了，当你输入`Utilities/`的时候，编辑器根本不知道这里面有什么文件，无法实现补全提示。

这时候，只需要在这个项目添加一个插件的配置就可以了，配置如下：

```javascript
{
  "path-autocomplete.pathMappings": {
    "Utilities": "${folder}/src/utilities/",
  }
}
```

> `${folder}`表示项目根目录，如果你的项目和示例略有不同，请根据具体情况修改。

这样是不是很方便啊，同理很多脚手架或框架（比如Nuxt.js）自带了这种类似的依赖关系，都是可以通过插件的`pathMappings`设置来更好的写代码的。

> 该功能示例在官方文档[Options - pathMappings](https://github.com/ionutvmi/path-autocomplete#options)，也有，可以参考。

## 出现重复文件和目录补全提示

比如，你可能会遇到路径补全提示中出现重复的目录名称或者是文件，如下图：

![重复的目录和文件](/static/images/2019-10-17-1.png)

那我也是尝试关闭VSCode自带的补全功能结果没找到。后来仔细阅读了插件文档，google相关信息，总结了下：

### 设置插件选项

该插件提供了一个选项`path-autocomplete.ignoredFilesPatter`，你可以通过添加一行设置如下：

```json
"path-autocomplete.ignoredFilesPattern": "**/*.{js,ts,scss,css}"
```

参阅：[Path Autocomplete Tips](https://github.com/ionutvmi/path-autocomplete#tips)

意思是匹配到所有的js、scss、css、ts文件时，path-autocomplete将被忽略。

### 设置VSCode内置选项

在现有版本的VSCode上，是有两个选项关闭js、ts的路径提示的，我们可以通过关闭它们，达到目的：

```json
"javascript.suggest.paths": false,
"typescript.suggest.paths": false,
```

这样的话也能解决重复提示的问题，当然缺点是，其他文件类型就无法解决了。

相关阅读：

* [Folders are duplicated on sass import statement](https://github.com/ionutvmi/path-autocomplete/issues/56)
* [~~multiple suggesion in js files~~失效](https://github.com/ionutvmi/path-autocomplete/issues/48)

总的来说，推荐使用第一种**设置插件选项**来解决这个问题。

## 快速跟踪文件

抱歉，理论上来说这个是VSCode内置的取代该插件的方案，但是我总是发现不太好用。

理论上，进行了`jsconfig.json`配置，详细可阅读[官方说明](https://code.visualstudio.com/docs/languages/jsconfig)，也可以达到**映射目录**的能力，并且，根据插件内的这段[Configure VSCode to recognize path aliases](https://github.com/ionutvmi/path-autocomplete#configure-vscode-to-recognize-path-aliases)描述来看，他是可以解决文件关联打开的，但是我反复测试了好久，都无法正常实现。原因不明，有兴趣的朋友也可以试试这个哦~
