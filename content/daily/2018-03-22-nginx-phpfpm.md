+++
title = "Nginx的站点配置/PHP-FPM配置"
date = "2018-03-22"
author = "whidy"
+++
> 2018年3月22日 晴 一般

# Nginx的站点配置/PHP-FPM配置

22号是艰难的一天. 各种爆炸!

## Nginx的站点配置

> 昨晚, 回去看了一下百度统计, 一下子就炸了. 在我还不了解Nginx配置的情况下, 我只是让首页正常访问了... 其他页面全挂. 于是开始了大量英文资料的阅读.

以下内容围绕`nginx.conf`配置文件展开, 也不知道是不是版本区别, 总跟网上的文章有些不一样, 我也陷入迷茫.

我要解决的问题:

1. 博客所有页面(包括文章伪静态)访问正常;
1. 其他域名(`whidy.net`, `whidy.cn`, `www.whidy.cn`)均需要**301转向**到`www.whidy.net`, 避免分权
1. 针对`wordpress`的相关优化(可选)

那么, 基于`Nginx`对服务器的管理的研究, 我发现其主要针对不同的站点进行`Server Block`配置, 而`Server Block`如何管理, 我查了大量资料, 比如这里有一篇文章摘要

> To begin, we will need to set up the directory that our server blocks will be stored in, as well as the directory that tells Nginx that a server block is ready to serve to visitors. The `sites-available` directory will keep all of our server block files, while the `sites-enabled` directory will hold symbolic links to server blocks that we want to publish. 

