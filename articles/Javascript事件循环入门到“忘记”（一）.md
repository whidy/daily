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
  
  函数调用形成了一个栈帧。

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

## 示例

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

## 其他

* 参考（★表示推荐等级）

1. [深入理解js事件循环机制（浏览器篇）](http://lynnelv.github.io/js-event-loop-browser) ★★★★☆
1. [深入理解事件迴圈和非同步流程控制](https://itw01.com/2Z6WE2L.html) ★★★★☆
1. [Philip Roberts: What the heck is the event loop anyway? | JSConf EU](https://www.youtube.com/watch?v=8aGhZQkoFbQ) ★★★★★
  > 这是一段来自Youtube的演讲视频，视频中有用到一个工具"[loupe - 模拟执行顺序的工具](http://latentflip.com/loupe/)"，值得研究！ ★★★★★
1. [Tasks, microtasks, queues and schedules](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/) ★★★★★
   > 文中有例子通过动画来展示执行顺序问题感觉超级棒！也对不通浏览器的结果有做分析，当然也许部分内容有些不一致，需要注意。
1. [The JavaScript Event Loop [Presentation]](https://thomashunter.name/posts/2013-04-27-the-javascript-event-loop-presentation)

* 扩展

  回调地狱