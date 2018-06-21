---
layout: post
title: "使用Axios以formData格式提交带有文件的表单"
date: 2018-06-11
categories: formdata vue axios form 
---
> 2018年6月11日 晴 一般

# 包含文件上传的表单提交总结

> 做Vue项目的时候, 提交数据基本上都是用Axios, 之前做过的表单方面的提交, 并没有过多关注客户端和服务器之间的通信过程. 所以一直对HTTP的head请求头, body内容之类的不明不白, 为了短期(是的估计过半年又忘了😂)解决这个疑惑, 再次复习了一遍. 顺便总结了**Vue中使用Axios处理包含上传文件的表单提交**

## 场景说明

项目使用的Vue(Nuxt)框架, 数据请求用的[Axios](https://github.com/axios/axios)插件, 表单包含了一些基本的用户信息填写, 同时还有身份证上传, 和后端沟通过, 提交数据的时候, 接口全部使用[POST](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Methods/POST)请求, 那么有文件上传的一般来说只能用formData格式

我项目中使用的是ElementUI, 起初

multipart/form-data

https://developer.mozilla.org/zh-CN/docs/Web/API/FormData

https://developer.mozilla.org/zh-CN/docs/Web/API/FormData/Using_FormData_Objects

https://github.com/axios/axios/issues/318#issuecomment-218948420