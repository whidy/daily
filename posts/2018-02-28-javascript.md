---
layout: post
title: "复习"
date: 2018-02-28
categories: untitled
---
> 2018年2月28日 晴 一般

> 前天晚上发烧, 不舒服, 然后迷迷糊糊上了一天班. 昨天有个群友面试, 主要是ES5, 关于`变量提升`, `原型继承`, 还有两个关于算法的, 一个`排序`, 一个`数组去重`, 于是做了一下, 顺便也看了其他的面试题.

![面试题目](https://raw.githubusercontent.com/whidy/daily/master/sources/images/2018-02-28-1.png)

题一: 输出`6`个`5`;

题二: chrome下, 依次输出`2 4 1 2 3 3`, node环境下`第3个`报错.

题三: 我思路很清楚, 貌似代码写起来不是很利索, 写完了最常见的, 想起还有个方案, 不过还是第一个次数少一点. (为了示例搞了两个数组)

```javascript
var arr1 = [3, 1, 2, 5, 4, 2];
var arr2 = [3, 1, 2, 5, 4, 2];
var arrLen = arr1.length;
var counter = 0;

var mySort = {
  way1: function(arr) {
    counter = 0;
    var i = (j = 0),
      temp;
    while (i < arrLen) {
      j = i + 1;
      while (j < arrLen) {
        counter++;
        if (arr[i] - arr[j] > 0) {
          temp = arr[i];
          arr[i] = arr[j];
          arr[j] = temp;
        }
        j++;
      }
      i++;
    }
  },
  way2: function(arr) {
    counter = 0;
    var i = (j = 0),
      temp;
    while (i < arrLen) {
      j = 0;
      while (j < arrLen - 1) {
        if (arr[j] - arr[j + 1] > 0) {
          temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
        }
        j++;
        counter++;
      }
      i++;
    }
  }
};

mySort.way1(arr1);
console.log('Way1 soted array is [' + arr1 + '] and loop ' + counter + ' times');
mySort.way2(arr2);
console.log('Way2 soted array is [' + arr2 + '] and loop ' + counter + ' times');
```

当然这种题目, 我觉得写的越简单越好吧, 所以就不多去考虑各种特殊情况了.

