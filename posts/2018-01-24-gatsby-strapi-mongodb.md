---
layout: post
title: "啥也没干的一天"
date: 2018-01-20
categories: voidday
---
> 2018年1月24日 阴 一般

# 安装Gatsby和Strapi

## VPS上安装Gatsby和Strapi中遇到的各种问题解决方案和相关记录

> 参考[Building a static blog using Gatsby and Strapi](https://hackernoon.com/building-a-static-blog-using-gatsby-and-strapi-8b5acfc82ad8)

### 安装Gatsby

> 事情总是不是那么顺利.

根据Gatsby文档[Get started](https://www.gatsbyjs.org/docs/), 执行到如下命令时:

```bash
# gatsby new gatsby-site
```

报错, 需要`git`. 然而我的服务器没装, 那就装一个吧. 参考[Download for Linux and Unix](https://git-scm.com/download/linux)执行:

```bash
# yum install git
```

再次执行后依旧报错(当前git版本`1.7.1`)

```bash
error Command failed: git clone git://github.com/gatsbyjs/gatsby-starter-default.git gatsby-site --single-branch
```

推测是版本问题. 只好手动安装了. 于是又找到这个[安装 Git](https://git-scm.com/book/zh/v1/%E8%B5%B7%E6%AD%A5-%E5%AE%89%E8%A3%85-Git)

```bash
# yum install curl-devel expat-devel gettext-devel openssl-devel zlib-devel
# wget https://www.kernel.org/pub/software/scm/git/git-2.16.1.tar.gz
# tar -zxf git-2.16.1.tar.gz
# cd git-2.16.1
# make prefix=/usr/local all
# sudo make prefix=/usr/local install
```

漫长的`make prefix=/usr/local all`之后, 提示:

```bash
    SUBDIR perl
/usr/bin/perl Makefile.PL PREFIX=\'/usr/local\' INSTALL_BASE=\'\' --localedir=\'/usr/local/share/locale\'
Can\'t locate ExtUtils/MakeMaker.pm in @INC (@INC contains: /usr/local/lib64/perl5 /usr/local/share/perl5 /usr/lib64/perl5/vendor_perl /usr/share/perl5/vendor_perl /usr/lib64/perl5 /usr/share/perl5 .) at Makefile.PL line 3.
BEGIN failed--compilation aborted at Makefile.PL line 3.
make[1]: *** [perl.mak] Error 2
make: *** [perl/perl.mak] Error 2
```

蛋疼, 等了半天, 又要解决这个问题, 好在看起来比较容易处理, 参考[git fails to build in Fedora 14](https://github.com/qsnake/qsnake/issues/12), 然后继续执行最后两条`make`命令, 虽然最后出来很多看起来很奇怪的内容, 不过似乎是成功了. 执行:

```bash
# git --version
git version 2.16.1
```

接下来我们再一次执行`gatsby new gatsby-site`, 我擦还提示刚才的`...single-branch`的error, 这就坑爹了- -. 经过简短的排查. 原来似乎他还是跑的旧版git, 需要删掉之前yum自动安装的`git 1.7.1`, 我单纯的以为直接自动升级了. 于是:

```bash
# yum remove git
```

按照提示删除成功后, 再次检测git还是ok的, 这次我第三次执行`gatsby new gatsby-site`, 终于成功了! 我这小白也不知道linux软件管理是咋整的. 反正能继续执行卡了我半天的gatsby就好了吧...

剩下的依照接下来的文档操作就好了, 很快就看到了Gatsby主页了~ "Hi people"!

> 此时几乎耗费了一上午的时间了, 嘘... 期待能通过尝试学习到react, graphQL等相关的内容

### 安装Strapi

> Requirements: please make sure **Node 8** (or higher) and **MongoDB** are installed and running on your machine.

此时, 暗喜前阵子已经琢磨出来了并装好了`Node 8`, 不过装MongoDB就没有了. 果断找到文档[Install MongoDB Community Edition on Red Hat Enterprise or CentOS Linux](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-red-hat/), 这个redhat和centOS应该是通用的吧- -! 看到[Configure the package management system (yum).](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-red-hat/#configure-the-package-management-system-yum), 发现原来还有这种操作, 创建repo文件, 来安装对应版本的软件. 闲话少说, 按步骤很快就装好了. 此时需要启动mongod再继续安装Strapi, 如下命令:

```bash
# service mongod start
```

到了这个步骤的时候

```bash
# strapi start
```

卡住了, 频繁报错如下

```bash
[root@whidy api]# strapi start
DEBUG (24910 on whidy): Server wasn't able to start properly.
ERROR (24910 on whidy): (hook:mongoose) takes too long to load
```

大概是网络原因, 我联通网络出问题, 换了电信几番尝试就好了, 创建了admin账户后, 进入后台继续按步骤操作.

> 操作过程中频繁出现刚才的问题, 我觉得不是网络问题那么简单, 我打算从数据库方面着手完善一下试试

```bash
# mango
> use admin
> db.createUser(
    {
      user: "username",
      pwd: "userpassword",
      roles: [ { role: "userAdminAnyDatabase", db: "admin" } ]
    }
  )
# mongo --port 27017 -u "username" -p "userpassword" --authenticationDatabase "admin"
```