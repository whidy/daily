---
layout: post
title: "replace和exec函数"
date: 2018-02-05
categories: javascript replace regexp
---
> 2018年2月5日 晴 一般

# replace和exec函数

> 不好意思我还在看正则部分, 才发现replace函数一点也不简单.

## 语法

```javascript
str.replace(regexp|substr, newSubStr|function)
```

## 使用字符串作为参数

* 变量名 | 代表的值
* `$$` | 插入一个 "$"。
* `$&` | 插入匹配的子串。
* <code>$`</code> | 插入当前匹配的子串左边的内容。
* `$'` | 插入当前匹配的子串右边的内容。
* `$n` | 假如第一个参数是 RegExp对象，并且 n 是个小于100的非负整数，那么插入第 n 个括号匹配的字符串。

这个表格除了`$n`之前用过其他的全部没用过. 也一下没看懂, 写了几段demo, 算是明白了- -, 不过应用场景还不太了解.

```javascript
let str = '123abcXYZ';
console.log(str.replace(/ab/, '-$$-')); //123-$-cXYZ
console.log(str.replace(/ab/, '-$&-')); //123-ab-cXYZ
console.log(str.replace(/ab/, '-$`-')); //123-123-cXYZ
console.log(str.replace(/ab/, '-$\'-')); //123-cXYZ-cXYZ (注意单引号. 转义)
console.log(str.replace(/a(b)/, '-$1-')); //123-b-cXYZ
```

这样在对着上面的解读, 算是明白一点了- -.

## 指定一个函数作为参数

这个表格有点复杂, 直接看[MDN: 指定一个函数作为参数](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/replace#%E6%8C%87%E5%AE%9A%E4%B8%80%E4%B8%AA%E5%87%BD%E6%95%B0%E4%BD%9C%E4%B8%BA%E5%8F%82%E6%95%B0)的表格吧. 我也从来没发现原来repalce的函数第二个参数为函数的时候这么高级.

看了几遍文档给的示例算是明白了, 不过`offset`参数看起来很少用到, 这里也引用它的一个例子.

```javascript
function replacer(match, p1, p2, p3, offset, string) {
  // p1 is nondigits, p2 digits, and p3 non-alphanumerics
  return [p1, p2, p3].join(' - ');
}
var newString = 'abc12345#$*%'.replace(/([^\d]*)(\d*)([^\w]*)/, replacer);
console.log(newString);  // abc - 12345 - #$*%
```

> replace函数, 在某些情境下, 也可以代替循环, 每次匹配结束后的下一次匹配, 都接着上一次的最后一处开始.

突发奇想, 根据已学的知识, 做一个小题目, 列出符合规则的一个字符串中所有结果, 例如有一个字符串`"aoffofffob"`, 匹配`/of*o/g`的有几个, 根据目测是有两个, 不过怎么写呢, 嘿嘿嘿. 赶紧试试.

```javascript
const REGX = /of*o/g;
let str = 'aoffofffob';
let i = j = 0;
let arr;
while (i < str.length) {
  j = i + j;
  let newStr = str.substr(j)
  arr = REGX.exec(newStr);
  if (arr !== null) {
    j += arr.index;
    console.log(`The match part begin at ${j} position`);
  }
  i++;
}
// The match part begin at 1 position
// The match part begin at 4 position
```

本来是昨天提交上去晚上回去弄的- -结果回去才发现, 没推送...这会第二天早上又鼓捣了一会, 暂时就先这样吧= =.