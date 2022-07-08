import {AxiosRequestConfig, AxiosStatic, CancelTokenSource} from "axios";
import {getRequestExtraParam} from "../util/paramUtils";
import param from "../types/requestParam";

const manager = new Map<string, CancelTokenSource>()

export type RejectPolicy = 'rejectIfExist' | 'cancelOldTask' | 'noPolicy'

const debounceManager = (axios: AxiosStatic) => {
  return {
    addMission (url: string, policy: RejectPolicy, rejectMessage = 'the request is rejected because of the RejectPolicy') {
      const cancelTokenSource = axios.CancelToken.source()
      const task = manager.get(url)
      const token = cancelTokenSource.token
      if (task != null) {
        if (policy === 'cancelOldTask') {
          task.cancel()
        } else if (policy === 'rejectIfExist') {
          throw new Error(rejectMessage)
        }
      }
      manager.set(url, cancelTokenSource)
      return token
    },
    /**
     * 移除一个任务
     * @param {string} url 任务url
     */
    removeMission (url?: string) {
      if (!url) {
        return
      }
      manager.delete(url)
    }
  }
}

const checkPolicy = (policy?: string): RejectPolicy =>{
  if (!policy) {
    return 'rejectIfExist'
  }
  if (policy === 'rejectIfExist' || policy === 'cancelOldTask' || policy === 'noPolicy') {
    return policy
  } else {
    console.warn(`unknown reject policy: ${policy}, it will use 'rejectIfExist' instead`)
    return 'rejectIfExist'
  }
}

/**
 * 结构与AxiosError相同, 以便能够拿到config和message
 */
export class RequestRejectError {

  public config: AxiosRequestConfig

  public message: string

  constructor(config: AxiosRequestConfig, message = '您点击的太快了!') {
    this.config = config
    this.message = message
  }

}

export interface DebounceInterceptorConfig {
  /**
   * 在开发模式下不阻止重复请求，但会在控制台打印.
   * <p/>在React18的严格模式中, 若在useEffect中发送请求, 可能会重复发送两次造成重复请求
   */
  disableOnDevelopmentMode?: boolean
  /**
   * 当出现错误时, 返回使用该构造器构造的实例
   */
  rejectErrorClass?: {new (...args: ConstructorParameters<typeof RequestRejectError>): RequestRejectError}
}

const defaultDebounceInterceptorConfig: DebounceInterceptorConfig = {
}

export default function(
  axios: AxiosStatic,
  interceptorConfig: DebounceInterceptorConfig = defaultDebounceInterceptorConfig
) {
  const manager = debounceManager(axios)

  axios.interceptors.request.use(config => {
    if (!config.url) {
      return config
    }
    const paramMap = getRequestExtraParam(config.url)
    try {
      const cancelToken = manager.addMission(config.url, checkPolicy(paramMap?.get(param.KEY_REJECT_POLICY)))
      Object.assign(config, {
        cancelToken
      })
    } catch (e: any) {
      // error只能从manager.addMission方法中产生
      if (interceptorConfig.disableOnDevelopmentMode && process.env.NODE_ENV == 'development') {
        console.log(`find repeat request: ${config.url}`)
        return config
      } else {
        let cons = interceptorConfig.rejectErrorClass ? interceptorConfig.rejectErrorClass : RequestRejectError
        return Promise.reject(new cons(config))
      }
    }
    return config
  })

  if (process.env.NODE_ENV === 'test') {
    // 测试
    axios.interceptors.response.use(value => {
      const map = getRequestExtraParam(value.config.url)
      const remove = map?.get('removeRequest')
      if (remove && remove === 'true') {
        manager.removeMission(value.config.url)
      }
      return value
    }, error => {
      const map = getRequestExtraParam(error.config.url)
      const remove = map?.get('removeRequest')
      if (remove && remove === 'true') {
        manager.removeMission(error.config.url)
      }
      return Promise.reject(error)
    })
  } else {
    // 正常开发或生产用
    axios.interceptors.response.use(value => {
      manager.removeMission(value.config.url)
      return value
    }, error => {
      if (error.config && error.config.url) {
        manager.removeMission(error.config.url)
      }
      return Promise.reject(error)
    })
  }
}
