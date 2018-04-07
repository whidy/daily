# Wordpress博客转换成Jekyll尝试

> 想来想去还是想试试把我的博客转成Jekyll, 一方面为了git管理, 另一方面实在是感觉请求过多速度太慢, 可改造性太差. 经过迁移后, 默认主题, 速度杠杠的, 显示时间不到`500ms`哦~

## 安装Jekyll(CentOS7)

> 本文在CentOS7环境下才操作

### 环境需要

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

## Wordpress站点迁移至Jekyll全过程

> 官方有迁移文档, 支持很多种类型的博客迁移, 所以看起来也就比较简单了, 官方文档[Import your old & busted site or blog for use with Jekyll.](http://import.jekyllrb.com/), 我们来尝试Wordpress迁移.

先按照他的示例, 按照自己的网站进行修改, 大致如下

```bash
$ ruby -rubygems -e 'require "jekyll-import";
    JekyllImport::Importers::WordPress.run({
      "dbname"   => "yourWordpressDatabaseName",
      "user"     => "root",
      "password" => "IcannotTellYou",
      "host"     => "localhost",
      "port"     => "3306",
      "socket"   => "",
      "table_prefix"   => "wp_",
      "site_prefix"    => "",
      "clean_entities" => true,
      "comments"       => true,
      "categories"     => true,
      "tags"           => true,
      "more_excerpt"   => true,
      "more_anchor"    => true,
      "extension"      => "html",
      "status"         => ["publish"]
    })'
```

保证配置无误后, 回车, 执行报错!

```text
Traceback (most recent call last):
        1: from /home/whidy/.rbenv/versions/2.5.0/lib/ruby/2.5.0/rubygems/core_ext/kernel_require.rb:59:in `require'
/home/whidy/.rbenv/versions/2.5.0/lib/ruby/2.5.0/rubygems/core_ext/kernel_require.rb:59:in `require': cannot load such file -- ubygems (LoadError)
```

蛋疼, 查了下资料说可能是rubygems的bug, 参阅[Ruby [SOLVED]: After ruby update to 2.5.0, require 'bundler/setup' raise exception](http://www.cloudypoint.com/Tutorials/discussion/ruby-solved-after-ruby-update-to-2-5-0-require-bundlersetup-raise-exception/), 然后看了下, 貌似真的是的, 立马升级

```bash
$ gem update --system
```

我说gem安装非常坑爹, 毫无提示, 都不知道是不是正在处理执行的命令, 其实已经在执行了, 根据网络情况多等待一下. 接着唰唰唰的出来一大段, 一直到出现`RubyGems system software updated`, 就更新完了, 我们再尝试迁移命令... 又报错!!!

```text
Traceback (most recent call last):
        2: from -e:1:in `<main>'
        1: from /home/whidy/.rbenv/versions/2.5.0/lib/ruby/site_ruby/2.5.0/rubygems/core_ext/kernel_require.rb:59:in `require'
/home/whidy/.rbenv/versions/2.5.0/lib/ruby/site_ruby/2.5.0/rubygems/core_ext/kernel_require.rb:59:in `require': cannot load such file -- jekyll-import (LoadError)
```

蛋疼, 上次不是装了吗, 还是我记错了. 好吧再装一遍

```bash
$ gem install jekyll-import
```

然后再执行, 反复报错... 于是反复执行各种依赖包... 总结如下

```bash
$ gem install sequel
$ gem install unidecode
$ gem install mysql2
```

这里说要`mysql2`, 然后执行上面的命令报错, 又说要`mysql-devel`, 服了- -, 那只能一步步试试看了.

```bash
$ yum install mysql-devel
```

接着试

```bash
$ gem install mysql2
```

再跑迁移命令, 继续报错... 信息如下

```text
         1: from /home/whidy/.rbenv/versions/2.5.0/lib/ruby/gems/2.5.0/gem
/home/whidy/.rbenv/versions/2.5.0/lib/ruby/gems/2.5.0/gems/mysql2-0.5.0/li
111) (Sequel::DatabaseConnectionError)
```

查到说是要填写刚才迁移命令里面的socket, 这个填啥呢, 我查了半天有各种各样的, 比如`/var/run/mysqld/mysqld.sock`, `/tmp/mysql.sock`等等, 可能是他们都是`mysql`, 而我是MariaDB, 为了从根本问题上下手, 还是看看我的MariaDB的配置文件里面怎么写的吧.

> 这里需要说明的是, 我的Wordpress数据库和要迁移到的Jekyll都在同一服务器上, 因此`host`这里填写的是`localhost`

```bash
$ sudo vi /etc/my.cnf
```

查到`socket=/var/lib/mysql/mysql.sock`, 那么修改迁移配置如下:

```bash
$ ruby -rubygems -e 'require "jekyll-import";
    JekyllImport::Importers::WordPress.run({
      "dbname"   => "yourWordpressDatabaseName",
      "user"     => "root",
      "password" => "IcannotTellYou",
      "host"     => "localhost",
      "port"     => "3306",
      "socket"   => "/var/lib/mysql/mysql.sock",
      "table_prefix"   => "wp_",
      "site_prefix"    => "",
      "clean_entities" => true,
      "comments"       => true,
      "categories"     => true,
      "tags"           => true,
      "more_excerpt"   => true,
      "more_anchor"    => true,
      "extension"      => "html",
      "status"         => ["publish"]
    })'
```

慢慢的, 从前面十几条错误, 减少到了**最后一条**

```text
Could not require 'htmlentities', so the :clean_entities option is now disabled.
```

看来还是比较成功的... 那就装一个试试看吧

```bash
$ gem install htmlentities
```

安装后, 再次执行迁移命令, 搞得心都要碎了... 复制粘贴回车...

额, 没. 有. 任. 何. 反. 应. 的. 结. 束. 了... 难道成功了?

在安装Jekyll的目录下编译一下看看...

```bash
[whidy@VM_0_3_centos blog]$ jekyll b
```

又报错...

```text
Configuration file: /home/whidy/blog/_config.yml
            Source: /home/whidy/blog
       Destination: /home/whidy/blog/_site
 Incremental build: disabled. Enable with --incremental
      Generating...
     ...此处省略字数 哈哈哈...
     Build Warning: Layout 'nav_menu_item' requested in _posts/2012-11-27-1132.html does not exist.
  Liquid Exception: Liquid syntax error (line 40): Variable '{{$r['catid']}}' was not properly terminated with regexp: /\}\}/ in /home/whidy/blog/_posts/2012-11-29-phpcms-page-solution.html
