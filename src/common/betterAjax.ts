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
  param?: any
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
    axiosConfig.headers['Content-Type'] = 'application/x-www-form-urlencoded'
  }
  return axios(axiosConfig)
}

export default betterAjax
