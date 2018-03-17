---
layout: post
title: "日志"
date: 2018-03-16
categories: note
---
> 2018年3月16日 阴 一般

# 博客转移/域名解析/其他配置

域名解析, 全部设置为A记录指向服务器IP, 然后还是用原来的301转向, `(www.)whidy.cn`和`whidy.net`全部跳转到`www.whidy.net`.

## Apache服务器优化

### Rewrite模块

为了`伪静态`页面和`301重定向`, 这边文章讲得很清楚了[Install and Configure mod_rewrite for Apache on CentOS 7](https://devops.profitbricks.com/tutorials/install-and-configure-mod_rewrite-for-apache-on-centos-7/)

### 开启Gzip压缩功能

#### 方案一: 修改httpd.conf配置

如上文: 打开这个文件

```bash
# nano /etc/httpd/conf.modules.d/00-base.conf
```

检查`mod_deflate module`是否正常开启(默认是开启的)

```
LoadModule deflate_module modules/mod_deflate.so
```

然后修改`httpd.conf`

```bash
# nano /etc/httpd/conf/httpd.conf
```

文件末尾增加

```
AddOutputFilterByType DEFLATE text/plain
AddOutputFilterByType DEFLATE text/html
AddOutputFilterByType DEFLATE text/xml
AddOutputFilterByType DEFLATE text/css
AddOutputFilterByType DEFLATE application/xml
AddOutputFilterByType DEFLATE application/xhtml+xml
AddOutputFilterByType DEFLATE application/rss+xml
AddOutputFilterByType DEFLATE application/javascript
AddOutputFilterByType DEFLATE application/x-javascript
```

重启服务

```bash
# service httpd restart
```

#### 方案二: 修改网站.htaccess文件

你也可以在Apache虚拟主机上通过配置`.htaccess`来开启`gzip compression`, 修改`.htaccess`增加以下代码:

```xml
<Directory /var/www/html/>
   <IfModule mod_mime.c>
	AddType application/x-javascript .js
	AddType text/css .css
   </IfModule>
   <IfModule mod_deflate.c>
	AddOutputFilterByType DEFLATE text/css application/x-javascript text/x-component text/html text/plain text/xml application/javascript
	<IfModule mod_setenvif.c>
		BrowserMatch ^Mozilla/4 gzip-only-text/html
		BrowserMatch ^Mozilla/4.0[678] no-gzip
		BrowserMatch bMSIE !no-gzip !gzip-only-text/html
	</IfModule>
    </IfModule>
    Header append Vary User-Agent env=!dont-vary
</Directory>
```

参阅: [HOW TO ENABLE GZIP COMPRESSION IN APACHE](https://knackforge.com/blog/karalmax/how-enable-gzip-compression-apache)

### 其他服务器优化文章

* [Apache 性能配置优化](https://cloud.tencent.com/developer/article/1004879)
* [apache服务器优化(重要)](https://www.kancloud.cn/curder/apache/91275)

## 其他

晚上突然发现博客不能正常访问了, 提示`Error Establishing a Database Connection`, 我擦, 怎么回事? 记得下班的时候还是好的?

然后想到我的MariaDB的账户是`root`, 密码是`123654`. 还开放了`phpmyadmin`的外网访问权限, 虽然对IP做了域名转向貌似已经无法web管理数据库了, 难道是安全问题?

于是SSH登陆进去, 试着连接数据库操作, 出现以下情况(一脸懵逼)

![error](https://raw.githubusercontent.com/whidy/daily/master/sources/images/2018-03-16-1.png)

然后试着重置一下密码, 也不知道是不是跟这个有关系, 改完`mysql`密码和`wp-config.php`配置后, 博客可以正常访问了.

重置`MariaDB`的`root`密码参阅以下文章:

* [How To Reset Your MySQL or MariaDB Root Password](https://www.digitalocean.com/community/tutorials/how-to-reset-your-mysql-or-mariadb-root-password)
* [How to Install MariaDB on CentOS 7](https://linode.com/docs/databases/mariadb/how-to-install-mariadb-on-centos-7/)

一不小心又折腾到了晚上十二点, 一直被一直吸满血的蚊子骚扰, 打死它就睡觉.