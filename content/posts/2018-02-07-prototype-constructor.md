---
layout: post
title: "函数原型和继承学习总结"
date: 2018-02-07
categories: javascript prototype constructor
---
> 2018年2月7日 晴 一般

# 函数原型和继承学习总结

## Object.prototype

JS一切皆对象, 对象都具有`内置属性[[prototype]]`(也可用`__proto__`表示). 每个函数创建后拥有名为`prototype`的属性, 它又有一个[`constructor`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/constructor), 有个例外: **通过Function.prototype.bind方法构造出来的函数没有prototype属性。**

偷了一张图[doris的回答](https://www.zhihu.com/question/34183746/answer/58155878):

![\_\_proto\_\_和prototype](/images/2018-02-07-1.jpg)

参阅:
* [知乎: js中\_\_proto\_\_和prototype的区别和关系？](https://www.zhihu.com/question/34183746)
* [MDN: Object.prototype](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/prototype)

## Object.prototype.constructor

**返回创建实例对象的`Object`构造函数的引用。** 返回值为只读的原始类型.

这里有个关于`改变对象的constructor`例子, 比较特别的是, **数字, 布尔, 字符串不被改变**.

> 只有 true, 1 和 "test" 的不受影响，因为创建他们的是只读的原生构造函数（native constructors）。

```javascript
function Type() { };
Type // ƒ Type() { }

var a = [];
a.constructor // ƒ Array() { [native code] }
a.constructor = Type;
a.constructor // ƒ Type() { }  "被改变"

var b = 666;
b.constructor // ƒ Number() { [native code] }
b.constructor = Type;
b.constructor // ƒ Number() { [native code] }  "无法改变"

var c = 'whidy';
c.constructor // ƒ String() { [native code] }
c.constructor = Type;
c.constructor // ƒ String() { [native code] }  "无法改变"

// 同理, 布尔也无法改变, 其他的例如Date对象, Math等等均会被覆盖. 取自MDN例子
```

参阅:
* [MDN: Object.prototype.constructor](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/constructor)

## Object.create()

> `Object.create()`方法会使用指定的原型对象及其属性去创建一个新的对象。

Q: MDN的`用Object.create实现类式继承`中**继承到多个对象**处, 我突然想到一个问题, 例子中的SuperClass和OtherSuperClass如果有同名的函数, 会不会冲突- -

A: 会被后面的覆盖.

我自己测试简单写了一段测试代码:

```javascript
function SuperClass(x) {
  return x + x;
}

SuperClass.prototype.extra = function(x) {
  return x * x;
};

function OtherSuperClass(x, y) {
  return x - y;
}

OtherSuperClass.prototype.extra = function(x, y) {
  return x / y;
};

OtherSuperClass.prototype.extra2 = function(x, y) {
  return x / y + 2;
};

function MyClass() {
  SuperClass.call(this);
  OtherSuperClass.call(this);
}

// 继承一个类
MyClass.prototype = Object.create(SuperClass.prototype);
// 混合其它
Object.assign(MyClass.prototype, OtherSuperClass.prototype);
// 重新指定constructor
MyClass.prototype.constructor = MyClass;

MyClass.prototype.myMethod = function() {
  console.log('myclass');
};
```

Q: 为啥最后要重新指定`constructor`到自己?

A: ...

创建空对象并拥有属性

```javascript
// 创建一个以另一个空对象为原型,且拥有一个属性p的对象
o = Object.create({}, { p: { value: 42 } })

// 省略了的属性特性默认为false,所以属性p是不可写,不可枚举,不可配置的:
o.p = 24
o.p
//42

o.q = 12
for (var prop in o) {
   console.log(prop)
}
//"q"

delete o.p
//false

//创建一个可写的,可枚举的,可配置的属性p
o2 = Object.create({}, {
  p: {
    value: 42, 
    writable: true,
    enumerable: true,
    configurable: true 
  } 
});
```

参阅:
* [MDN: Object.create()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/create)