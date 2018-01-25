---
layout: post
title: "安装Gatsby和Strapi过程中的各种问题"
date: 2018-01-25
categories: gatsby strapi mongodb
---
> 2018年1月24日 阴 一般

# 安装Gatsby和Strapi

## VPS上安装Gatsby和Strapi中遇到的各种问题解决方案和相关记录

> 接着昨天的, 继续解决昨天没有处理好的问题, 下班的时候问了个开发同事, 我说为啥连接总是超时, 但是有时候好像又能连上, 他说查一下具体的日志会比较好, 等下就试试.

### 解决mongo创建服务器的WARNING提示

> 大多数情况下我是不愿意理睬WARNING信息的, 只要不是ERROR就好, 但是这次我有点不爽, 折腾了一会发现有的很难处理, 我错了, 我想我还是不死磕了吧😱

#### soft rlimits too low

```bash
WARNING: soft rlimits too low. rlimits set to 1024 processes, 64000 files. Number of processes should be at least 32000 : 0.5 times number of files.
```

参考:

* [MongDB 启动警告 WARNING: soft rlimits too low](http://blog.csdn.net/kk185800961/article/details/45613267)
* [How to set ulimits for mongod?](https://serverfault.com/questions/591812/how-to-set-ulimits-for-mongod)

#### Others

有一些问题受硬件限制?等等可以忽略的, 不值得花时间去处理的就一带而过了

```bash
WARNING: You are running in OpenVZ which can cause issues on versions of RHEL older than RHEL6.
```

参考: [WARNING: You are running in OpenVZ which can cause issues on versions of RHEL older than RHEL6.](https://groups.google.com/forum/#!msg/mongodb-user/61NFaGlyxcs/YGkIGv5RDgAJ)

#### 小插曲

> 在无法完美解决这几个WARNING之后, 早上来带着疑问想着一个关于Access Control的问题, 很多人甚至官方文档[Start MongoDB without access control.](https://docs.mongodb.com/master/tutorial/enable-authentication/#start-mongodb-without-access-control)也提到:

```bash
mongod --port 27017 --dbpath /data/db1
```

可是我一直报错, 要么说不存在, 搞半天才明白, **要手动创建**, 创建好了, 又说服务被占用, `service mongod stop`停了服务, 连上去了, `show dbs`发现跟之前的又不一样, 没有找到我之前看到的`strapi`库, 才恍然大悟, 原来其实我创建了一个跟之前无关的库...

事实上, 启动mongod服务的时候, 它连接了一个默认配置库, 这个库的路径时早就创建好的, 通过查看`/etc/mongod.conf`这个文件就知道了. 因此删了那个没用的db目录. 接着操作.

另外, 今早`strapi start`很顺利. 我也没办法再研究昨天究竟是为什么总是连不上了.

### 在`gatsby-strapi-tutorial`目录在创建一个新的Gatsby

> 每次创建速度很慢, 执行`gatsby new blog`完成的时候提示`added 1398 packages in 137.652s`, 大概就是2分钟多, 可能是安装依赖包费时吧
>
> 而执行`gatsby develop`的时间更长, 完成时提示如下:
>
> ```bash
> info bootstrap finished - 334.876 s
>
> DONE  Compiled successfully in 90373ms 21:15:06
>
>
> You can now view gatsby-starter-default in the browser.
>
> http://localhost:8000/
>
> View GraphiQL, an in-browser IDE, to explore your site's data and schema
>
> http://localhost:8000/___graphql
>
> Note that the development build is not optimized.
> To create a production build, use gatsby build
> ```
>
> 大概用了6分钟左右, 糟糕的是并不能通过远程**IP**来访问! 查看了目录下的配置文件和官方文档, 也没查到. 绝望之时, 突然在大量资料中看到webpack也有这样的问题, 想起来之前webpack的server默认配置也是无法通过ip访问, 但是webpack的`devServer`配置`host: "0.0.0.0"`即可, 试了下:
>
> ```bash
> # gatsby develop --host 0.0.0.0
> ```
>
> 又经过4分钟左右漫长等待, 这次成功了! 不过我尝试搜索Gatsby究竟用的什么服务器启动, 为何不能像webpack那样加一段配置呢, 却没有找到. 后来凑巧找到了一篇webpack下的issue, [Server can't be accessed via IP](https://github.com/webpack/webpack-dev-server/issues/147), 有人提到过这条命令.

### 安装Strapi插件(Install the Strapi source plugin)和创建页面模板

> Gatsby understands this pretty well. So its creators decided to build a specific and independent layer: the data layer. This entire system is strongly powered by GraphQL.

安装好`gatsby-source-strapi`插件后, 接下来完全就是copy代码, 配置首页, 创建文章模板等工作, 也是相当简单的过程, 这个基本上就把整个搭建页面的逻辑说了一遍, 虽然完全是复制粘贴的操作, 完成后如作者所展示的效果一致, 这里就不多复述了. 在开发环境中, 可以边修改文件边看效果.

### 总结

这次通过Gatsby和Strapi搭建一个简单的博客站点, 还是挺不容易的, 几乎花了一天半的时间. 不过个人感觉还是值得的! 其中有很多地方是可以更加深入的学习和了解的, 这也算初步接触了react, mongodb, graphQL等相关知识实操, 同时也可以在后期完善更多的功能, 了解并学习一些ES6, 模板的写法技巧等等. 也希望通过此次研究以后能更进一步熟悉其他框架, 数据库, 后端等思想~

再次列出相关文档

* 本文操作参考[Building a static blog using Gatsby and Strapi](https://hackernoon.com/building-a-static-blog-using-gatsby-and-strapi-8b5acfc82ad8)或<https://blog.strapi.io/building-a-static-website-using-gatsby-and-strapi/>(如果前面的那个无法访问)
* Gatsby官方[使用手册](https://www.gatsbyjs.org/docs/)和[开发教程](https://www.gatsbyjs.org/tutorial/)
* [Strapi文档](https://strapi.io/documentation/)
* [MongoDB 3.6官方手册](https://docs.mongodb.com/)和runoob上的[MongoDB 教程](http://www.runoob.com/mongodb/mongodb-tutorial.html)