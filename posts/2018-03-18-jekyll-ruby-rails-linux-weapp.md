---
layout: post
title: "CentOS7安装Jekyll和Rails"
date: 2018-03-18
categories: jekyll ruby rails linux weapp
---
> 2018年3月18日 阴 一般

# CentOS7安装Jekyll/Rails/Linux用户管理/微信小程序页面加载问题

> 打算把我的wordpress博客移植到Jekyll上面, 于是试了下, 之前有在国外的VPS搭过一个Jekyll站点<http://daily.whidy.net/>, 纯静态的感觉很棒, 因此尝试一下移植的效果~

## CentOS7下安装Jekyll环境搭建

### 安装Jekyll需要

* [Ruby](https://www.ruby-lang.org/zh_cn/downloads/)
* [RubyGems](https://rubygems.org/pages/download)
* [NodeJS](https://nodejs.org/en/)
* [Python 2.7](https://www.python.org/downloads/)(Whidy比较懒, 貌似CentOS7自带? 还是啥时候装了, 不会的自己搜一下= =.)

#### 安装Ruby2.5.0和RubyGems

> 目前最新稳定版本是`2.5.0`, CentOS自带源的版本比较老, 我们需要第三方源`rbenv`来安装最新稳定版, 安装方法如下:

1. 安装`rbenv`和`Ruby`依赖的组件

    ```bash
    # sudo yum install -y git-core zlib zlib-devel gcc-c++ patch readline readline-devel libyaml-devel libffi-devel openssl-devel make bzip2 autoconf automake libtool bison curl sqlite-devel
    ```
  
1. 安装`rbenv`和`rub-build`(务必在非root用户的home下面操作)

    ```bash
    # cd ~
    # git clone git://github.com/sstephenson/rbenv.git .rbenv
    # echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.bash_profile
    # echo 'eval "$(rbenv init -)"' >> ~/.bash_profile
    # git clone git://github.com/sstephenson/ruby-build.git ~/.rbenv/plugins/ruby-build
    # echo 'export PATH="$HOME/.rbenv/plugins/ruby-build/bin:$PATH"' >> ~/.bash_profile
    # source ~/.bash_profile
    ```

1. 查看当前可安装的Ruby版本

    ```bash
    # rbenv install -l
    ```

1. 安装目前最新稳定版本`2.5.0`

    ```bash
    # rbenv install -v 2.5.0
    # rbenv rehash
    ```

    `rbenv rehash`的作用是有多个Ruby版本的时候要执行的

1. 检查安装是否成功

    ```bash
    # rbenv versions
    ```

1. 设置为全局(否则`ruby`命令无法使用?)并检测版本是否正确

    ```bash
    # rbenv global 2.5.0
    # ruby -v
    ```

1. 可选/必选安装`bundle`, 因为参考的安装资料包含`Rails`, 所以这个是否必须安装尚不确定, 如果同时需要`Rails`, 可以查看底部的参阅文档.

    ```bash
    # gem install bundler
    ```

> 实际上整个安装过程已经把`RubyGems`安装好了? 

参阅:

* [Install Ruby on Rails with Rbenv on CentOS 7](https://www.vultr.com/docs/install-ruby-on-rails-with-rbenv-on-centos-7)


其它:

[安装Ruby-官方文档](https://www.ruby-lang.org/zh_cn/documentation/installation/)

#### 安装`NodeJS`

这个比较简单, 直接安装就好了

```bash
# sudo yum install nodejs
```

### 用 RubyGems 安装 Jekyll

```bash
$ gem install jekyll
```

### 创建一个Jekyll站点

接下来在当前用户的目录下创建一个博客站点并开启服务

```bash
# cd ~
# jekyll new blog
# cd blog
#  jekyll serve --host 0.0.0.0
```

此时打开浏览器访问`[server ip]:4000`即可.(例如`http://118.0.156.000:4000/`)

> 示例页面: <http://daily.whidy.net/>

参阅: http://jekyllcn.com/docs/installation/


## 其它

> 我顺便测试了Rails, 也是折腾很久, 这里就稍微说一下我的Rails安装过程

### 安装Rails

在上面安装Ruby的过程中接着执行

```bash
gem install rails
rbenv rehash
```

检测是否安装正确

```bash
rails -v
```

#### 安装并配置git

也比较简单, 注意配置好用户即可. 整个流程大致如下:

```bash
# sudo yum update
# sudo yum install git
# 
# git --version
# 
# git config --global user.name "Whidy"
# git config --global user.email "whidy@whidy.net"
# 
# git config --list
```

接下来创建一个`pilot`应用

```bash
# cd ~
# rails new pilotapp
# cd pilotapp
# rake db:create
```

我这边提示了一长串警告, 忘了做记录了, 按照提示就执行了

```bash
# bundle lock --add-platform x86-mingw32 x86-mswin32 x64-mingw32 java
```

然后, 部署环境(类似npm install?), 反正过了很久

```bash
# bundle install
```

最后启动服务

```bash
# rails s -b 0.0.0.0
```

访问`[server ip]:3000`即可.(例如`http://118.0.156.000:3000/`)

### Linux用户管理

之前都是用的`root`账户进行操作, 所以从来没用过`sudo`, 显然这个安全性上来说不符合Linux的风格, 于是创建了一个`whidy`用户, 发现root安装的程序貌似无法在新用户上面执行? 所以很多东西又重新安装了一遍. 突然感觉我的服务器被我弄得越来越乱了.

这里有几个比较不错的文章学习一下

* 列出Linux下的所有用户[Linux List All Users In The System](https://www.cyberciti.biz/faq/linux-list-users-command/)
* CentOS7下管理用户的相关操作[How To Add and Delete Users on a CentOS 7 Server](https://www.digitalocean.com/community/tutorials/how-to-add-and-delete-users-on-a-centos-7-server)

### 微信小程序

由于工作上有个业务需求是, 用户必须授权微信账户信息才可以执行操作, 因此我一开始在App上面`onLaunch`获取用户信息(`getUserInfo`), 然后在Page上面`onLoad`执行检测, 这个过程是异步的, 导致App上面没有获取到, 就执行了Page上面的检测, 这个是不允许的, 为了解决这个问题弄了一下午.

另一方面, 今天算是弄明白`Zan-UI`的正确使用方法, 以及微信授权失败, 重新请求授权的办法了~