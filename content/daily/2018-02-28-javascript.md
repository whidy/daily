+++
title = "复习"
date = "2018-02-28"
author = "whidy"
+++
> 2018年2月28日 晴 一般

## 面试题小试

> 前天晚上发烧, 不舒服, 然后迷迷糊糊上了一天班. 昨天有个群友面试, 主要是ES5, 关于`变量提升`, `原型继承`, 还有两个关于算法的, 一个`排序`, 一个`数组去重`, 于是做了一下, 顺便也看了其他的面试题.

![面试题目](/images/2018-02-28-1.png)

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

题目4: 看到这个我想到通过对象的方式来合并, 于是就有了这段代码, 也不知道效率咋样😂

```javascript
var dwConcat = function(arr1, arr2) {
  var result = [];
  var foo = {};
  var counter = 0;
  for (var i = 0; i < arr1.length; i++) {
    foo[arr1[i]] = arr1[i];
  }
  for (var i = 0; i < arr2.length; i++) {
    foo[arr2[i]] = arr2[i];
  }
  for (var key in foo) {
    result[counter] = foo[key];
    counter++;
  }
  return result;
};
var arr1 = [1, 2, 3, 1, 5];
var arr2 = [2, 3, 4, 8, 10, 4, 5];
var arr = dwConcat(arr1, arr2);
console.log(arr);
```

当然这种题目, 我觉得写的越简单越好吧, 所以就不多去考虑各种特殊情况了.

## 复习

发现[02-08](https://github.com/whidy/daily/blob/master/posts/2018-02-08-object-call-apply.md#functionprototypecall)这段代码有个错误, `call`的调用居然在对象上, 居然还能正确执行... 不过现在修正了. 有兴趣的话可以试试下面这段错误的😂

```javascript
  }).call(animals[i], i); // 修正
  //}.call(animals[i], i)); // 错误
```

_至此, 复习结束, 结论是, 不少关于原型的东西貌似又忘了😭_

> 很奇怪, 之前提交这个repo都是直接vscode点击下就好了, 怎么突然就要输入用户密码了. 查了半天才发现即便有ssh, 如果用的`https`协议, 始终都需要输入用户密码, 可是我好像没有修改过这些啊, 怎么回事呢. 参阅: [Git keeps prompting me for password
](https://stackoverflow.com/questions/7773181/git-keeps-prompting-me-for-password)

> 修改了之前按月份来记录`To Do List`和`To Read List`的方式, 因为实际数量不大, 没有必要分多文件管理, 所以调整了.