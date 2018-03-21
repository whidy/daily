# CentOS 7下搭建Wordpress博客方法


## 安装LAMP

https://www.digitalocean.com/community/tutorials/how-to-install-linux-apache-mysql-php-lamp-stack-on-centos-7

sql root 密码 123654

```
删除匿名
Remove anonymous users? [Y/n] y
 ... Success!
```

```
Disallow root login remotely? [Y/n] n
 ... skipping.
```

```
Remove test database and access to it? [Y/n] n
 ... skipping.
```

```
Reload privilege tables now? [Y/n]
 ... Success!

Cleaning up...
```

## 安装`phpMyAdmin`


## 安装Wordpress(移站)

https://www.digitalocean.com/community/tutorials/how-to-install-wordpress-on-centos-7

不过我是直接备份了sql文件, 备份了wordpress的原始文件, 拷贝到腾讯云服务器上面, 修改wordpress目录下的配置, 连接新的数据库, 并通过下面安装的`phpMyAdmin`来修改数据库对应的`options`相关配置, 防止后台登陆直接跳转到旧的地址(目前域名还未重新指向新的服务器IP)

## 其他

[Initial Server Setup with CentOS 7](https://www.digitalocean.com/community/tutorials/initial-server-setup-with-centos-7)