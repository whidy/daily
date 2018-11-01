# Javascript事件循环入门到“忘记”（二）

> 本文主要介绍Javascript事件循环在**Node.js**上的一些特性和应用介绍。

## 示例

* 基于JQuery的Ajax示例

  ```javascript
  // This is assuming that you're using jQuery
  jQuery.ajax({
    url: 'https://api.example.com/endpoint',
    success: function(response) {
      // This is your callback.
    },
    async: false // And this is a terrible idea
  });
  // 原文網址：https://itw01.com/2Z6WE2L.html
  ```

## 其他

* 参考（★表示推荐等级）

1. [深入理解事件迴圈和非同步流程控制](https://itw01.com/2Z6WE2L.html) ★★★★☆
1. [深入理解js事件循环机制（Node.js篇）](http://lynnelv.github.io/js-event-loop-nodejs)

* 扩展

  回调地狱