参阅: [How To Set Up Nginx Server Blocks on CentOS 7](https://www.digitalocean.com/community/tutorials/how-to-set-up-nginx-server-blocks-on-centos-7)

简单来说, 他建议在Nginx配置管理目录下创建两个目录, `sites-available`是用于存放可用的站点配置, `sites-enabled`则是存放`sites-available`内的配置软链接过来的, 将要生效在`nginx.conf`中

先介绍下情况, 我的`wordpress`位于`/var/www/`目录下, 那么整个流程如下:

创建刚提到的两个存放站点配置的目录

```bash
# mkdir /etc/nginx/sites-available
# mkdir /etc/nginx/sites-enabled
```

修改`nginx.conf`使刚创建的目录内的配置生效

```bash
# nano /etc/nginx/nginx.conf
```

在`http{}`块内尾部添加

```text
include /etc/nginx/sites-enabled/*.conf;
server_names_hash_bucket_size 64;
```

创建``wordpress.conf``配置文件在`sites-available`内

```bash
# vi /etc/nginx/sites-available/word press.conf
```

编辑内容大致如下:

```text
server {
    server_name www.whidy.net;
    root /var/www/wordpress;
    index index.php index.html index.htm;

    include /etc/nginx/default.d/*.conf;

    location = /favicon.ico {
        log_not_found off;
        access_log off;
    }

    location = /robots.txt {
        allow all;
        log_not_found off;
        access_log off;
    }

    location / {
        try_files $uri $uri/ /index.php?$args;

        if ($http_host ~* "^(www.)?whidy.cn$"){
            rewrite ^(.*)$ https://www.whidy.net/$1 permanent;
        }
        if ($http_host ~* "^whidy.net$"){
            rewrite ^(.*)$ https://www.whidy.net/$1 permanent;
        }
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico)$ {
        expires max;
        log_not_found off;
    }

    location ~ /\.ht {
        deny  all;
    }

    gzip on;
    gzip_vary on;
    gzip_comp_level 2;
    gzip_types text/plain text/html text/css application/json application/x-javascript text/xml application/xml application/xml+rss text/javascript application/javascript;
    gzip_proxied any;
    gzip_min_length 1024;
}
```

保存好后, 还有件事情就是把`nginx.conf`文件内的默认`server block`注释掉, 它会导致wordpress内的301跳转失效. 当然我这分配置的具体说明就不说了, 一时难以讲明白, 建议大家自行谷歌. 也可参考我下面的参阅列表.

接着软链接到`sites-enabled`使配置生效, 命令如下

```bash
# ln -s /etc/nginx/sites-available/wordpress.conf /etc/nginx/sites-enabled/wordpress.conf
```

最好重启nginx服务

```bash
# systemctl restart nginx
```

在浏览器测试一下完美~

参阅:

* Nginx语法: <http://blog.51cto.com/denglz/1341841>
* 网站跳转: <https://www.digitalocean.com/community/tutorials/how-to-create-temporary-and-permanent-redirects-with-nginx>
* Nginx配置参考学习
    * <https://gist.github.com/MaherSaif/1580998>
    * <https://gist.github.com/kjprince/9496501>
    * [wordpress nginx 配置](https://codex.wordpress.org/Nginx)
    * <https://www.nginx.com/resources/wiki/start/topics/recipes/wordpress/>
* [Server Block Examples](https://www.nginx.com/resources/wiki/start/topics/examples/server_blocks/)

不过后台更新插件时又出现了之前发生的问题: **"要执行请求的操作，WordPress需要访问您网页服务器的权限。"** - -知道是权限问题,却不知道是哪个权限..突然想起nginx的php管理是php-fpm...

```bash
# chown -R php-fpm:php-fpm /var/www/wordpress
```

就好了..

### 配置另一个站点

首先我创建了一个`Jekyll`站点, 它生成的静态目录在`/home/whidy/blog/_site`的时候. 而`nginx`管理网站的目录是`/var/www/`, 我这里为了方便管理创建了软连接, 如下

```bash
# ln -s /home/whidy/blog/_site /var/www/blog
```

配置了`server block`, 如下

```txt
server {
    listen 80;
    server_name test.whidy.net;
    root /var/www/blog;
    index index.html index.htm;

    location / {
    }

    error_page 404 /404.html;
        location = /40x.html {
    }

    error_page 500 502 503 504 /50x.html;
        location = /50x.html {
    }
}
```

然后访问网站出现`403`, 查了很多资料, 不确定是否跟软链接有关, 后来查出来了, 因为我当前运行nginx的用户是`nginx`(命令查看: `ps -ef | grep nginx`), 那么**nginx没有权限访问用户whidy的目录及文件**, 本以为给`_site`目录设置可读就行了, 然后还是`403`, 为此折腾了很久, 才查到原来同时还**需要给nginx一个可读whidy目录的权限**! 也就是说此时必须同时给`/home/whidy/blog/_site`(包含_site内的所有文件)和`/home/whidy`目录可读权限才能正常访问

```bash
# chmod +r -R /home/whidy/blog/_site
# chmod +r /home/whidy
```

无需重启Nginx服务, 刷新页面然后就好了.

> 很奇怪的是, 我假设给blog目录不设置全部可读, 它照样正常. 真是蛋疼~

相关阅读: [理解 Linux 的硬链接与软链接](https://www.ibm.com/developerworks/cn/linux/l-cn-hardandsymb-links/index.html)

## PHP-FPM配置

我很奇怪, 都说`Nginx`内存占用比`Apache`少, 可是自从我换了`Nginx`后, `MariaDB`崩溃问题不断, 起初以为是`MariaDB`的问题, 越发频繁的内存暴增引起我对内存的注意, 于是看看内存使用情况后发现, 存在大量的`php-fpm`进程, 至少占用了几百兆内存.

查看内存使用情况:

```bash
# ps -e -o 'pid,comm,args,pcpu,rsz,vsz,stime,user,uid'
```

然后通过搜索**PHP-FPM内存占用**的问题, 网上也有很多, 默认状态下它会动态分配很多子进程, 这有篇文章简单介绍了一下[nginx+php-fpm模式php内存泄漏探究](https://www.jianshu.com/p/9450ab506446), 那么解决占用内存的方法看来只有从PHP-FPM配置文件上下手了.

谷歌了相关资料, 目前经测试比较好用的方法就是修改文件

```bash
# vi /etc/php-fpm.d/www.conf
```

找到`pm = dynamic`(默认值), 改成`pm = ondemand`, 以及`pm.process_idle_timeout = 10s`去掉注释, 保存并重启服务

```bash
# systemctl restart php-fpm
```

经过两天的观察, 内存使用稳定在300M以内, 比较满意了. 不过为什么会内存溢出呢, 真是不稳定哎~

参阅: [How to reduce PHP-FPM (php5-fpm) RAM usage by about 50%](http://linuxbsdos.com/2015/02/17/how-to-reduce-php-fpm-php5-fpm-ram-usage-by-about-50/)

> 完成22号的日志现在已经是 3-23 23:56, 最近实在是太忙了. 昨晚小程序上线出BUG, 搞到快晚上11点才回去, 也有些经验要总结. 今天先到这吧