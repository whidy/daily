---
layout: post
title: "ECMAScript6入门/JS事件"
date: 2018-01-30
categories: es6 javascript event
---
> 2018年1月30日 小雨 无聊

# ECMAScript6入门 / JS事件

## 模板字符串(Template literals)中的标签模板

> [模板字符串](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/template_strings)非常棒的功能, 减少了HTML拼接的繁琐, 其中[标签模板](http://es6.ruanyifeng.com/?search=%E8%A7%A3%E6%9E%84&x=10&y=8#docs/string#%E6%A0%87%E7%AD%BE%E6%A8%A1%E6%9D%BF), 这个东西初看起来很奇怪, 多结合实例会好理解一些.
>
> 以下结合MDN和ECMAScript6入门做个笔记
>
> 标签函数的第一个参数包含**一个字符串值的数组**。其余的参数与表达式相关。

来看看这个例子:

```javascript
let a = 5;
let b = 10;

tag`Hello ${a + b} world ${a * b}`;
// 等同于
tag(['Hello ', ' world ', ''], 15, 50);
```

个人理解: 简单的说, \`Hello ${a + b} world ${a * b}\` 会被表达式(例如: `${a + b}`)分割一个包含多个字符串的数组(即`['Hello ', ' world ', '']`), 需要注意的是`${a * b}`后面还有个`''`(其实似乎也可以认为有`n`个表达式, 就有`n+1`个字符串长度的数组), 而表达式部分会按顺序作为参数传入自定义的`tag`方法. 以下实例证明:

```javascript
let a = 5;
let b = 10;

function tag(s, v1, v2) {
  console.log(s[0]);
  console.log(s[1]);
  console.log(s[2]);
  console.log(v1);
  console.log(v2);

  return 'OK';
}

tag`Hello ${a + b} world ${a * b}`;
// "Hello "
// " world "
// ""
// 15
// 50
// "OK"
```

> MDN上面还有一些相对复杂的示例, 建议也去了解下, 自己做个总结后, 理解和印象深刻了许多

## javascript事件

参阅[Event order](https://www.quirksmode.org/js/events_order.html),[StackOverflow: addEventListener vs onclick](https://stackoverflow.com/questions/6348494/addeventlistener-vs-onclick)以及[MDN: EventTarget.addEventListener()](https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/addEventListener)做了一些简单的总结.

老实说, 看一天es6真的很累. 索性去看了些别的. 正巧看到关于事件相关的知识点, `addEventListener`和`onclick`这类事件绑定的区别是什么呢?

`addEventListener`是一个相对好的为元素添加事件的方法, 并且可以重复绑定, 有很多可选参数可以控制事件以`捕获`(capture)还是`冒泡`(bubble)来处理.

如果是`true`则是捕获, `false`则是冒泡, 捕获是从外部向内部传递, 冒泡反之.

`onclick`则是默认冒泡的, 另外由于事件触发不断向父级传递, 因此可能会触发父级的其他事件, 因此需要阻止冒泡. 也就需要用到`e.stopPropagation()`, 尤其在拖拽事件上面的处理, 这个就显得尤为重要!

另外`addEventListener`的参数相当的多, MDN上面介绍了一些它的特点, 比如**处理过程中 this 的值的问题**,

有一段代码不太常见的, 是`bind`相关的例子：

```javascript
var Something = function(element) {
  // |this| is a newly created object
  this.name = 'Something Good';
  this.onclick1 = function(event) {
    console.log(this.name); // undefined, as |this| is the element
  };
  this.onclick2 = function(event) {
    console.log(this.name); // 'Something Good', as |this| is bound to newly created object
  };
  element.addEventListener('click', this.onclick1, false);
  element.addEventListener('click', this.onclick2.bind(this), false); // Trick
}
var s = new Something(document.body);
```

还有一个[`使用 passive 改善的滚屏性能`](https://developers.google.com/web/updates/2016/06/passive-event-listeners)是值得注意的:

```javascript
var elem = document.getElementById('elem'); 
elem.addEventListener('touchmove', function listener() { /* do something */ }, { passive: true });
```

而onclick可能会由于重复事件被覆盖的危险.

## 其他

一早上想起昨天在SegmentFault看到一篇译文[编程技巧：尝试不用 If 语句编程](https://segmentfault.com/a/1190000013036227), 也读了一下原文, 感觉思路还是挺不错的. 其中示例二中运用了`return`中的`or`操作符技巧. 对应变量的属性中的对象, 返回不同的值, 很棒!
