---
layout: post
title: "postcss插件cssnano"
date: 2018-02-09
categories: postcss cssnano
---
> 2018年2月9日 阴 一般

# postcss插件cssnano

早上看到SegmentFault上有个人请教一个关于插件编译错误的回复<https://segmentfault.com/a/1190000010947054>, 引起了我的好奇, 我便看了下.

关于`postcss-neat`插件使用报错的问题. 我自己测试了一下, 是跟其他的插件有冲突. 后来又发现他发了个提问, 我也顺手回答了[postcss-salad 在用栅格 布局的时候报错？](https://segmentfault.com/q/1010000013217362)

不过由这个引发的我的一些思考:

1. PostCSS插件使用过程中, 如何避免此类问题, 因为对css文件处理顺序产生的冲突编译报错.
1. 在使用`cssnano`和`postcss-salad`该类插件包的时候, 如何配置他们仅使用某些插件或者禁用其中的插件.(我今天花了点时间去查文档没有查到, 抽空进一步研究一下!)

