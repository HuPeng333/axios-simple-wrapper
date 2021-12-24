# betterAjax

based on the 'axios', using to send ajax quickly, 
and provided multiply plans to prevent the same requests been sent in a time

[Chinese Docs](./README.md)

## Quick Start
It contains 3 mainly method, which include two simply method and a complex method

### Default export method
```js
import betterAjax from "better-ajax"

betterAjax({
  url: 'http://localhost:8080',
  method: 'GET',
  param: {name: 'abc'},
  rejectPolicy: 'REJECT_IF_EXIST',
  axiosConfig: {
    responseType: 'json'
  }
})
```
**Params**

| Param Name | declare | type |
| :----:   | :----:   | :----: |
| url     | request url   |  string |
| method  | request method, default is 'GET' | 'GET' ,'POST' |
| param  | request param, it will cast automatically to request body when it is 'POST' method | object |
|rejectPolicy | reject policy, see more details below | string |
|axiosConfig | display the axios config, see more details below  | axiosConfig |

**rejectPolicy**
- REJECT_IF_EXIST (default): if there is a same request is working, it will reject the current request
- CANCEL_OLD_TASK: cancel the old request if existed, and run the new request
- NO_POLICY: never reject or stop request

when a request is been rejected, it will throw an Error, you can display the error message like this:
```js
import betterAjax from 'better-ajax'

betterAjax.rejectMessage = 'your message'
// when a request is benn rejected, it will run 'thorw new Error(betterAjax.rejectMessage)'
```

**axiosConfig**
your axiosConfig will be used like this

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

### Additional Function
for fast development, we provided two more simply function

```js
import { noRepeatAjax, cancelOldAjax} from "better-ajax"

// use the 'REJECT_IF_EXIST' policy to create request
noRepeatAjax('http://localhost:8080', {name: 'abc'})
noRepeatAjax('http://localhost:8080', {name: 'abc'}, 'GET')
noRepeatAjax('http://localhost:8080', {name: 'abc'}, 'POST')

// use the 'CANCEL_OLD_TASK' policy to create request
cancelOldAjax('http://localhost:8080', {name: 'abc'})
cancelOldAjax('http://localhost:8080', {name: 'abc'}, 'GET')
cancelOldAjax('http://localhost:8080', {name: 'abc'}, 'POST')

```

*we don't provide the function based on the 'NO_POLICY' policy*

## About the dependence
This dependence is totally based on the 'axios'! So the axios config is still can be used!
```js
// ------------ √ ------------
import { axios } from 'better-ajax'

axios.defaults.baseURL = 'http://localhost:8080'
// ------------ √ ------------


// ------------ X ------------ don't import like this!
import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:8080'
// ------------ X ------------
```
