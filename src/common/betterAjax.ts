import {AxiosPromise, AxiosRequestConfig, Method} from "axios";
import wrapper from '../index'
import {nonNull} from "../util/assert";
import {parseObjToPostParam} from "../util/requestUtils";
import {appendParam} from "../util/paramUtils";
import {RejectPolicy} from "../interceptor/debounce";
import requestParam from "../types/requestParam";

type AjaxConfig = {
  url: string
  method?: Method
  param?: Record<string, string | number>
  rejectPolicy?: RejectPolicy
  axiosConfig?: AxiosRequestConfig
}

const betterAjax = <T> (config: AjaxConfig):AxiosPromise<T> => {
  const axios = nonNull(
    wrapper.default.axios,
    `'default.axios' is null, you must specific the default axios object to use the function!`
  )
  const {url} = config
  let method = config.method ? config.method : 'GET'
  const axiosConfig:AxiosRequestConfig = {
    ...config.axiosConfig,
    url: config.rejectPolicy ? appendParam(url, requestParam.KEY_REJECT_POLICY, config.rejectPolicy) : url,
    method,
  }

  if (method === 'GET') {
    if (config.param) {
      axiosConfig.params = config.param
    }
  } else if (method === 'POST'){
    axiosConfig.data = parseObjToPostParam(config.param)
    if (!axiosConfig.headers) {
      axiosConfig.headers = {}
    }
    axiosConfig.headers['content-type'] = 'application/x-www-form-urlencoded'
  }
  return axios(axiosConfig)
}

export interface Ajax {
  <T, Clean = undefined > (url: string, param?: Record<string, string | number>, method?: Method): AjaxResponseTypes<T, Clean>
  // <b>该重载将直接将所有参数丢给axios，需要自己进行数据处理，但是拦截器仍然会生效</b>
  <T, Clean = undefined> (axios: AxiosRequestConfig): AjaxResponseTypes<T, Clean>
}
export type AjaxResponseTypes<T, Clean> = true extends Clean ? Promise<T> : AxiosPromise<T>

export default betterAjax
