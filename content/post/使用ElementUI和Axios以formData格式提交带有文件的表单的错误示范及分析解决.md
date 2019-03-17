+++
title = "使用ElementUI和Axios以formData格式提交带有文件的表单的错误示范及分析解决"
date = "2018-02-13"
author = "whidy"
+++

# 使用ElementUI和Axios以formData格式提交带有文件的表单的错误示范及分析解决

> 做Vue项目的时候, 提交数据基本上都是用Axios, 之前做过的表单方面的提交, 并没有过多关注客户端和服务器之间的通信过程. 所以一直对HTTP的head请求头, body内容之类的不明不白, 为了短期(是的估计过半年又忘了😂)解决这个疑惑, 再次复习了一遍. 顺便总结了**Vue中使用Axios处理包含上传文件的表单提交**

## 场景说明

项目使用的Vue(Nuxt)框架, 数据请求用的[Axios](https://github.com/axios/axios)插件, 表单包含了一些基本的用户信息填写, 同时还有身份证上传, 和后端沟通过, 提交数据的时候, 接口全部使用[POST](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Methods/POST)请求, 那么有文件上传的一般来说只能用formData格式.

## 实践及代码示例

我项目中使用的是ElementUI, 对于[上传组件](http://element.eleme.io/#/zh-CN/component/upload#upload-shang-chuan)不熟悉的朋友, 需要注意几个事情:

* action是必填, 那么留空也许是个不错的做法.
* 获取到上传的文件的办法很多. 官方提供了几种事件来获取, 例如: `on-success`, `on-change`(首次上传会触发两次), 我这里使用了`on-success`
* 那么拿到上传的回调, 这里特别需要注意的, 我以`on-success`三个参数来看

    * `response`是服务器返回的响应
    * `file`一个文件
    * `fileList`存放多个文件的数组

    > 可能看到有`file`或者`fileList`会直接将它的数据提交给后台, 一开始我也是没注意到这点, 始终无法正确提交数据. 那么经过一番研究和排查, 得知: **真正的File对象是`fileList`数组中某个元素的`raw`属性!**, 那么下面先看一段错误的示范:

页面部分结构代码如下:

```html
<el-form ref="form" :model="form" label-width="120px">
  <el-form-item label="活动名称">
    <el-input v-model="form.name"></el-input>
  </el-form-item>
  <el-form-item label="活动区域">
    <el-select v-model="form.region" placeholder="请选择活动区域">
      <el-option label="区域一" value="shanghai"></el-option>
      <el-option label="区域二" value="beijing"></el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="身份证正面">
    <el-upload 
      action="" 
      :on-success	="handleSuccess"
      :multiple="false" 
      :limit="1" 
      :on-exceed="handleExceed" 
      :file-list="fileList">
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="onSubmit">提交</el-button>
    <el-button>取消</el-button>
  </el-form-item>
</el-form>
```

这里我将上传文件数量限制为`1`个, 接下来是JavaScript部分:

```javascript
import AppLogo from '~/components/AppLogo.vue'
export default {
  components: {
    AppLogo
  },
  data() {
    return {
      form: {
        name: '',
        region: ''
      },
      fileList: []
    }
  },
  methods: {
    handleSuccess(response, file, fileList) {
      this.fileList = fileList
    },
    handleExceed(files, fileList) {
      this.$message.warning(`最多上传 ${files.length} 个文件`)
    },
    onSubmit() {
      this.$axios
        .$post('/api/active', {
          name: this.form.name,
          region: this.form.region,
          file: this.fileList
        })
        .then(response => {
          if (response.code === 200) {
            // 提交成功将要执行的代码
          }
        })
        .catch(function(error) {
          // console.log(error)
        })
    }
  }
}
```

> 上面的这段`onSubmit`能提交成功就是真的见了鬼呢

### 问题分析

问题在哪呢, 前面提到, 后台接受数据的格式是`multipart/form-data`, 你发个json对象是什么鬼, 没有这方面经验的人肯定就搞不清怎么回事了. 所以一般对这块不熟悉的人容易犯以下的几个错误:

* 不了解上传文件应该以什么方式提交, 比如后台是`multipart/form-data`, 而习惯性以json对象发送数据(因为大量插件对数据对象也封装了方法, 所以容易忽略)
* 不知道上传文件提交的格式, 以为将`this.fileList`改成`this.fileList[0]`就万事大吉
* 当多种疑惑无法解决的时候, 可能会尝试很多次都不行, 陷入误区而久久无法解决困难. 开始怀疑是否是Axios插件不支持文件上传.
* 其他各种别的问题...

### 问题解决

其实, 熟悉的话, 解决这个问题很简单. 前面也说过, elementUI将返回的`file`对象封装了一下, 首先我们要拿到真正的文件对象, 实际上就是`file.raw`或者`fileList[0].raw`!

不要以为这样就可以提交数据了. 我们还要使用`form-data`特有的提交方式来提交带有文件内容的表单. 废话不多说上一段, 修正后的部分代码:

```html
<el-upload 
  action="" 
  :http-request="handleFile" 
  :multiple="false" 
  :limit="1" 
  :on-exceed="handleExceed" 
  :file-list="fileList">
  <el-button size="small" type="primary">点击上传</el-button>
  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
</el-upload>
```

```javascript
onSubmit() {
  let form = this.$refs['form'].$el
  let formData = new FormData(form)
  formData.append('name', this.form.name)
  formData.append('region', this.form.region)
  formData.append('file', this.fileList[0])
  this.$axios
    .$post('/api/active', formData)
    .then(response => {
      if (response.code === 200) {
        // 提交成功将要执行的代码
      }
    })
    .catch(function(error) {
      // console.log(error)
    })
}
```

简单说明下

* 其实elementUI中提供了一个`http-request`事件来覆盖默认的action, 这样很好的避免了一些异常(比如我在测试环境的时候, 用了不太好的的`on-success`通过了验证, 但是在生产环境中由于action地址空所以默认请求当前地址, 出现了404).
* formData似乎只能一个个对应的append进去, console出来也看不到, 具体用法可以参考文章末尾的MDN~
* axios是可以很好地完成formData表单数据提交的, 这里虽然也是一个对象, 但是不是普通的json对象, 他对这个数据处理很正常, 所以放心使用.

## 额外补充: axios配置

> Axios可以说在Vue中相当重要, 经常我们对简单的重新封装或者配置, 就这个插件来说完全可以写一篇新文章了, 这里他不是重点我就简单介绍下我用它做的配置

```javascript
import qs from 'qs'
import { Message } from 'element-ui'
export default function({ $axios, redirect }) {
  let apiUrl = process.env.apiUrl
  $axios.defaults.baseURL = apiUrl
  $axios.defaults.timeout = 15000
  $axios.defaults.headers.post['Content-Type'] = 'multipart/form-data'
  $axios.onRequest(config => {
    // 与后台配合post请求字符串传参
    let reqParams = qs.stringify(config.data)
    let url = config.url + (reqParams ? '?' : '') + reqParams
    config.url = url
  })

  $axios.onResponse(res => {
    if (res.data.code !== 200) {
      // 后台返回session过期或异常的情况
      if (res.data.code === 401 || res.config.url === apiUrl + '/logout') {
        window.sessionStorage.clear()
        redirect('/platform/login')
      } else {
        // 返回到一个错误页面或者提示错误
        Message.error(res.data.message)
        // redirect('/')
      }
    }
  })

  $axios.onError(error => {
    Message.error('服务器异常，请稍后再试')
  })
}
```

上面对发送数据请求的相关参数配置了, 也做了拦截器. `qs`插件是个亮点, 我为了vue代码书写更清晰, 将`json`对象传过来处理为`name=whidy&age=30`类似这样的拼接到url后再发送请求给服务器的.

## 总结

好了说了一大堆, 其实最重要的事情是, 理解以下几点

* 和后端沟通好, 请求格式
* 了解上传文件需要的表单数据格式
* 尽量多的去熟悉第三方UI插件, 尤其像elementUI这样相对完善的组件, 应该是有较好的处理方法的
* 耐心的一步步查找错误

最后献上一些参考资料:

* [MDN的FormData介绍](https://developer.mozilla.org/zh-CN/docs/Web/API/FormData)
* [MDN的使用FormData数据](https://developer.mozilla.org/zh-CN/docs/Web/API/FormData/Using_FormData_Objects)
* [对我帮助很大的来自Axios的Issue](https://github.com/axios/axios/issues/318#issuecomment-218948420)

文中难免也有一些描述不准确的地方, 希望大佬们多多指点~ 本文提到的代码的存放在GitHub上面**nuxt-spa-demo**项目的分支[nuxt-axios-formdata](https://github.com/whidy/nuxt-spa-demo/tree/nuxt-axios-formdata), 有兴趣也可以看看~