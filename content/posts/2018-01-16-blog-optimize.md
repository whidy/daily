---
layout: post
title: "博客插件优化及其他学习总结"
date: 2018-01-16
categories: wordpress blog javascript
---
> 2018年1月16日 晴 一般

# 博客插件优化 / VSCODE的FTP插件探索 / 不常见的JS写法 / SASS父级选择器写法研究

## Wordpress相关优化更新

1. WP的评论提示插件的更新优化,(由于之前方案较旧,全部更新)

    Comment Reply Notifier插件被删除替代

    WP SMTP插件被删除替代

    Delete-Revision插件被删除替代

    还有几个N年没有更新的无效插件删除

1. 其他的几个插件使用测试及介绍
    1. Better Notifications for WordPress

      功能强大,有很多的类型管理的邮件通知设置,我基本上用不到,而且全英文,有一些学习成本,就放弃使用了,我也就不多做介绍了.

    1. **Comment Reply Email Notification**

      轻量级的专门用于评论邮件通知,安装启用后,每个评论下面会出现一个小的选择框,表示接受回复通知.可以自己修改插件换成中文.当然这个插件只提供评论回复有效,并不会通知站长~

    1. WP Mail SMTP

      用来回复其他人在站点的评论,配置邮件服务器的插件

## Visual Studio Code的ftp插件探索,结论

1. **ftp-sync勉强能用,但是菜单为啥不全,感觉是一个BUG吧.希望后期能够优化.**
1. SFTP/FTP sync总是回莫名其妙的卡住,而且相同文件好像也会再次覆盖,不会跳过.文件比较多的时候不建议使用.
1. ~~ftp-kr跟Simple FTP/SFTP一样没啥暖用,还不如就用ftp软件操作~~
1. ~~Simple FTP/SFTP没啥暖用,还不如就用ftp软件操作~~

## 其他

1. 完成博客内容[怎样找到当前页面发布日期的几种方法](https://www.whidy.net/the-way-to-find-the-publish-date-of-any-web-content.html),并发布在[SegmentFault文章](https://segmentfault.com/a/1190000012858269)

1. 阅读[JS things I never knew existed](https://air.ghost.io/js-things-i-never-knew-existed/),并参阅MDN进行简单总结

   1. 标签语句(标记语句)

   1. void运算符(立即调用的函数表达式, `javascript:` 伪协议来执行 JavaScript 代码是不推荐的, 执行后即销毁?)

   1. 逗号操作符

   1. 条件（三元）运算符(条件为4,赋值为3,均为从右到左,因此先执行条件后赋值,参考[运算符优先级](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Operator_Precedence))

   1. Intl 对象是 ECMAScript 国际化 API 的一个命名空间(可能在数字,货币,日期等方面用到?)

   1. 管道操作符(实验性质,暂时不要使用)

   1. [Array.prototype.reduceRight](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/ReduceRight)(看过很多次经常记不住...)

   1. 多个参数[setTimeout()](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/setTimeout)写法研究

      ```javascript
      function log(text, textTwo) {
        console.log(text, textTwo);
      }
      setTimeout(log, 1000, 'Hello World!', 'And Mars!');
      ```

   1. [HTMLElement.dataset](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLElement/dataset)是一个类似jQuery的.data()使用方法,也能为DOM元素添加属性

1. 阅读[How to do SASS Grandparent Selectors](https://medium.com/@jakobud/how-to-do-sass-grandparent-selectors-b8666dcaf961),文中也提到了[BEM语法](http://getbem.com/)的推荐写法.

   ```scss
   .component {
     $c: &;      // 创建了一个当前类名的变量$c
   }
   ```

   然后利用[Interpolation](http://sass-lang.com/documentation/file.SASS_REFERENCE.html#interpolation_): `#{}`使用这个变量.

   ```scss
   .component {
     $c: &;         // Set the parent as a variable
     padding: 2vw;
     &__card {
       background-color: #FFF;
       &:hover #{$c}__name {   // Use the variable here
         color: #BADA55;
       }
     }
     &__name {
       color: #000;
     }
     &__button {
       background-color: blue;
       color: #FFF;
     }
   }
   ```

   这里需要注意的是,使用变量需要在该变量所声明的作用域内.

   后面讲了个@at-root,不过我很疑惑,他为什么不这样写

   ```scss
   .grid {
     $g: &;
     &__column {
       $c: &;
       color: #000;
       @at-root {
         #{$g}:hover #{$c} {
         color: #blue;
         > div {
           color: red;
         }
       }
      }
     }
   }
   ```

   却要故意调整顺序,写的那么复杂...