jekyll 3.7.3 | Error:  Liquid syntax error (line 40): Variable '{{$r['catid']}}' was not properly terminated with regexp: /\}\}/
```

查了下大概是说`Liquid`的正则规则, 面对<code>{{</code>这种玩意就挂了. 把它改成<code>{ {</code>, 参阅: [Liquid Exception: Variable '{{ {0}' was not properly terminated with regexp: /\}\}/ in #466](https://github.com/imathis/octopress/issues/466), 然后我就去`_posts`目录把这篇文章手动改了... 再`jekyll b`一下.

```bash
[whidy@VM_0_3_centos blog]$ jekyll b
Configuration file: /home/whidy/blog/_config.yml
            Source: /home/whidy/blog
       Destination: /home/whidy/blog/_site
 Incremental build: disabled. Enable with --incremental
      Generating...
      ... 几十条这样的信息开始...
     Build Warning: Layout 'nav_menu_item' requested in _posts/2012-11-27-1107.html does not exist.
     ... 几十条这样的信息结束...
     Build Warning: Layout 'bnfw_notification' requested in _posts/2018-01-16-%e8%af%84%e8%ae%ba.html does not exist.
     Build Warning: Layout 'nav_menu_item' requested in _posts/2018-02-26-3119.html does not exist.
                    done in 9.708 seconds.
 Auto-regeneration: disabled. Use --watch to enable.
 ```

这样就算完成了? 刷新一下我才配置的Nginx二级域名页面, 方法大致如[原文](https://github.com/whidy/daily/blob/master/posts/2018-03-22-nginx-phpfpm.md#%E9%85%8D%E7%BD%AE%E5%8F%A6%E4%B8%80%E4%B8%AA%E7%AB%99%E7%82%B9), 我靠, 昨天不是搞好了`403`错误吗? 咋又来, 不过不怕, 已经知道是权限问题了, 我们在分析下哪里出问题. (然后一阵胡乱修改权限后就好了- -,), 我认为估计有效的命令是这一条

```bash
# chmod 755 -R /home/whidy/blog/
```

然后刷新页面, 就好了. 当然我这是裸奔的Jekyll, 没有主题, 所以看起来很朴素. 不过还是有些问题的.

![Jekyll迁移图](https://raw.githubusercontent.com/whidy/daily/master/sources/images/2018-03-24-1.png)

比如, 之前加密的单页面被放在导航上了. 文章列表中有一些带数字的文章, 还有评论, 这些本不该存在- -, 所以迁移后的优化也是少不了的, 不过至此关于Wordpress迁移到Jekyll的工作已经完成.

## 迁移后的思考

迁移完成后, 也有一些问题是需要解决的, 大致想到的如下

* 现有的不正确内容的修正(资源文件管理, 文章内图片的链接等)
* 主题及相关功能开发
* 评论系统的植入, 考虑使用disqus
* seo方面, url规则匹配旧的wordpress(考虑Nginx定向或其他方案)
* 其他暂未想到...

> 如果你也想把wordpress站点内容迁移至Jekyll, 阅读该文中发现错误, 或者通过该文示例过程中的尝试发生了一些无法解决的问题, 欢迎留言~