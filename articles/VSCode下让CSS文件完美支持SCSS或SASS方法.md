# VSCode下让CSS文件完美支持SCSS或SASS语法方法

> 习惯Webpack + PostCSS后, 通常`PostCSS`都是直接对`CSS`文件进行处理, 但是大部分习惯SCSS/SASS/LESS的朋友也许不适应了. 我专门研究了一下, 在`Visual Studio Code`编辑器下如果配置相关代码和设置达到CSS文件完美编写SCSS的办法, 其他语法类型原理相似, 这里以`SCSS`为例.

## 开始配置

### Visual Studio Code编辑器设置的配置

首先, 配置编辑器的设置, 按快捷键"`CTRL + ,`"打开用户设置, 添加如下配置片段:

```javascript
"files.associations": {
  "*.css": "scss"
}
```

我这里做了`全局的用户设置`, 因为我个人大部分情况下是写SCSS, 当然如果你仅对该项目配置, 也可以将上面这段放进`工作区设置`(是放在默认**花括号内**哦, 千万不要弄错了~).

这样, VSCode编辑器就会把所有CSS文件当成SCSS格式来解析了, 也就不会出现可怕的红色波浪线了.

### PostCSS的配置

接下来, 对PostCSS进行相关配置. 我们这里需要安装最重要的两个PostCSS插件`postcss-scss`和`precss`. 执行命令:

```bash
npm i -D postcss-scss precss
```

安装好后, 修改项目的`postcss.config.js`配置如下(我另外有用到`autoprefixer`和`cssnano`, 当然你可以根据个人情况选择, 重要部分是**parser: 'postcss-scss'和require('precss')**):

```javascript
module.exports = {
  parser: 'postcss-scss',
  plugins: [
    require('precss'),
    require('autoprefixer'),
    require('cssnano')
  ]
}
```

这样问题就解决了. 试着编译一下以下测试代码:

```scss
/* css文件用scss语法测试 */
$blue: #056ef0;
.test {
  display: flex; // 这是scss注释
  color: $blue;
  .box {
    flex: 1;
  }
}
```

编译后:

```css
.test{display:-webkit-box;display:-ms-flexbox;display:flex;color:#056ef0}.test .box{-webkit-box-flex:1;-ms-flex:1;flex:1}
```

> Tips: 我用了cssnano, 因此注释被自动去除, 如果需要保留, 需参阅cssnano文档进行相关配置.

## 结语

至此, 我们的编辑器和项目都对CSS文件下编写SCSS有了很好的兼容. 至于其他用`SASS`和`LESS`的朋友可以举一反三, 安装对应的插件和修改VSCode设置. 整个操作过程应该花不了十分钟, 以后就能愉快的在CSS文件上面写SCSS啦~ 关于本次测试的代码可以访问[`postcss study`](https://github.com/whidy/postcss-study/tree/precss-%26-scss-synax)查看.

如果文中有误, 或者还有什么疑问欢迎留言~

## 题外

* 如果有人还不是很清楚SCSS和Sass的区别可以阅读[Intro to SCSS for Sass Users](http://sass-lang.com/documentation/file.SCSS_FOR_SASS_USERS.html)

* `postcss-scss`插件到底做了什么? 据我观察, `行注释`会被转换成标准的CSS`块注释`, 而其他的作用还尚未理解, 下面是官方描述:
  > **This module does not compile SCSS.** It simply parses mixins as custom at-rules & variables as properties, so that PostCSS plugins can then transform SCSS source code alongside CSS.
* 关于Webpack + PostCSS环境如何搭建的, 需要哪些依赖包, 大家可以直接看我的前文提到过的[DEMO项目](https://github.com/whidy/postcss-study/tree/precss-%26-scss-synax)
* 关于PostCSS我也才用不到一年, 感觉确实很方便, 几乎可以替代SCSS了, 比如, 以前做项目需要引入第三方插件CSS, 而自己用的是SCSS, 那么Webpack解析就需要两个规则匹配. PostCSS的插件也是非常的丰富, 经过几年的发展, 很多插件为开发工作带来很好的便利. 例如移动端适配的`px`转`rem`单位的插件`postcss-pxtorem`, 我这里也有个完整的[DEMO](https://github.com/whidy/mobileweb), 提供给大家参考~