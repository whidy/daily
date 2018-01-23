---
layout: post
title: "null和undefined复习/ES6作用域和babel的探索"
date: 2018-01-23
categories: javascript babel es6
---
> 2018年1月23日 雾霾 一般

# null和undefined复习 / ES6作用域和babel的探索

## 再谈null和undefined

### 什么是null

> `null`具有两大特点

* `null`是空的或者不存在的值
* `null`需要被赋值

例如下面给a赋值为null

```javascript
let a = null;
console.log(a);
// null
```

### 什么是undefined

> `undefined`一般表示一个已声明的变量, 但是没有定义类型

仅声明一个变量b

```javascript
let b;
console.log(b);
// undefined
```

或者直接给c赋值为undefined

```javascript
let c = undefined;
console.log(c);
// undefined
```

或者读取一个不存在某个属性的对象

```javascript
var d = {};
console.log(d.fake);
// undefined
```

### null和undefined相似之处

首先都知道JavaScript中有6种原始数据类型, null和undefined在其中:

* Boolean
* **Null**
* **Undefined**
* Number
* String
* Symbol

正好也有6个[falsy](https://developer.mozilla.org/zh-CN/docs/Glossary/Falsy)值, null和undefined也在里面:

* false
* 0 (zero)
* "" 或者 '' (empty string)
* **null**
* **undefined**
* NaN (Not A Number)

> 如果对truthy和falsy想有更多的了解, 这里推荐两篇文章 [JavaScript — Double Equals vs. Triple Equals](https://codeburst.io/javascript-double-equals-vs-triple-equals-61d4ce5a121a)和[Truthy and Falsy: When All is Not Equal in JavaScript](https://www.sitepoint.com/javascript-truthy-falsy/)

这里有个有趣的现象, 当用`typeof`测试`null`, 会返回`object`(历史原因导致):

```javascript
let a = null;
let b;
console.log(typeof a);
// object
console.log(typeof b);
// undefined
```

另外你需要知道, 严格比较下和普通比较的情况:

```javascript
null !== undefined
null == undefined
```

这里还有个例子:

```javascript
let logHi = (str = 'hi') => {
  console.log(str);
}
```

如果不填写参数, 或者写一个其他的字符串参数的结果:

```javascript
logHi();
// hi

logHi('bye');
// bye
```

**如果你试着把undefined和null作为参数传进去会发生什么现象呢?**

```javascript
logHi(undefined);
// hi

logHi(null);
// null
```

再结合上面对undefined和null的描述就好理解了~

### 总结

* `null`是被分配的值, 但是[什么也不是](https://stackoverflow.com/a/802371/3089701)
* `undefined`一般理解为声明却没有定义的变量
* `null`和`undefined`都是falsy值
* `null`和`undefined`都是原始类型, 但是记住`typeof null`返回的是`object`!
* `null !== undefined`但是`null == undefined`

> 原文: [JavaScript — Null vs. Undefined](https://codeburst.io/javascript-null-vs-undefined-20f955215a2)

## ES6在babel下的兼容性问题

> 前几天关于babel配置造成es6代码结果不同的问题([ES6学习/Babel配置学习疑问](https://github.com/whidy/daily/blob/master/posts/2018-01-19-es6-babel-markdown.md)第4点), 困扰了我很多天, 我估计这本身就是个坑? 也就不必纠结了? 因为只是测试性学习, 所以才写了这种奇怪的写法, 我们重新简单回顾一下.

```javascript
for (let i = 0; i < 3; i++) {
  let i = 'abc';
  console.log(i);
}
```

这段代码输出应该是什么结果呢node环境和支持es6的浏览器是3次abc, 即阮一峰ECMAScript 6入门中示例结果, 以下是[let基本用法](http://es6.ruanyifeng.com/?search=%E8%A7%A3%E6%9E%84&x=10&y=8#docs/let#%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95)末尾处原文说明:

> 另外，for循环还有一个特别之处，就是设置循环变量的那部分是一个父作用域，而循环体内部是一个单独的子作用域。
>
> 上面代码正确运行，输出了 3 次abc。这表明函数内部的变量i与循环变量i不在同一个作用域，有各自单独的作用域。

所以目前困惑了几天还是没有结果的我很迷茫😭, 我的问题就是:

* 可以理解为**为什么es6的写法会会有多种输出结果**
* 或者说, **为什么babel编译es6代码的时候解释不统一**(无法转换成采用闭包的方式输出3次?)

究竟是babel的问题吗? 之后进行了大量文章的研究思考, 以下是参考资料及相关思考:

MDN对[`let`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/let)的解释如下:

> `let`语句声明一个块级作用域的本地变量，并且可选的将其初始化为一个值。

那么[**块级作用域**](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/block)(block)严格定义是:

> **块语句**（或其他语言的复合语句）用于组合零个或多个语句。该块由一对大括号界定，可以是labelled：

并且以上都没有提到类似阮大佬的for循环示例相关的代码, 真不知道阮大佬哪里看到的, 竟然想到这种写法.

我又问了其他的大佬, 这种情况该如何解释. 也没有得到准确的解释, 不过还是有收获的, 大佬的建议:

* 可以考虑TypeScript来写代码
* 可以尝试eslint工具来避免可能存在解释造成的误差

最后, 我个人觉得, 写es6的话, 遇到这种坑的情况应该还是很少的, 配置一下`browserslist`覆盖大部分浏览器的话应该就没什么问题了, 即便在极少情况下可能存在结果和想象得有些不同, 但是只要保证babel输出的结果在不同的浏览器一致也是可以的.

另外, 分享一些较为严谨和拓展性的参考资料:

* [Variables and scoping in ECMAScript 6](http://2ality.com/2015/02/es6-scoping.html)
* [Variables and scoping](http://exploringjs.com/es6/ch_variables.html)
* [Babel下的ES6兼容性与规范](http://imweb.io/topic/561f9352883ae3ed25e400f5)

## 其他

* 在查询资料的时候发现了一个在线阅读JavaScript相关的免费书籍网站[Exploring JS: JavaScript books for programmers](http://exploringjs.com/)