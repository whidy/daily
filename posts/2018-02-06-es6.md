---
layout: post
title: "ECMAScript6入门"
date: 2018-02-06
categories: es6 function
---
> 2018年2月6日 晴 一般

# ECMAScript6入门

今天肚子不舒服状态不佳, 粗略的把第[6.数值的扩展](http://es6.ruanyifeng.com/?search=%E8%A7%A3%E6%9E%84&x=10&y=8#docs/number)看完了. 感觉就是Math相关方法太多了, 我肯定记不住了.大概留点印象吧.

## 函数的扩展

然后接着看[7.函数的扩展](http://es6.ruanyifeng.com/?search=%E8%A7%A3%E6%9E%84&x=10&y=8#docs/function)

### 参数默认值的位置

* 只有函数的尾参数可以省略
  ```javascript
  function f(x, y = 5, z) {
    return [x, y, z];
  }
  f() // [undefined, 5, undefined]
  f(1) // [1, 5, undefined]
  f(1, ,2) // 报错
  f(1, undefined, 2) // [1, 5, 2]
  ```
* 如果传入`undefined`，将触发该参数等于默认值，`null`则没有这个效果。
* 函数也是有`length`属性的, 但是有个特点, 它依次计算至有参数默认值为止, 加入第一个就有参数, 那长度以然是`0`.
  ```javascript
  (function (a) {}).length // 1
  (function (a = 5) {}).length // 0
  (function (a, b, c = 5) {}).length // 2
  (function(...args) {}).length // 0
  (function (a = 0, b, c) {}).length // 0
  ```