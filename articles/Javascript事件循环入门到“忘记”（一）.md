# Javascript事件循环入门到“忘记”（一）

> 本文主要介绍Javascript事件循环在**浏览器**上的一些特性和应用介绍。

## Javascript小知识

JavaScript的并发模型基于"事件循环"(Event Loop)。这个模型与像C或者Java这种其它语言中的模型截然不同。它永不阻塞，处理I/O通常通过事件和回调来执行，所以当一个应用正等待IndexedDB查询返回或者一个XHR请求返回时，它仍然可以处理其它事情，如用户输入。【参：[并发模型与事件循环](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/EventLoop#%E6%B0%B8%E4%B8%8D%E9%98%BB%E5%A1%9E)】

### 需要了解的几点：

* 单线程编程语言(Single Threaded)

  只有一个主线程(one thread)，并且只有一个调用栈(Call Stack)，因此同一时间只能执行同一件事情。【参：[Philip Roberts: What the heck is the event loop anyway? | JSConf EU](https://www.youtube.com/watch?v=8aGhZQkoFbQ) (4:15)】

* 执行上下文(Execution Context)

  Javascript代码执行时，会进入一个执行上下文。它可以理解为**当前代码的运行环境**（包括三种：全局环境、函数环境、Eval环境）。【参：Javascript核心技术开发解密 Page-11】

  > 纠正一点分享会可能存在的错误，它和作用域(Scope)不同！作用域是针对变量的一个可访问区域，而执行上下文是属于函数的指向的对象。（Scope pertains to the visibility of variables, and context refers to the object to which a function belongs.）【参：[Why Should We Care About Scope and Context ?](https://blog.kevinchisholm.com/javascript/difference-between-scope-and-context/)】

* 栈（stack）
  
  函数调用形成了一个栈帧。JavaScript中叫做调用栈(Call Stack)；先进后出，后进先出(LIFO)。

  ![stack](https://raw.githubusercontent.com/whidy/daily/master/sources/images/javascrip-event-loop-1/stack.png)

* 堆（heap）

  对象被分配在一个堆中，即用以表示一个大部分非结构化的内存区域。

* 队列（queue）

  一个JavaScript运行时包含了一个待处理的消息队列。每一个消息都有一个为了处理这个消息相关联的函数。

* 任务（Task）

  主要是队列中要执行的函数。主要包含以下两大类：

  1. macrotask：包含执行整体的js代码，事件回调，XHR回调，定时器（setTimeout/setInterval/setImmediate），IO操作，UI render

  1. microtask：更新应用程序状态的任务，包括promise回调，MutationObserver，process.nextTick，Object.observe

下图展示了Event Loop的行为方式

![event loop](https://raw.githubusercontent.com/whidy/daily/master/sources/images/javascrip-event-loop-1/event-loop.png)

## 这些代码会发生什么？

* 基于JQuery的Ajax示例，如果没有异步多么可怕！

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

  这里使用了JQuery的Ajax函数，并为参数设置为同步执行。那么将于到一种可怕的情况，这段代码在success回调前，后面的Javascript代码将不再执行。也就造成了可怕的阻塞(blocking)。

* 这段代码什么鬼，看着有点晕XD

  ```javascript
  let bar = 0
  function foo() {
    bar++
    if (bar > 0) {
      return foo()
    }
  }
  foo()
  ```

  没错，如果你不晕，说明你太棒了。这段代码也会产生严重的问题。如下图：

  ![event loop](https://raw.githubusercontent.com/whidy/daily/master/sources/images/javascrip-event-loop-1/event-loop.png)

  这是典型的内存溢出，可能会出现在某些场景下需要递归，但业务逻辑中的判断又没能正常计算进入到预设情况，于是调用栈中不断进入foo()，又无法执行完，就造成内存溢出了。
  
  > 纠正一处分享会中的错误，这个入栈过程没有任何函数退出，所以会只进不出，导致内存爆炸。另外道哥提到的不断累加到最大值为负数的情况，我测试了一下JS下，会变成Infinite。某些其他语言（例如：C）是会变成-1，和二进制进位有关。

* 小测验：[Demo - 1](https://github.com/whidy/daily/blob/master/examples/javascrip-event-loop-1/demo-1.js)

  ```javascript
  setTimeout(() => {
    console.log(1);
  }, 0);
  console.log(2);
  for (let i = 0; i < 3; i++) {
    console.log(i);
  }
  console.log(4);
  ```

  输出结果：

  A: 1, 2, 0, 1, 2, 4
  B: 2, 4, 0, 1, 2, 1
  C: 2, 0, 1, 2, 4, 1
  D: 2, 4, 0, 1, 2, 1

  =====华丽的分割线======

* 小测验：[Demo - 2](https://github.com/whidy/daily/blob/master/examples/javascrip-event-loop-1/demo-2.js)

  ```javascript
  console.log(1);
  for (let i = 0; i < 3; i++) {
    setTimeout(() => {
      console.log('2-' + i);
    }, 0);
  }
  console.log(3);
  ```

  输出结果：

  A: 1, 2-2, 2-2, 2-2, 3
  B: 1, 3, 2-2, 2-2, 2-2
  C: 1, 2-0, 2-1, 2-2, 3
  D: 1, 3, 2-0, 2-1, 2-2

我想大家应该都正确答出来了吧:D，接下来我将详细分析一些示例，以便于理解事件循环。

## 事件循环流程分析

* 示例分析1：

  这里我借用了作者`稀土掘金`的[深入理解事件迴圈和非同步流程控制](https://itw01.com/2Z6WE2L.html)文中的一段示范。

  ```javascript
  console.log('Hi')
  setTimeout(function cb1() {
    console.log('cb1')
  }, 5000)
  console.log('Bye')
  ```

  不论是否懂得事件循环的初学者，看到这段代码应该也能猜出来答案是： `Hi Bye cb1`。毕竟cb1有一个5s的定时器。但是执行细节是怎样的呢。我们来看下面这张gif图。

  ![一步步分析事件循环](https://raw.githubusercontent.com/whidy/daily/master/sources/images/javascrip-event-loop-1/event-loop-steps.gif)

  图中已经很清楚的展示了整个Javascript代码是如何运作的。相信大家已经有较大的收获了。

* 示例分析2：

  我们来看这个[页面](https://github.com/whidy/daily/blob/master/examples/javascrip-event-loop-1/demo-6.html)中的Javascript部分：

    ```javascript
    function one() {
      throw new Error('Oops!')
    }
    function two() {
      one()
    }
    function three() {
      two()
    }
    three()
    ```

  我们在浏览器端执行时，打个断点在`throw new Error('Oops!')`这一行。如下图：

  ![Demo - 6 图1](https://raw.githubusercontent.com/whidy/daily/master/sources/images/javascrip-event-loop-1/demo-6-a.png)

  在了解了事件循环的执行顺序后，我们可以轻松知道他的执行顺序，通过Chrome开发者工具、我们观察图中Call Stack区域，箭头指向的`one`也正是我们断点的地方，下面依次是two、three、(anonymous)，这个是完全符合栈的先进后出，后进先出(last-in-first-out)的特征~

  我们在实际开发中，也可以通过Call Stack里面观察，找出上一层入口，分析异常原因。会有很大的帮助呢~

  接着关闭断点继续执行，浏览器会抛出错误，错误信息如下，也是符合栈特点的

  ![Demo - 6 图2](https://raw.githubusercontent.com/whidy/daily/master/sources/images/javascrip-event-loop-1/demo-6-b.png)

## 其他

该文章中有部分内容在我制作的PPT中并未体现出来，对于这次分享会，我对Javascript一些运行机制有更深的理解，由于时间仓促也就在本次分享做了一点入门介绍。下期我将会结合更多的示例，对Node.js的事件循环与浏览器端的差异等等进行更深入的介绍，当大家都有所收获后，就大可忘记了。

* 文中参考的一些资料（★表示推荐等级）

  1. [深入理解js事件循环机制（浏览器篇）](http://lynnelv.github.io/js-event-loop-browser) ★★★★☆
  1. [深入理解事件迴圈和非同步流程控制](https://itw01.com/2Z6WE2L.html) ★★★★☆
  1. [Philip Roberts: What the heck is the event loop anyway? | JSConf EU](https://www.youtube.com/watch?v=8aGhZQkoFbQ) ★★★★★
    > 这是一段来自Youtube的演讲视频，视频中有用到一个工具"[loupe - 模拟执行顺序的工具](http://latentflip.com/loupe/)"，值得研究！ ★★★★★
  1. [Tasks, microtasks, queues and schedules](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/) ★★★★★
    > 文中有例子通过动画来展示执行顺序问题感觉超级棒！也对不通浏览器的结果有做分析，当然也许部分内容有些不一致，需要注意。
  1. [The JavaScript Event Loop [Presentation]](https://thomashunter.name/posts/2013-04-27-the-javascript-event-loop-presentation)

* 文中所提到的参考内容及使用到的PPT资料（有惊喜）

  1. [JS事件循环PPT - Whidy](https://pan.baidu.com/s/1vwFKPv3W1D3zzh3A3X7o0A)
  1. [JavaScript Event Loop - Thomas Hunter](https://pan.baidu.com/s/1DDiQGPb4aX7w0i-6mHYHwg)
  1. [JS Event Loop - Sonle](https://pan.baidu.com/s/157K3TrbWhzQuWeYJJOpOhQ)
  1. [All you need to know about the JavaScript event loop - @sasatatar & @codaxy](https://pan.baidu.com/s/1lmHhBXSK7Rc-cojqByGTDA)
  1. [全部整包下载](https://pan.baidu.com/s/1MpVQvbaCFIIWeNX3y2PDGw)
