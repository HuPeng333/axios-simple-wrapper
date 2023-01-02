# axios-simple-wrapper

基于axios, 提供各种常用的拦截器以便于快速开发

## 安装

安装
```shell
npm i axios-simple-wrapper --save
```

## 拦截器
### 防抖拦截器
添加axios拦截器用于防抖(防止同一时间内重复发送某个请求)
```typescript
import {applyDebounceInterceptor} from 'axios-simple-wrapper'
import axios from 'axios'

applyDebounceInterceptor(axios, {/* 其它配置 */})
```
一共有3种防抖策略: 不允许重复的请求, 若重复则取消之前的请求, 无策略

默认会使用'不允许重复的请求', 若要重复指定, 可以在url后添加一个 *#* 号, 然后利用url传参的方式设置, 如下面样例所示:
```typescript
import axios from "axios";

// 应用拦截器后默认使用'不允许重复的请求'策略
axios.method('https://localhost')

// 或者可以手动指定
// 使用'不允许重复的请求'策略
axios.method('https://localhost#rejectPolicy=rejectIfExist')
// 使用'若重复则取消之前的请求'策略
axios.method('https://localhost#rejectPolicy=cancelOldTask')
// 使用'无策略'
axios.method('https://localhost#rejectPolicy=noPolicy')
```

#### 可用配置:

|            名称            |         类型         |                         说明                          |
|:------------------------:|:------------------:|:---------------------------------------------------:|
| disableOnDevelopmentMode |      boolean       | 在开发模式下关闭拦截; 例如在React18+中, 生命周期函数(钩子)可能会被重复调用而造成请求重复 |
|     rejectErrorClass     | RequestRejectError |              当使用'不允许重复的请求'策略时, 抛出的异常类型              |

#### 判断任务是否被取消
如果使用的是'不允许重复的请求'策略, 可以将请求`catch`的异常对象使用`instanceof`与`RequestRejectError`进行比较

如果是'不允许重复的请求'策略, 可以与`CanceledError`进行比较
详细请见: [rejectErrorClass用法](#usageOfRejectErrorClass)


<h4 id="usageOfRejectErrorClass">rejectErrorClass用法</h4>

```typescript
import {RequestRejectError} from 'axios-simple-wrapper'
import axios from "axios";

class RejectError extends RequestRejectError {
  constructor(config: AxiosRequestConfig, message?: string) {
    super(config, message)
  }
}

applyDebounceInterceptor(axios, {
  rejectErrorClass: RejectError
})

axios.get('url').catch(err => {
  if (err instanceof RequestRejectError) {
    // 任务被拒绝了
  }
})
```

## 额外工具
### 快速发送防抖请求

```typescript
import axiosWrapper, {applyDebounceInterceptor, cancelOldAjax, noRepeatAjax} from 'axios-simple-wrapper'
import axios from 'axios'

// 将axios传过去! 不然会报错
axiosWrapper.default.axios = axios
applyDebounceInterceptor(axios)

// 这种只支持GET和POST请求，对象会被自动解析为application/x-www-form-urlencoded格式
noRepeatAjax('url', {msg: 'HelloWorld'}, 'POST')
cancelOldAjax('url', {msg: 'HelloWorld'}, 'GET')

// 若要使用其它方法可以将AxiosConfig直接传入(这里是直接将参数全丢给了Axios，请求数据需要自己处理，但拦截器仍然有效)
noRepeatAjax({
  url: 'url',
  method: 'PUT'
})
cancelOldAjax({
  url: 'url',
  method: 'DELETE'
})
```
在发送GET请求时,参数会自动添加到url上; 发送POST请求则添加到请求体上, `Content-Type`为`application/x-www-form-urlencoded`,

#### 高级用法
在**Typescript**下发送请求，一般需要声明返回值的类型，而axios请求的返回值是`AxiosPromise`, 其本质是`Promise<AxiosResponse>`, 
返回类型默认被`AxiosResponse`包装, 其`data`属性就是响应体的数据：

```typescript
import axios, {AxiosResponse} from "axios";

// 泛型指定响应体的类型为number
axios.get<number>('url').then((response: AxiosResponse) => {
  const responseBody = response.data
  // true
  console.log(responseBody === 'number')
})
```

但有些时候，我们可能设置了一些拦截器或者过滤器，导致返回的结果并不是`AxiosResponse`对象，而且无法直接通过axios自带泛型来声明返回值的类型

因此在上面两个方法中额外声明了一个泛型`Clean`, 将其设置为`true`, 返回值的类型将不会再被`AxiosResponse`包装:

```typescript
import axios from "axios";

type Person = {/*...*/}

// 类型为: AxiosPromise<Person> 也可以理解为 Promise<AxiosResponse<Person>>
noRepeatAjax<Person>('url')

// 类型为: Promise<Person>
noRepeatAjax<Person, true>('url')

```
