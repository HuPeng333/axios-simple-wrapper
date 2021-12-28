# axios-simple-wrapper
基于axios进行二次封装，用于快速发送ajax请求，并提供多种防抖方案，方便快速开发。

[Github](https://github.com/HuPeng333/axios-simple-wrapper)

[English Docs](https://github.com/HuPeng333/axios-simple-wrapper/blob/master/README-en.md)

## 快速开始
安装
```shell
npm i axios-simple-wrapper --save
```

内置3个常用方法, 其中有2个比较小巧的方法和一个比较原始的方法(即默认导出的方法)
### 默认导出方法
```js
import ajax from "axios-simple-wrapper"

ajax({
  url: 'http://localhost:8080',
  method: 'GET',
  param: {name: 'abc'},
  rejectPolicy: 'REJECT_IF_EXIST',
  axiosConfig: {
    responseType: 'json'
  }
})
```


**参数说明**

| 参数名称 | 说明 | 可用值/类型 |
| :----:   | :----:   | :----: |
| url     | 请求url   |  string |
| method  | 请求方法, 不写为GET | 'GET' 'POST' ... |
| param  | 请求参数,若为POST请求会自动转换为请求体 | object |
|rejectPolicy | 防抖策略, 详细说明见下方 | string |
|axiosConfig | 自定义axios配置, 详细说明见下方 | axiosConfig |

**拒绝策略**

- REJECT_IF_EXIST (default): 如果有重复的任务，则不执行该任务
- CANCEL_OLD_TASK: 如果有重复的任务，取消先前的旧任务，执行新任务
- NO_POLICY: 永远不阻止该请求

当一个请求被拒绝时, 它会抛出一个错误, 你可以这样来自定义抛出的错误信息:
```js
import ajax from 'axios-simple-wrapper'

ajax.rejectMessage = 'your message'
// 在内部, 会使用 thorw new Error(betterAjax.rejectMessage) 来抛出异常
```

**自定义axios配置**

传入的axiosConfig会被这样使用

```js
import axios from 'axios'

function betterAjax() {
  
  // ...

  axios({
    ...axiosConfig,
    url,
    method
  })
}
```

### 额外方法
为了方便快速开发，我们还提供了另外两种简单的方法
```js
import { noRepeatAjax, cancelOldAjax } from "axios-simple-wrapper"

// 使用REJECT_IF_EXIST策略快速创建请求
noRepeatAjax('http://localhost:8080', {name: 'abc'})
noRepeatAjax('http://localhost:8080', {name: 'abc'}, 'GET')
noRepeatAjax('http://localhost:8080', {name: 'abc'}, 'POST')

// 使用CANCEL_OLD_TASK策略快速创建请求
cancelOldAjax('http://localhost:8080', {name: 'abc'})
cancelOldAjax('http://localhost:8080', {name: 'abc'}, 'GET')
cancelOldAjax('http://localhost:8080', {name: 'abc'}, 'POST')

```
*不提供 NO_POLICY 策略的相关方法*

## 关于本依赖的封装
由于本依赖完全基于axios的二次封装，所以axios的配置仍然可以用于本依赖中! 但是在配置中请不要直接导入axios

```js
// ------------ √ ------------
import { axios } from 'axios-simple-wrapper'

axios.defaults.baseURL = 'http://localhost:8080'
// ------------ √ ------------


// ------------ X ------------ 直接导入后配置是无效的
import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:8080'
// ------------ X ------------
```
