import axios, {AxiosPromise, AxiosRequestConfig, AxiosStatic, Method} from "axios";
import _applyDebounceInterceptor,{
  DebounceInterceptorConfig,
  RejectPolicy as _RejectPolicy,
  RequestRejectError as _RequestRejectError
} from "./interceptor/debounce";
import {DefaultExportType} from "./types/defaults";
import betterAjax from "./common/betterAjax";
import {appendParam} from "./util/paramUtils";

export type RequestRejectError = _RequestRejectError
export type RejectPolicy = _RejectPolicy
/**
 * 设置防抖拦截器
 * @see RejectPolicy 三种防抖策略
 * @param axios axios实例
 * @param interceptorConfig 拦截器设置
 */
export const applyDebounceInterceptor = (
  axios: AxiosStatic,
  interceptorConfig?: DebounceInterceptorConfig
) => {
  _applyDebounceInterceptor(axios, interceptorConfig)
}

interface Ajax {
  <T> (url: string, param?: Record<string, string>, method?: Method): AxiosPromise<T>
  <T> (axios: AxiosRequestConfig): AxiosPromise<T>
}

export const noRepeatAjax:Ajax =
  <T> (p1: string | AxiosRequestConfig, p2?: Record<string, string>, p3?: Method):AxiosPromise<T> => {
  if (typeof p1 === 'string') {
    return betterAjax<T>({
      url: p1,
      method: p3,
      param: p2,
    })
  } else {
    return axios(p1)
  }
}

export const cancelOldAjax:Ajax =
  <T> (p1: string | AxiosRequestConfig, p2?: Record<string, string>, p3?: Method):AxiosPromise<T> => {
    if (typeof p1 === 'string') {
      return betterAjax<T>({
        url: p1,
        method: p3,
        param: p2,
        rejectPolicy: 'cancelOldTask'
      })
    } else {
      // --
      p1.url = p1.url ? appendParam(p1.url, 'rejectPolicy', 'cancelOldAjax') : p1.url
      return axios(p1)
    }
  }



const defaultValue:DefaultExportType = {
  default: {}
}

export default defaultValue
