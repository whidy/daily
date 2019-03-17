+++
title = "shadowsocks-manager搭建"
date = "2018-04-01"
author = "whidy"
+++

> 2018年4月1日 晴 一般

# shadowsocks-manager搭建

> 该文章仅作为日志记录一下, 因为工作原因, 或者个人原因吧, 会习惯使用谷歌去查找技术资料, 所以shadowsocks在工作生活中必不可少, 之前买了个国外的服务器, 一直用着不错, 也有几个比较好的朋友想要买我的这个梯子, 于是就搭建了一个官方的管理平台.

以下内容主要参阅: [WebGUI](https://github.com/shadowsocks/shadowsocks-manager/wiki/WebGUI)

## 安装[`shadowsocks-libev`](https://github.com/shadowsocks/shadowsocks-libev)

我的`centos7`之前用的网上的一键安装, 虽然那个捆绑式安装过`shadowsocks-libev`, 也能正常使用shadowsocks, 但是无法使用命令`ss-manager`, 于是只能重新搞. 大致流程如下:

### 删除旧版(好吧,这里暴露了)

```bash
# wget --no-check-certificate -O shadowsocks-libev.sh https://raw.githubusercontent.com/teddysun/shadowsocks_install/master/shadowsocks-libev.sh
# chmod +x shadowsocks-libev.sh
# ./shadowsocks-libev.sh uninstall
```

输入`y`

### 正常安装

```bash
# yum install epel-release -y
# yum install gcc gettext autoconf libtool automake make pcre-devel asciidoc xmlto c-ares-devel libev-devel libsodium-devel mbedtls-devel -y
```

此时需要用第三方源([centos7](https://copr.fedorainfracloud.org/coprs/librehat/shadowsocks/repo/epel-7/librehat-shadowsocks-epel-7.repo))

```bash
# vi /etc/yum.repos.d/librehat-shadowsocks-epel-7.repo
```

把刚才的源拷贝进去保存, 再执行

```bash
# su -c 'yum install shadowsocks-libev'
```

就完成了`shadowsocks-libev`安装

## 安装Node.js(略)

> 测试过`node.js 8.x`没有问题, 安装比较简单, 参考这个就行<https://github.com/nodesource/distributions#enterprise-linux-based-distributions>

## 安装`ssmgr`

```bash
# npm i -g shadowsocks-manager
```

> 这里可能会出现一直刷错误，大概如下：

```bash
gyp WARN EACCES attempting to reinstall using temporary dev dir "/usr/lib/node_modules/shadowsocks-manager/node_modules/sqlite3/.node-gyp"-bash: printf: write error: Interrupted system call
```
如果出现该问题，尝试使用以下附带`--unsafe-perm`的命令<https://github.com/shadowsocks/shadowsocks-manager#from-npm>进行安装：

```bash
# npm i -g shadowsocks-manager --unsafe-perm
```

## 配置

我现在只有一台服务器, 所以就以一台服务器为例, 假设这台服务器自己做网站, 也做梯子, IP是`114.1.1.1`.

你大概需要编写`2`个文件, 并同时执行`3`个命令(在没有使用`screen`, `pm2`等工具的情况下):

1. `~/.ssmgr/ss.yml` 作为服务器配置
  
  ```yml
  type: s

  shadowsocks:
    address: 127.0.0.1:4000
    # 这里的地址和端口需要跟上一步的 --manager-address 参数保持一致，连接上述 udp 端口
  manager:
    address: 114.1.1.1:4001
    # 这个 address 参数会让程序监听一个 tcp 端口，用于接收 webgui 发送过来的控制命令
    password: '123456'
  db: 'ss.sqlite'
  ```

1. `~/.ssmgr/webgui.yml`

  ```yml
  type: m

  manager:
    address: 114.1.1.1:4001
    password: '123456'
    # 这部分的端口和密码需要跟上一步 manager 参数里的保持一致，以连接 type s 部分监听的 tcp 端口
  plugins:
    flowSaver:
      use: true
    user:
      use: true
    account:
      use: true
    macAccount:
      use: true
    group:
      use: true
    email:
      use: true
      type: 'smtp'
      username: 'username'
      password: 'password'
      host: 'smtp.your-email.com'
      # 这部分的邮箱和密码是用于发送注册验证邮件，重置密码邮件
    webgui:
      use: true
      host: '114.1.1.1'
      port: '8086'
      site: 'http://114.1.1.1'
      # cdn: 'http://xxx.com' # 静态资源cdn地址，可省略
      # icon: 'icon.png' # 自定义首页图标，默认路径在 ~/.ssmgr 可省略
      # skin: 'default' # 首页皮肤，可省略
      # googleAnalytics: 'UA-xxxxxxxx-x' # Google Analytics ID，可省略
      gcmSenderId: '456102641793'
      gcmAPIKey: 'AAAAGzzdqrE:XXXXXXXXXXXXXX'
    webgui_telegram: // telegram 机器人的配置，可省略
      use: false
      token: '191374681:AAw6oaVPR4nnY7T4CtW78QX-Xy2Q5WD3wmZ'
    alipay:
      # 如果不使用支付宝，这段可以去掉
      use: false
      appid: 2015012108272442
      notifyUrl: 'http://yourwebsite.com/api/user/alipay/callback'
      merchantPrivateKey: 'xxxxxxxxxxxx'
      alipayPublicKey: 'xxxxxxxxxxx'
      gatewayUrl: 'https://openapi.alipay.com/gateway.do'
    paypal:
      # 如果不使用paypal，这段可以去掉
      use: false
      mode: 'live' # sandbox or live
      client_id: 'At9xcGd1t5L6OrICKNnp2g9'
      client_secret: 'EP40s6pQAZmqp_G_nrU9kKY4XaZph'

  db: 'webgui.sqlite'
  ```

三条命令:

1. 启动该服务器上的`shadowsocks`

    ```bash
    # ss-manager -m aes-256-cfb -u --manager-address 127.0.0.1:4000
    ```

1. 启动该服务器的管理程序

    ```bash
    # ssmgr -c ss.yml
    ```

1. 启动WebGUI

    ```bash
    # ssmgr -c webgui.yml
    ```

每个命令窗口没报错就OK了. 浏览器打开`http://114.1.1.1:8086`, 能访问到就ok~

## 其他

### 关于screen

当然关于命令行, 建议用工具维护. 我这里还没学会怎么使用`pm2`, 就粗略的学习了一下`screen`, 参考[linux screen 命令详解](https://www.cnblogs.com/mchina/archive/2013/01/30/2880680.html)

反正就是`screen -S s1`, 跑完`命令1`, 按`C-a c`再跑`命令2`, 再按`C-a c`再跑`命令3`, 最后`C-a d`回到原始界面, 输入`screen -ls`, 应该就看到3个`(Detached)`了, 类似下面

```bash
[root@server ~]# screen -ls
There are screens on:
        22272.test      (Detached)
        18927.a (Detached)
        18866.a (Detached)
        18778.shadowsocks       (Detached)
4 Sockets in /var/run/screen/S-root.
```

然后用`screen -r 22272`这样切换.

### 关于WebGUI邮箱配置

我搞了一天. 先是注册了一个aol邮箱, 做smtp, 结果被封了, 还不知道原因, 查了好久才知道当spam垃圾邮箱发送器了.

又看教程, 用`mailgun`, 也注册了一个, 坑爹的还要给用户加白名单, 一开始完全看不懂是个什么逻辑, 折腾一晚上, 才搞明白, 以为给配一个域名就行了. 结果还是不行. 气死了.

> 之前没找到, 后来问了下, 仔细找了找, 用户设置(Account - Settings - Details - Payment Method)这里可以免费绑定信用卡, 大概是每月限制发送`2100`条, 基本上OK啦

又想着给之前虚拟主机送的邮箱来搞, 结果也没搞成, 总是失败, 没查出来, 看样子我要自己搭一个邮箱服务器了.

这几天真是累啊. 又是赶项目学习VUE, 又是搞服务器. 好想休息几天.