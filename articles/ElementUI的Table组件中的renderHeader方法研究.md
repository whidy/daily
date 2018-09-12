# ElementUI的Table组件中的renderHeader方法研究

项目使用ElementUI，挺好用的，页面中有些地方的**帮助提示**通过使用组件`Tooltip`和`el-icon-question`来展示，代码如下：

```vue
<div class="title">本月累计收益
  <el-tooltip class="item" content="截止至昨日本月累计收益" placement="top">
    <span class="el-icon-question"></span>
  </el-tooltip>
</div>
```

截图如下：

![帮助提示效果](https://raw.githubusercontent.com/whidy/daily/master/sources/images/2018-08-31-1.png)

*另外也可以看看jsfiddle的[demo](https://jsfiddle.net/kingterrors/s4pxtzva/)*

全站很多地方都有都需要这样的帮助提示，其中有些**需要在表格表头添加**，似乎有点难度。效果如下：

![带有帮助提示的表头效果](https://raw.githubusercontent.com/whidy/daily/master/sources/images/2018-08-31-2.png)

因为ElementUI上面的文档对这块自定义表头没有什么参考的文档，是否能够实现心里没底，去仔细翻了文档，发现有个`renderHeader`的函数可以实现，一直以为Vue还算比较熟悉的我有点点懵，这是个啥？？？

## renderHeader（函数渲染）

在我短暂的Vue项目开发实践中，这个用的很少所以并不是很熟悉，[官方解释](https://cn.vuejs.org/v2/guide/render-function.html)：

> Vue 推荐在绝大多数情况下使用 template 来创建你的 HTML。然而在一些场景中，你真的需要 JavaScript 的完全编程的能力，这就是 render 函数，它比 template 更接近编译器。

ElementUI中的`renderHeader`就是**对列标题Label区域渲染使用的Function**，通过他实现自定义表头label功能！万变不离其宗，这个函数一看就像是：

```javascript
// 官方示例 
render: function (createElement) {
  return createElement('h1', this.blogTitle)
}
```

而ElementUI的示例：`Function(h, { column, $index })`，看起来挺像的。结合[`createElement`](https://cn.vuejs.org/v2/guide/render-function.html#createElement-%E5%8F%82%E6%95%B0)看看粗略写出来了一个勉强能用的：

```javascript
renderHeader(h, { column, $index }) {
  return h(
    'el-tooltip',
    {
      props: {
        content: (function() {
          let label = column.label
          switch (label) {
            case '访问数':
              return '网站页面上独立访问应用的人数（UV）'
              break
            case '提交数':
              return '网站页面上访客在应用上完成提交的数量'
              break
            case '成交数':
              return '网站页面上最终成功在应用上完成提交的数量'
              break
          }
        })(),
        placement: 'top'
      },
      domProps: {
        innerHTML: column.label + '<span class="el-icon-question"></span>'
      }
    },
    [h('span')]
  )
},
// ...
```

但是很奇怪的是，最后面我要接上这个`[h('span')]`才行（[demo](https://jsfiddle.net/kingterrors/x3ouw27k/11/)）。

这种写法我还是参考[element table 自定义表头](https://blog.csdn.net/u010214074/article/details/79474725)，但是假设我写成`[h('span', 'test')]`是无法展现出test的效果的（[demo](https://jsfiddle.net/kingterrors/x3ouw27k/16/)）。根据vue文档中解释的第三个参数，这里最为一个数组，为何`span`成了`el-tooltip`的HTML标签，我还是不解。

之所以奇怪是因为假设我将引入的组件换成`el-button`，见如下代码：

```javascript
renderHeader(h, { column, $index }) {
  return h(
    'el-button',
    {
      props: {
        content: (function() {
          let label = column.label
        })()
      },
      domProps: {
        innerHTML: column.label + '<span class="el-icon-question"></span>'
      }
    }
  )
},
// ...
```

就不需要后面的那个`[h('span')]`。同样能呈现出button结合icon的正确效果（[demo](https://jsfiddle.net/kingterrors/x3ouw27k/17/)）。难道是因为这个组件自带HTML标签？胡乱猜疑是解决不了问题的。几番尝试，还是没能改进到最优。不过进度问题，暂时只能使用这个勉强版本。

> 为何称之为勉强版，因为从上面的[demo](https://jsfiddle.net/kingterrors/x3ouw27k/11/)也看出来了。这个提示交互和我文章之前写的交互是有区别的，正确交互是：**光标移入问号的图标上才会展示提示框**，虽然目前勉强版影响不大，却一直在心中如一个疙瘩。于是过了一周，决定抽空把这个问题处理好，就有了新的写法。

勉强版虽然没有大碍，但是心中略有不爽。几日后专门抽点时间多次阅读各种实例，仔细阅读文档，反复尝试各种写法。终于写出了一个相对良好的版本，直接先上代码：

```javascript
renderHeader(h, { column, $index }) {
  return [
    column.label,
    h(
      'el-tooltip',
      {
        props: {
          content: (function() {
            let label = column.label
            switch (label) {
              case '访问数':
                return '网站页面上独立访问应用的人数（UV）'
                break
              case '提交数':
                return '网站页面上访客在应用上完成提交的数量'
                break
              case '成交数':
                return '网站页面上最终成功在应用上完成提交的数量'
                break
            }
          })(),
          placement: 'top'
        }
      },
      [
        h('span', {
          class: {
            'el-icon-question': true
          }
        })
      ]
    )
  ]
}
```

这个写法很特别，return的是一个数组，这个写法我又是哪里看到的呢？来自[elementUI的table组件的表头自定义：想把单位换行，有什么解决方法吗？](https://segmentfault.com/q/1010000012587913/a-1020000012588616)的采纳回复中。乍一看有点乱七八糟，不过仔细想想，之前的提示在整个表头都触发了，现在这个数组大概起到了拼接作用，也就是将不需要出发的textNode部分提了出来。再看数组第二个值，这便是一个完整的示例了。

但是其实还是有个疑问的为什么这里`h(param1, param2, param3)`的第三个参数用数组，并嵌套了一个h渲染对应的是

写到这里，差不多就总结了。