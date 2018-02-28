---
layout: post
title: "call和apply"
date: 2018-02-08
categories: javascript call apply
---
> 2018年2月8日 晴 一般

# 函数原型和继承学习总结

> 昨晚回去又看了一下JavaScript权威指南第六章, 其中提到, `1`, `"test"`, `true`, 这类不是对象, 或者也可以当作临时对象, 书中举例`var s = "test"`, 此时可以给`s`一个属性, 比如`s.a = 1`, 但是你访问不到该属性`s.a`是`undefined`. 因为这三种是原始类型什么的- -.
>
> 另外还有个包装对象, 好像目前看不出来有啥用. 先不看了吧- -
>
> 今天接着看昨天没看完的内容和补充昨天的内容.

## 昨日内容补充

### Object.prototype.constructor

> 早上读昨天没看完的文章[Basic Inheritance with JavaScript Constructors](http://adripofjavascript.com/blog/drips/basic-inheritance-with-javascript-constructors.html)

一般的通过`new`构造函数实现继承就不说了. 这里用`call`来实现(用面向对象表达)所谓的"一个通过`SuperHero`类创建的`marvel`实例, 继承`SuperHuman`的方法"的过程. 下面是合并后的代码:

```javascript
function SuperHuman(name, superPower) {
  this.name = name;
  this.superPower = superPower;
}

SuperHuman.prototype.usePower = function() {
  console.log(this.superPower + '!');
};

var banshee = new SuperHuman('Silver Banshee', 'sonic wail');

function SuperHero(name, superPower) {
  // Reuse SuperHuman initialization
  SuperHuman.call(this, name, superPower);
  this.allegiance = 'Good';
}

SuperHero.prototype = new SuperHuman();

SuperHero.prototype.saveTheDay = function() {
  console.log(this.name + ' saved the day!');
};

var marvel = new SuperHero('Captain Marvel', 'magic');

marvel.saveTheDay(); // Outputs: "Captain Marvel saved the day!"
marvel.usePower(); // Outputs: "magic!"
```

> 不过我感觉这个例子没有怎么很好的讲出`constructor`. 就当复习吧. 然后还没仔细看`call`和`apply`, 一天又快要结束了...

## Function.prototype.call()

看了下, 使用call方法调用匿名函数的例子不错.

```javascript
var animals = [
  { species: 'Lion', name: 'King' },
  { species: 'Whale', name: 'Fail' }
];

for (var i = 0; i < animals.length; i++) {
  (function(i) {
    this.print = function() {
      console.log('#' + i + ' ' + this.species + ': ' + this.name);
    };
    this.print();
  }).call(animals[i], i);
}
```

## Function.prototype.apply()

使用apply来链接构造器

```javascript
Function.prototype.construct = function(aArgs) {
  var oNew = Object.create(this.prototype);
  this.apply(oNew, aArgs);
  return oNew;
};
```

> 话说为啥感觉`apply`的几个例子有点不太好理解, 绕得很...