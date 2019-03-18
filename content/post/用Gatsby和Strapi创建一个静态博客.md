+++
title = "用Gatsby和Strapi创建一个静态博客(翻译和自己探索过程中的经验总结)"
date = "2018-02-13"
author = "whidy"
+++

# 用Gatsby和Strapi创建一个静态博客(翻译和自己探索过程中的经验总结)

> 原文参阅: [Building a static blog using Gatsby and Strapi](https://hackernoon.com/building-a-static-blog-using-gatsby-and-strapi-8b5acfc82ad8)或<https://blog.strapi.io/building-a-static-website-using-gatsby-and-strapi/>. 本篇主要是对其精华内容进行翻译, 以及实操过程中遇到的问题解决和探索. 一些具体的操作步骤和细节, 我将忽略, 结合原文一起阅读效果更佳!
>
> 注: 本文操作环境是Linux VPS, CentOS 6 64bit

## 介绍

这是一个包含很多静态内容页面的站点, 从技术上来说就如同一系列HTML文件, 展示给访问者. 与动态网站不同的是, 他不需要后端开发或者数据库支撑. 发布静态站点之所以容易, 是因为文件只需要上传到服务器或者存储器. 没有额外的渲染页面的请求, 也没有数据库被黑的风险, 所以它既安全也快速.

为了快速建站, 其实很多开源的静态页面生成框架可用, 比如前阵子我搞的Jekyll, Hugo, 好似国人偏爱的Hexo等等, 他们的工作原理相似, 内容都是通过静态文件(比如Markdown)或者带有内容的API, 通过获取这些内容, 注入到开发者做好的模板, 最后生成一大堆HTML文件.

Progressive Web Apps (PWA)实际上是网页应用, 几乎基于Javascript, 并且可靠, 快速, 有吸引力的. 这几年比较火的Angular, Vue, React都是类似的前端框架.

> 静态站点遇见了PWA就产生了Gatsby

将这两点组合起来的最佳选择看起来就是Gatsby了, 但是同样需要一个内容接口, 这就是我将要展示的, 通过Strapi创建一个内容API提供给Gatsby, 然后打包发布出一个静态站点.

### Gatsby是什么

这个并不是型男熟知的杰士派, 虽然我也用过这个发泥, 好像不是很好用. **[Gatsby](https://www.gatsbyjs.org/)是基于React的快速静态网站框架**, 有了它, 你就可以感觉飘飘然的开发React网站了.

### Strapi是什么

[Strapi](https://strapi.io/)是一个基于高级的Nodejs API内容管理框架. 听起来有点绕口, 通俗来说就是**让你能简单, 安全, 高效的开发出强大API的开源的内容管理框架**. 它是免费的, 人们都爱免费的, 可以随意在你的服务器上使用, 也非常具有可个性化, 可扩展性的玩意.

> 我真想不到国内几乎没有人用Gatsby和Strapi, 百度上查不到任何资料...

## 创建API

见证奇迹的时刻即将到来, 我们快创建个Strapi API, 添加点内容吧!

### 创建Strapi项目

> Requirements: please make sure **Node 8** (or higher) and **MongoDB** are installed and running on your machine.

此时, 暗喜前阵子已经琢磨出来了并装好了`Node 8`, 不过装MongoDB就没有了. 因此这里就要插入一段关于MongoDB的内容了. 如果已经有了请自动跳过此内容.

#### MongoDB安装及相关问题

果断找到文档[Install MongoDB Community Edition on Red Hat Enterprise or CentOS Linux](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-red-hat/), 这个redhat和centOS应该是通用的吧- -! 看到[Configure the package management system (yum).](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-red-hat/#configure-the-package-management-system-yum), 发现原来还有这种操作, 创建repo文件, 来安装对应版本的软件. 闲话少说, 直接上代码:

```bash
# cd /etc/yum.repos.d/
# touch mongodb-org-3.6.repo
# vi mongodb-org-3.6.repo
```

将以下内容copy进去保存

```text
[mongodb-org-3.6]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/redhat/$releasever/mongodb-org/3.6/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://www.mongodb.org/static/pgp/server-3.6.asc
```

再进行安装

```bash
# sudo yum install -y mongodb-org
```

> 如果有特殊需求, 请参阅上文提到的官方文档, 我这里装的是MongoDB Community Edition

按以上步骤很快就装好了. 接下来启动mongod(如果没有启动的话), 如下命令:

```bash
# service mongod start
```

完成后, 我们接着**创建Strapi项目**的主题, 推荐安装`strapi@alpha`版本:

```bash
# npm i strapi@alpha -g
```

完成后, 去到你要创建本文项目的目录, 比如我这里的路径是`/home/web/`, 我在这里创建一个`gatsby-strapi-tutorial`目录:

```bash
# mkdir gatsby-strapi-tutorial
```

在这里面搭一个API脚手架

```bash
# cd gatsby-strapi-tutorial
# strapi new api
```

进入项目目录, 并运行Node.js服务器

```bash
# cd api
# strapi start
```

#### 遇到了一些小问题

这里突然时不时卡住了, 如果你很顺利, 那么可以跳过此内容, 频繁报错如下

```bash
[root@whidy api]# strapi start
DEBUG (24910 on whidy): Server wasn't able to start properly.
ERROR (24910 on whidy): (hook:mongoose) takes too long to load
```

大概是网络原因, 我联通网络出问题, 换了电信几番尝试就好了.

> 操作过程中频繁出现刚才的问题, 我觉得不是网络问题那么简单, 我打算从数据库方面着手完善一下试试, 当然后来证明, **一切问题都与MongoDB无关**, 所以下面缩进内容可以选择性阅读
>
> 大多数情况下我是不愿意理睬WARNING信息的, 只要不是ERROR就好, 但是这次我有点不爽, 后来折腾了半天发现有的很难处理, 好吧我错了, 我想我还是不死磕了吧😱.

* soft rlimits too low

  ```bash
  WARNING: soft rlimits too low. rlimits set to 1024 processes, 64000 files. Number of processes should be at least 32000 : 0.5 times number of files.
  ```

  参阅:

  * [MongDB 启动警告 WARNING: soft rlimits too low](http://blog.csdn.net/kk185800961/article/details/45613267)
  * [How to set ulimits for mongod?](https://serverfault.com/questions/591812/how-to-set-ulimits-for-mongod)

* versions of RHEL older than RHEL6

  ```bash
  WARNING: You are running in OpenVZ which can cause issues on versions of RHEL older than RHEL6.
  ```

  服务器硬件限制? 可以安全忽略.

  参阅: [WARNING: You are running in OpenVZ which can cause issues on versions of RHEL older than RHEL6.](https://groups.google.com/forum/#!msg/mongodb-user/61NFaGlyxcs/YGkIGv5RDgAJ)

* Access Control
  以为要搞账户什么的, 然后运行`mongo`命令, 创建了一个admin账户:

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

  其实我自己当时也不知道是搞啥, 其实完全没关系的操作. 很多人甚至官方文档[Start MongoDB without access control.](https://docs.mongodb.com/master/tutorial/enable-authentication/#start-mongodb-without-access-control)也提到:

  ```bash
  mongod --port 27017 --dbpath /data/db1
  ```

  可是我一直报错, 要么说不存在, 搞半天才明白, **要手动创建**, 创建好了, 又说服务被占用, `service mongod stop`停了服务, 连上去了, `show dbs`发现跟之前的又不一样, 没有找到我之前看到的`strapi`库, 才恍然大悟, 原来其实我创建了一个跟之前无关的库...

  事实上, 启动mongod服务的时候, 它连接了一个默认配置库, 这个库的路径时早就创建好的, 通过查看`/etc/mongod.conf`这个文件就知道了. 因此删了那个没用的db目录. 接着操作.

  后来第二天早上, 再次执行`strapi start`很顺利. 我也没办法再研究昨天究竟是为什么总是连不上了. 反正就是渣渣网络经常会带来各种坑!😡, 这段没什么作用的内容就过去了.

回到刚才`strapi start`, 成功之后, 我们如果是本地操作的, 带有界面的操作系统的话就可以直接访问<http://localhost:1337/admin>了, 如果也是远程操作, 就改成IP就好了.

> 接下来的操作是创建用户, 原文已经图文并茂, 傻子都能看懂的步骤了, 由于篇幅过大, 我就简单翻译一下, 不详细复述了嘿嘿~

按照原文操作:

1. 创建管理员账号(Create your first User)
1. 创建内容类型(Create a Content Type)
  名为`article`的内容类型有三个字段: `title`(字符串), `content`(文本), `author`(关系, 多文章对应一个用户).
1. 添加几项内容到数据库
    1. 访问文章列表页
    1. 点击`Add New Article`
    1. 插入值, 连接对应的作者并保存
    1. 重复以上操作, 创建额外两篇文章
1. 允许API权限, 依原文对应勾选保存

完成后, 就可以访问<http://localhost:1337/article>了.

## 创建静态站

> 到目前, 你的API搞定了, 我们要搞静态网站啦

### 安装Gatsby

首先, 全局安装Gatsby CLI:

```bash
# npm install --global gatsby-cli
```

### 生成Gatsby项目

回到之前提到的`gatsby-strapi-tutorial`目录, 创建一个新博客:

```bash
# gatsby new blog
```

> 事情总是不是那么顺利.

报错, 需要`git`. 然而我的这台崭新的服务器还没装, 那就装一个吧.

> 如果你的git已经部署OK, 并且上面这个操作没有问题, 以下内容可忽略:

参考[Download for Linux and Unix](https://git-scm.com/download/linux)执行:

```bash
# yum install git
```

再次执行后依旧报错(当前git版本`1.7.1`)

```bash
error Command failed: git clone git://github.com/gatsbyjs/gatsby-starter-default.git blog --single-branch
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

接下来我们再一次执行`gatsby new blog`, 我擦还提示刚才的`...single-branch`的error, 这就坑爹了- -. 经过简短的排查. 原来似乎他还是跑的旧版git, 需要删掉之前yum自动安装的`git 1.7.1`, 我单纯的以为直接自动升级了. 于是:

```bash
# yum remove git
```

按照提示删除成功后, 再次检测git还是ok的, 这次我第三次执行`gatsby new blog`, 终于成功了!

> 我这小白也不知道linux软件管理是咋整的. 反正能继续执行卡了我半天的gatsby就好了吧...
>
> 每次创建速度很慢, 执行`gatsby new blog`完成的时候提示`added 1398 packages in 137.652s`, 大概就是2分钟多, 可能是安装依赖包费时吧

### 启动开发模式

创建成功后, 接着操作, 进入博客目录

```bash
# cd blog
```

启动服务器

```bash
# gatsby develop
```

理论上你就可以通过<http://localhost:8000>访问到默认的效果博客站点了.

> 然而又一次出现小插曲, 如果你是和我一样**远程访问**, 也许以下内容对你有用
>
> 每次执行`gatsby develop`的时间甚至更长, 完成时提示如下:
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

因此, 从小插曲中来看, 远程访问控制的开发者, 需要加个参数, 具体命令:

```bash
# gatsby develop --host 0.0.0.0
```

这样, 至此开发模式服务器搞定.

## 安装Strapi插件(Install the Strapi source plugin)

> Gatsby understands this pretty well. So its creators decided to build a specific and independent layer: the data layer. This entire system is strongly powered by GraphQL.

前面有一些插件介绍不多说了, 执行安装:

```bash
# npm install --save gatsby-source-strapi
```

完成后, 需要做些配置, 修改`gatsby-config.js`文件, 替换成以下内容:

```javascript
module.exports = {
  siteMetadata: {
    title: `Gatsby Default Starter`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-strapi`,
      options: {
        apiURL: `http://localhost:1337`,
        contentTypes: [ // List of the Content Types you want to be able to request from Gatsby.
          `article`,
          `user`
        ]
      },
    },
  ],
}
```

保存后, 重启Gatsby服务器

### 文章列表

为了在首页显示文章列表, 我们需要修改首页代码如下:

路径: `src/pages/index.js`

```javascript
import React from 'react'
import Link from 'gatsby-link'
const IndexPage = ({ data }) => (
  <div>
    <h1>Hi people</h1>
    <p>Welcome to your new Gatsby site.</p>
    <p>Now go build something great.</p>
    <ul>
      {data.allStrapiArticle.edges.map(document => (
        <li key={document.node.id}>
          <h2>
            <Link to={`/${document.node.id}`}>{document.node.title}</Link>
          </h2>
          <p>{document.node.content}</p>
        </li>
      ))}
    </ul>
    <Link to="/page-2/">Go to page 2</Link>
  </div>
)
export default IndexPage
export const pageQuery = graphql`
  query IndexQuery {
    allStrapiArticle {
      edges {
        node {
          id
          title
          content
        }
      }
    }
  }
`
```

这里就应用到了GraphQL啦, 好激动呢. 我们导出`pageQuery`, 一个GraphQL查询会请求文章列表, 我们只需要将需要查询的字段添加进去就好了~

然后我们传递`{ data }`这个结构对象作为`IndexPage`参数, 遍历它的`allStrapiArticles`对象, 来展示数据.

> GraphQL查询可以快速生成, 你可以尝试在<http://localhost:8000/___graphql>修改, 并测试.

### 文章页

首页有了列表之后, 我们还要访问文章页面呢, 接下来写一个模板:

路径: `src/templates/article.js`

```javascript
import React from 'react'
import Link from 'gatsby-link'
const ArticleTemplate = ({ data }) => (
  <div>
    <h1>{data.strapiArticle.title}</h1>
    <p>by <Link to={`/authors/${data.strapiArticle.author.id}`}>{data.strapiArticle.author.username}</Link></p>
    <p>{data.strapiArticle.content}</p>
  </div>
)
export default ArticleTemplate
export const query = graphql`
  query ArticleTemplate($id: String!) {
    strapiArticle(id: {eq: $id}) {
      title
      content
      author {
        id
        username
      }
    }
  }
`
```

你需要手动创建这个目录和文件, 当然Gatsby并不知道模板何时展示. 每篇文章都需要一个特别的URL, 感谢Gatsby提供的[`createPage`](https://www.gatsbyjs.org/docs/creating-and-modifying-pages)函数.

首先, 我们写个`makeRequest`函数来处理GraphQL请求. 然后通过`createPage`函数使我们在获取的文章列表后为它们创建一个页面, 路径为文章id的URL, 回到`blog`目录, 修改`gatsby-node.js`文件

```javascript
const path = require(`path`);
const makeRequest = (graphql, request) => new Promise((resolve, reject) => {
  // Query for nodes to use in creating pages.
  resolve(
    graphql(request).then(result => {
      if (result.errors) {
        reject(result.errors)
      }
      return result;
    })
  )
});
// Implement the Gatsby API “createPages”. This is called once the
// data layer is bootstrapped to let plugins create pages from data.
exports.createPages = ({ boundActionCreators, graphql }) => {
  const { createPage } = boundActionCreators;
  const getArticles = makeRequest(graphql, `
    {
      allStrapiArticle {
        edges {
          node {
            id
          }
        }
      }
    }
    `).then(result => {
    // Create pages for each article.
    result.data.allStrapiArticle.edges.forEach(({ node }) => {
      createPage({
        path: `/${node.id}`,
        component: path.resolve(`src/templates/article.js`),
        context: {
          id: node.id,
        },
      })
    })
  });
  // Query for articles nodes to use in creating pages.
  return getArticles;
};
```

再次重启Gatsby服务器.

现在你就能通过点击首页的文章进入到文章内容页面了.

### 作者页

虽然这个似乎并不重要, 不过还是加上学习一下吧😁

添加作者页和创建文章页很相似, 我们还是先创建个模板:

路径: `src/templates/user.js`

```javascript
import React from 'react'
import Link from 'gatsby-link'
const UserTemplate = ({ data }) => (
  <div>
    <h1>{data.strapiUser.username}</h1>
    <ul>
      {data.strapiUser.articles.map(article => (
        <li key={article.id}>
          <h2>
            <Link to={`/${article.id}`}>{article.title}</Link>
          </h2>
          <p>{article.content}</p>
        </li>
      ))}
    </ul>
  </div>
)
export default UserTemplate
export const query = graphql`
  query UserTemplate($id: String!) {
    strapiUser(id: { eq: $id }) {
      id
      username
      articles {
        id
        title
        content
      }
    }
  }
`
```

然后再次修改`gatsby-node.js`来创建作者URLs:

```javascript
const path = require(`path`);
const makeRequest = (graphql, request) => new Promise((resolve, reject) => {
  // Query for article nodes to use in creating pages.
  resolve(
    graphql(request).then(result => {
      if (result.errors) {
        reject(result.errors)
      }
      return result;
    })
  )
});

// Implement the Gatsby API “createPages”. This is called once the
// data layer is bootstrapped to let plugins create pages from data.
exports.createPages = ({ boundActionCreators, graphql }) => {
  const { createPage } = boundActionCreators;
  const getArticles = makeRequest(graphql, `
    {
      allStrapiArticle {
        edges {
          node {
            id
          }
        }
      }
    }
    `).then(result => {
    // Create pages for each article.
    result.data.allStrapiArticle.edges.forEach(({ node }) => {
      createPage({
        path: `/${node.id}`,
        component: path.resolve(`src/templates/article.js`),
        context: {
          id: node.id,
        },
      })
    })
  });
  const getAuthors = makeRequest(graphql, `
    {
      allStrapiUser {
        edges {
          node {
            id
          }
        }
      }
    }
    `).then(result => {
    // Create pages for each user.
    result.data.allStrapiUser.edges.forEach(({ node }) => {
      createPage({
        path: `/authors/${node.id}`,
        component: path.resolve(`src/templates/user.js`),
        context: {
          id: node.id,
        },
      })
    })
  });
  // Queries for articles and authors nodes to use in creating pages.
  return Promise.all([
    getArticles,
    getAuthors,
  ])
};
```

重启服务器, 刷新页面, Wow! 大功告成! 时不时很酷!!!

## 原文总结

恭喜, 你成功的创建了一个超快的很好维护的博客! 然后各种夸奖Blabla

接下来做什么呢? 你可以去更多的挖掘Gatsby和Strapi的各种优点, 你可以试着增加这些功能:

* 作者列表
* 文章分类
* 用Strapi API创建评论系统, 或者直接用Disqus
* 当然你也可以试着搞其他站点, 例如电商站, 企业站等等

当然为了进一步方便开发, 你可能需要一个方便的发布在网上的存储载体, Blablabla...

本教程[GitHub源码地址](https://github.com/strapi/strapi-examples/tree/master/gatsby-strapi-tutorial), 你可以clone下来, 运行`npm run setup`, blablabla... 我是个爱研究的人, 我要一步步操作, 才不要clone.

## 个人总结

这次通过Gatsby和Strapi搭建一个简单的博客站点, 还是挺不容易的, 总共花了将近两天的时间. 不过个人感觉还是值得的! 其中有很多地方是可以更加深入的学习和了解的, 这也算初步接触了react, mongodb, graphQL等相关知识实操, 同时也可以在后期完善更多的功能, 了解并学习一些ES6, 模板的写法技巧等等. 也希望通过此次研究以后能更进一步熟悉其他框架, 数据库, 后端等思想~

> 相关参阅汇总
>
> * 本文操作参考[Building a static blog using Gatsby and Strapi](https://hackernoon.com/building-a-static-blog-using-gatsby-and-strapi-8b5acfc82ad8)或 <https://blog.strapi.io/building-a-static-website-using-gatsby-and-strapi/>(如果前面的那个无法访问)
> * Gatsby官方[使用手册](https://www.gatsbyjs.org/docs/)和[开发教程](https://www.gatsbyjs.org/tutorial/)
> * [Strapi文档](https://strapi.io/documentation/)
> * [MongoDB 3.6官方手册](https://docs.mongodb.com/)和runoob上的[MongoDB 教程](http://www.runoob.com/mongodb/mongodb-tutorial.html)
>
> 最后打个小广告, 我有个GitHub项目, 用于记录我每天学习或者瞎折腾的技术, 范围不限, 有兴趣可以star我的[whidy daily](https://github.com/whidy/daily)