---
layout: post
title: "ECMAScript6入门/函数"
date: 2018-01-29
categories: es6 function
---
> 2018年1月29日 阴有小雨 一般

# ECMAScript6入门 / 函数

## ECMAScript6入门

我再次阅读**字符串的扩展**这部分, 老实说, 这一节关于`charCodeAt`, `charAt`, `codePointAt`, `fromCodePoint`, `at`, `normalize`这些东西感到枯燥的很, 我还不能理解这些内容在实际应用上的广泛性.

## 函数(Function)

> 关于函数得知识点, 我才发现我欠缺的多得多. 以下是我对函数了解较少或者需要注意的几个点得总结.

### 作用域和函数堆栈

#### 递归

例如，思考一下如下的函数定义：

```javascript
var foo = function bar() {
  // statements go here
};
```

在这个函数体内，以下的语句是等价的：

* bar()
* [arguments.callee()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/arguments/callee)
* foo()

获取树结构中所有的节点时，使用递归实现要容易得多：

```javascript
function walkTree(node) {
  if (node == null)
    //
    return;
  // do something with node
  for (var i = 0; i < node.childNodes.length; i++) {
    walkTree(node.childNodes[i]);
  }
}
```

#### 命名冲突

当同一个闭包作用域下两个参数或者变量同名时，就会产生命名冲突。更近的作用域有更高的优先权，所以最近的优先级最高，最远的优先级最低。这就是作用域链。链的第一个元素就是最里面的作用域，最后一个元素便是最外层的作用域。

看以下的例子：

```javascript
function outside() {
  var x = 5;
  function inside(x) {
    return x * 2;
  }
  return inside;
}
outside()(10); // returns 20 instead of 10
```

命名冲突发生在`return x`上，`inside`的参数`x`和`outside`变量`x`发生了冲突。这里的作用链域是{`inside`, `outside`, 全局对象}。因此`inside`的`x`具有最高优先权，返回了20（`inside`的`x`）而不是10（`outside`的`x`）。

参阅: [MDN: 函数](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Functions)

---

26日提到了一个`is_android`的函数示例, 与变量提升有关, 正巧又看到了相关的说明:

#### 非严格模式下的 Block-level functions

**一句话：不要用。**

在非严格模式下，块中的函数声明表现奇怪。例如：

```javascript
if (shouldDefineZero) {
  function zero() {
    // DANGER: 兼容性风险
    console.log('This is zero.');
  }
}
```

ECMAScript 6中，如果`shouldDefineZero是false，则永远不会定义zero,因为这个块从不执行。然而，这是标准的新的一部分。这是历史遗留问题，无论这个块是否执行，一些浏览器会定义zero。`

在[严格模式](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Strict_mode)下，所有支持ECMAScript 6的浏览器以相同的方式处理：只有在shouldDefineZero为true的情况下定义zero，并且作用域只是这个块内。

参阅: [MDN: 函数](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions#%E9%9D%9E%E4%B8%A5%E6%A0%BC%E6%A8%A1%E5%BC%8F%E4%B8%8B%E7%9A%84Block-level_functions)

---

#### Function 构造器生成的函数，在全局作用域中被创建

```javascript
// 1、f()函数返回的function e()是闭包.
var n = 1;
function f() {
  var n = 2;
  function e() {
    return n;
  }
  return e;
}
console.log(f()()); //2

// 2、f()函数返回的function e()是全局作用域函数
var n = 1;
function f() {
  var n = 2;
  var e = new Function('return n;');
  return e;
}
console.log(f()()); //1
```

这段示例比较特别, 看起来有点迷糊, 不过目前记得尽量不要用构造函数创建函数.

参考: [MDN: Function](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function#Example.3A_Specifying_arguments_with_the_Function_constructor)

## 其他

在查作用域链的相关资料的时候, 偶然发现一片不错的[GitBook - 前端工程师手册](https://leohxj.gitbooks.io/front-end-database/content/), 需要翻墙才能访问貌似~
