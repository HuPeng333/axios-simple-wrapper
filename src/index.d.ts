import {AxiosRequestConfig, AxiosStatic} from 'axios'

export type RejectPolicy = 'REJECT_IF_EXIST' | 'CANCEL_OLD_TASK' | 'NO_POLICY'

export type RequestMethod = 'GET' | 'POST'

export type betterAjaxConfig = {
    url: string,
    method?: RequestMethod,
    // 若为GET请求,默认在url添加参数, 若为POST请求,则默认为请求体添加参数
    param?: any
    rejectPolicy?: RejectPolicy
    axiosConfig?: AxiosRequestConfig
}

type betterAjax = (config: betterAjaxConfig) => Promise<unknown>

interface BetterAjaxStatic {
    <T> (config: betterAjaxConfig): Promise<T>
    baseUrl: string
    noRepeatAjax: SimplyAjaxParam
    cancelOldAjax: SimplyAjaxParam
    axiosStatic: AxiosStatic
    rejectMessage: string
}

export interface SimplyAjaxParam {
    <T> (url: string, param: object, method?: RequestMethod): Promise<T>
}

export declare function noRepeatAjax <T> (url: string, param: object, method?: RequestMethod): Promise<T>
export declare function cancelOldAjax <T> (url: string, param: object, method?: RequestMethod): Promise<T>
export declare const axios: AxiosStatic
declare const betterAjax:BetterAjaxStatic

export default betterAjax
