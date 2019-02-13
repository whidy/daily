# Javascript事件循环入门到“忘记”（二）

> 本文主要介绍Javascript事件循环在**Node.js**上的一些特性和应用介绍。

## 回顾上一期内容

上一期主要针对浏览器上的事件循环进行了简单介绍，也展示了几个开发中可能有帮助的调试及错误分析方法。文章在此：[Javascript事件循环入门到“忘记”（一）](https://github.com/whidy/daily/blob/master/articles/Javascript%E4%BA%8B%E4%BB%B6%E5%BE%AA%E7%8E%AF%E5%85%A5%E9%97%A8%E5%88%B0%E2%80%9C%E5%BF%98%E8%AE%B0%E2%80%9D%EF%BC%88%E4%B8%80%EF%BC%89.md)

我们还是需要反复尝试记住`栈`、`队列`、`任务`、`非阻塞`等几个概念。请自行思考片刻，我们进入Node.js的事件循环介绍。

## Node.js特点

* 2009年发布、作者是`Ryan Dahl`
    历史悠久，再不学就淘汰了（对于Deno表示鸭梨很大。。。）
* 单线程、基于Chrome的V8的Javascript运行环境
    具备高并发，高性能的特点
* 事件驱动（ libuv ）、异步（libuv、非阻塞I/O模型）
    底层C++编写的超快解释器、API几乎全部支持异步回调
* 非常适合服务器编程。。。Blablabla。。。

> 当然也是有缺点的，要不然作者也不会搞deno了。缺点：不稳定性、容易挂掉、无法充分发会多核CPU性能等等。

## 示例思考

我们来看两个小Demo，思考一下结果是什么？

### Demo - 1

```javascript
setTimeout(() => {
  console.log('timer1')
  Promise.resolve().then(() => {
    console.log('promise1')
  })
}, 0)
setTimeout(() => {
  console.log('timer2')
  Promise.resolve().then(function() {
    console.log('promise2')
  })
}, 0)
```

...此处表示思考了很久而产生的分割线...

那么结果大家都有了吧，看看实际情况：

* 情况一、在浏览器执行的结果：

    ```
    timer1
    promise1
    timer2
    promise2
    ```

* 情况二、在Node.js环境执行的结果：

    ```
    timer1
    timer2
    promise1
    promise2
    ```

你是不是看到了区别，以为这就完了吗？作为原文中为提到的补充资料，请注意**Node.js**环境中也有可能存在`情况一`的结果（极少情况下，概率约15%发生）！

至于Node.js环境出现两种不同的结果，我暂时还没有比较完美的答复，期待有大佬指点（据说和机器性能有关，也就是Demo - 2展示的情况一样）

### Demo - 2

```javascript
setTimeout(() => {
  console.log('timeout')
}, 0)

setImmediate(() => {
  console.log('immediate')
})
```

当然浏览器是不支持setImmediate()，因此会报错。我们主要看Node.js执行结果：

* 情况一、大部分执行结果：

    ```
    timeout
    immediate
    ```

然而，不注意的话，很容易误以为，这就是标准答案了。其实也有少数情况下会出现第二种情况。

* 情况二、小概率出现的结果：

    ```
    immediate
    timeout
    ```

示例原文对此现象的解释为：

> Node并不能保证timer在预设时间到了就会立即执行，因为Node对timer的过期检查不一定靠谱，**它会受机器上其它运行程序影响**，或者**那个时间点主线程不空闲**。比如下面的代码，setTimeout()和 setImmediate()的执行顺序是不确定的。

我对这个解释实际是表示不太清晰的，也查过其他资料，比如[Node.js的event loop及timer/setImmediate/nextTick](https://github.com/creeperyang/blog/issues/26)文中也有一段关于此现象的解释：

1. 如果两者都在主模块（main module）调用，那么执行先后取决于进程性能，即随机。
1. 如果两者都不在主模块调用（即在一个 IO circle 中调用），那么setImmediate的回调永远先执行。

另外该文对`libuv`也进行了较为深入的分析。

## Node.js事件循环的6个阶段

Node.js的事件循环相对浏览器要复杂的多，这也是他高性能方案的解决需要。他主要是这6个阶段：

```
   ┌───────────────────────────┐
┌─>│           timers          │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │     pending callbacks     │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │       idle, prepare       │
│  └─────────────┬─────────────┘      ┌───────────────┐
│  ┌─────────────┴─────────────┐      │   incoming:   │
│  │           poll            │<─────┤  connections, │
│  └─────────────┬─────────────┘      │   data, etc.  │
│  ┌─────────────┴─────────────┐      └───────────────┘
│  │           check           │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
└──┤      close callbacks      │
   └───────────────────────────┘
```

关于这六个阶段的详细解释，文末的参阅文章都有提到，需要的话可以阅读其他人的文章。我这里不详细说明，我只对下面3个阶段，讲讲我自己的理解：

### timers

Node.js事件循环中的第一个阶段，它用于执行`setTimeout()`和`setInterval()`的回调任务，只有这两个，**千万不要把`setImmediate()`也当成timers阶段执行了**。

### pending callbacks

这个阶段就是将I/O时间记录下来放在下一次事件循环中的操作。

### poll

这个阶段理解起来是相当复杂的。官方大致解释如：获取**新**的I/O时间，执行他们的回调，几乎所有输入输出事件（比如fs操作）的回调都会在该阶段执行，但是关闭事件（`close callbacks`，比如关闭网络服务等，你可以去Node.js API中查到大量的close事件）的回调、前面提到的timers回调，和setImmediate()是不会再次阶段执行！

这里有一张图，来自作者：**凌晨夏沫**的[谈谈Node中的常见概念](https://juejin.im/post/5a8e44ea5188257a8929bf9b)

![poll阶段流程图](/images/javascrip-event-loop-2/poll.png)

默看一分钟，我理解为当前执行上下文中：

* 第一轮循环：在poll阶段，如果有timer还未执行完，poll阶段完成了已有的I/O回调后，进入第二轮循环。
* 第一轮循环：进入timers阶段执行完成了先有，再进


### Demo - 3

```javascript
const fs = require('fs');
fs.readFile('file.js', () => {
  setTimeout(() => {
    console.log('5. timeout');
  }, 0);
  setImmediate(() => {
    console.log('4. immediate');
  });
  console.log('2. i/o callback');
});
setTimeout(() => {
  console.log('1. outside timeout');
}, 0);
setImmediate(() => {
  console.log('3. outside immediate');
});
```

我们分析一下这个Demo - 3，最外面的执行上下文，有`fs.readFile`、`setTimeout()`、`setImmediate()`。

在Stack内：

1. fs.readFile()入栈，发现有I/O任务，将它丢到一边的`pending callbacks`阶段中，然后出栈；
1. setTimeout()入栈，并把回调丢到timers阶段中；
1. setImmediate()入栈，并把回调丢到check阶段中；

此时队列的情况如下：

Timers里面有一个回调待执行：

```javascript
() => {
  console.log('1. outside timeout');
}
```

Pending callbacks里面有一个回调待执行：

```javascript
() => {
  setTimeout(() => {
    console.log('5. timeout');
  }, 0);
  setImmediate(() => {
    console.log('4. immediate');
  });
  console.log('2. i/o callback');
}
```

Check里面有一个回调待执行：

```javascript
() => {
  console.log('3. outside immediate');
}
```

当然stack内没东西了。开始执行队列中的任务！如前面Demo - 2所说，该层有不确定性的结果，假设大部分状态下一切正常，按照事件循环顺序，先执行Timers的任务，于是输出

```
1. outside timeout
```

然后进入到Pending callbacks阶段，Stack内有了新的内容了！！！遇到了fs内的回调！

1. setTimeout()的回调被丢到Timers
1. setImmediate()的回调被丢到了Check
1. 而`console.log('2. i/o callback');`被直接执行！

于是输出了：

```
2. i/o callback
```

接着到了Poll阶段发现还有个setImmediate()未被执行，接着进入到Check阶段，这里输出了：

```
3. outside immediate
```

这一轮结束，那么现在的任务队列情况又是怎样的呢？

Timers里面有一个回调待执行：

```javascript
() => {
  console.log('5. timeout');
}
```

Check里面有一个回调待执行：

```javascript
() => {
  console.log('4. immediate');
}
```

到现在还有两个任务没有执行。在新的一轮循环中，是不是要开始先执行这个`console.log('5. timeout');`了呢？我觉得可能不对。

为什么不对，下面我会介绍。到目前来看，执行结果就是这样了

```
1. outside timeout
2. i/o callback
3. outside immediate
4. immediate
5. timeout
```

不过和Demo - 2有同样的毛病，在最外层的执行上下文内，setTimeout()执行顺序有很大的不确定性，所以也会存在以下结果：

```
2. i/o callback
3. outside immediate
4. immediate
1. outside timeout
5. timeout
```

## 我的总结

关于前面几个Demo都有很大相似处，其实Node.js官方也专门提到这个例子，如果有兴趣可以阅读一下[setImmediate() vs setTimeout()](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/#setimmediate-vs-settimeout)。

> The order in which the timers are executed will vary depending on the context in which they are called. If both are called from within the main module, then timing will be bound by the performance of the process (which can be impacted by other applications running on the machine).

我们先读三遍，然后我对以下两点进行我得分析：

1. the `context` in which they are called
1. If both are called from within the `main module`, then timing will be bound by the `performance` of the process

第一条出现的**context**是否眼熟，还记得我第一篇讲到的[**执行上下文(Execution Context)**](https://github.com/whidy/daily/blob/master/articles/Javascript%E4%BA%8B%E4%BB%B6%E5%BE%AA%E7%8E%AF%E5%85%A5%E9%97%A8%E5%88%B0%E2%80%9C%E5%BF%98%E8%AE%B0%E2%80%9D%EF%BC%88%E4%B8%80%EF%BC%89.md#%E9%9C%80%E8%A6%81%E4%BA%86%E8%A7%A3%E7%9A%84%E5%87%A0%E7%82%B9)吗？timers阶段内的时间是否立刻被执行也取决于上下文环境。

第二条的**main module**很重要，他是解释Demo - 2最后的setTimeout()和setImmediate()顺序不确定性的重要因素，他们从属一个主模块（栈中的main()？）因此顺序取决于CPU性能！

然而为什么Demo - 3中没有出现这样的情况？原因是他们同属于一个I/O cycle，在这个中，setImmediate()永远优先setTimeout()。所以结果并不是单纯的Timers优先执行，Check后执行。

希望我讲了这么多大家能够耐心的读，如果有疑问或者质疑需要补充的，也希望大家能踊跃发言。

### 关于process.nextTick

其实这个东西也有必要说说，我打算下次再来详细分析一下。嘿嘿嘿。

## 其他

> 文中使用的是Node.js版本为`v8.11.3`

* 参考（★表示推荐等级）

1. [谈谈Node中的常见概念](https://juejin.im/post/5a8e44ea5188257a8929bf9b) ★★★★★
1. [Node.js的event loop及timer/setImmediate/nextTick](https://github.com/creeperyang/blog/issues/26#issuecomment-294166700) ★★★★☆
1. [深入理解js事件循环机制（Node.js篇）](http://lynnelv.github.io/js-event-loop-nodejs) ★★★★☆
1. [浅析nodejs事件循环机制](https://juejin.im/post/5a63470bf265da3e2c383068) ★★★☆☆
1. [JavaScript 运行机制详解：再谈Event Loop](http://www.ruanyifeng.com/blog/2014/10/event-loop.html)

node.js官方文档：

1. [The Node.js Event Loop, Timers, and process.nextTick()](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/) ★★★★★
1. [API: process.nextTick](https://nodejs.org/docs/latest/api/process.html#process_process_nexttick_callback_args)
1. [API: Scheduling Timers](https://nodejs.org/docs/latest/api/timers.html#timers_scheduling_timers)