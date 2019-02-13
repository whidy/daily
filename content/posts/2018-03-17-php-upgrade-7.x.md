---
layout: post
title: "日志"
date: 2018-03-17
categories: note
---
> 2018年3月17日 阴 一般

# 服务器相关折腾

## CentOS7升级PHP7.2

我有个毛病, 就是喜欢没事搞搞优化, 本来好端端的东西, 一听说还能更好, 就止不住的折腾, 这不, 一个朋友说PHP7性能好很多(顺便查了下, [PHP的性能演进(从PHP5.0到PHP7.1的性能全评测)](http://www.laruence.com/2016/12/18/3137.html)), 我才折腾半天装的PHP5.6, 又寻思着安装到7.x, 好在一切都比较容易, 大概方法如下:

> 在`CentOS 7`上官方的源是只有`php5.4`的, 这个大家都知道了, 于是这次又用到第三方源[IUS repository](https://ius.io/).

假设目前最高权限下, 这里仅介绍Apache下的更新, 还有Nginx的, 末尾有参阅文章自行查阅. 步骤如下:

```bash
# cd ~
# curl 'https://setup.ius.io/' -o setup-ius.sh

# bash setup-ius.sh
```

然后删除旧版

```bash
# yum remove php-cli mod_php php-common
```

接着安装php7.2

```bash
# yum install mod_php72u php72u-cli php72u-mysqlnd
```

重新启动Apache加载新的`mod_php`

```bash
# apachectl restart
```

重启服务

```bash
# systemctl status httpd
```

至此升级完成~

参阅: [How To Upgrade to PHP 7 on CentOS 7](https://www.digitalocean.com/community/tutorials/how-to-upgrade-to-php-7-on-centos-7)

## Wordpress转移至服务器后无法安装插件

转移后, 真是问题多多啊, 发现安装插件又出问题, 看样子是权限不足, 提示`需要访问您网页服务器权限`, 然后让我输入什么FTP的连接信息, 试了下不行.

查了些资料, 执行以下命令:

如果单站点主机

```bash
# chown -R apache:apache /var/www/html
```

如果多站点主机

```bash
# chown -R apache:apache /var/www/
```

虽然还有其他的方法, 不过这个够用就没折腾了哈哈.

参阅: [Wordpress asking for FTP Credentials](https://www.digitalocean.com/community/questions/wordpress-asking-for-ftp-credentials)

## 装了个`LiteSpeed缓存`插件

本来想做图片的按需加载的优化, 太复杂了, 索性就装了个插件, 这个插件还挺牛逼好多合并功能之类的.

但是最重要的是...为什么我没有使用插件的时候约`1.8s-2.4s`, 用了插件就是`2.0s-2.8s`了... 虽然的确可以合并文件, 减少请求, 但是... 结果似乎是负优化啊. 还是先禁用算了.