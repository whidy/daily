+++
title = "如何给Egg.js项目开启80端口访问"
date = "2019-03-15"
author = "whidy"
+++

# 如何给Egg.js项目开启80端口访问

## 为什么要

因某些特殊情况，项目cdn做了防盗链，然后本地开发也收到了限制，在cdn设置了一些本地ip的白名单，居然对端口支持不好，结果有时候可以访问cdn资源，有时候又不行，无奈，和运维、后端商量讲开发地址暂时改成`80`端口，以便正常开发~

> Egg.js的项目改端口很简单啦。但是也有一些要注意的，本文面向`MacOS`，当然`Linux`系统应该同样适用。

## 如何做

这里有几个方案，供君参考：

### 修改package.json

跑哪个命令就在这个命令后面加`--port=80`，例如：

```
"start": "egg-scripts start --daemon --title=egg-server-51la-web-egg --workers=2 --port=80",
...
```

dev同理。

### 配置config.local.js

如果没有这个文件自己创建一个，当然这个对应的是开发模式下使用。

部分配置如下：

```
'use strict';
module.exports = app => {
  const exports = {};
  exports.cluster = {
    listen: {
      port: 80,
      hostname: '127.0.0.1',
    },
  };
  return exports;
};
```

### Nginx大法

比较麻烦，不过看了下官方文档，应该也是可以很好的支持的。有兴趣请阅读该节：

* [部署](https://eggjs.org/zh-cn/tutorials/socketio.html#%E9%83%A8%E7%BD%B2)

## Warning

如果你不看这部分，很遗憾，你肯定跑不起来。你可能会遇到下面这些异常情况：

```
ERROR 3810 nodejs.AppWorkerDiedError: [master] app_worker#1:3813 died (code: 0, signal: null, suicide: false, state: dead), current workers: []
```

原因是Node.js的服务器端默认是无法使用1024以下的端口的。咋办呢？使用`sudo`哈哈哈。就是这样：`sudo npm start`或者`sodu npm run dev`。

也有可能是：

```
ERROR 3709 [app_worker] server got error: bind EADDRINUSE null:80, code: EADDRINUSE
```

端口被占用了！node.js的server服务无法在ctrl+c后立刻终止。比如默认7001未能正常关闭，通过`config.local.js
`文件修改的80端口也没有能够生效，每次启动服务都是启动了新的端口`7002`，此时：需要查出占用`7001`的端口的`pid`，将它终止。操作效果大致如下：

```
P750TM:51la-web-egg whidy$ lsof -i:7001
COMMAND  PID  USER   FD   TYPE             DEVICE SIZE/OFF NODE NAME
node    2982 whidy   25u  IPv6 0x2f7a1da313a05e4d      0t0  TCP *:afs3-callback (LISTEN)
P750TM:51la-web-egg whidy$ kill
kill: usage: kill [-s sigspec | -n signum | -sigspec] pid | jobspec ... or kill -l [sigspec]
P750TM:51la-web-egg whidy$ kill 2982
P750TM:51la-web-egg whidy$ lsof -i:7001
```

上面用到两个命令：`lsof -i:[端口号]`，`kill [进程的PID]`，最后重新查询7001就没有任何返回，说明Ok了，再次执行`sudo npm run dev`，那么就很好的使用80端口了。

## 参考

* [egg.js启动命令](https://eggjs.org/zh-cn/core/deployment.html#%E5%90%AF%E5%8A%A8%E5%91%BD%E4%BB%A4)
* [Node.js EACCES error when listening on most ports](https://stackoverflow.com/questions/9164915/node-js-eacces-error-when-listening-on-most-ports)

本文仅作为总结形式，未能重新完整的实践整个流程，如果有操作跳跃性或错误欢迎提出~