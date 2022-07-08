import { AxiosPromise, AxiosRequestConfig, AxiosStatic, Method } from "axios";
import { DebounceInterceptorConfig, RejectPolicy as _RejectPolicy, RequestRejectError as _RequestRejectError } from "./interceptor/debounce";
import { DefaultExportType } from "./types/defaults";
export declare type RequestRejectError = _RequestRejectError;
export declare type RejectPolicy = _RejectPolicy;
/**
 * 设置防抖拦截器
 * @see RejectPolicy 三种防抖策略
 * @param axios axios实例
 * @param interceptorConfig 拦截器设置
 */
export declare const applyDebounceInterceptor: (axios: AxiosStatic, interceptorConfig?: DebounceInterceptorConfig) => void;
interface Ajax {
    <T>(url: string, param?: Record<string, string | number>, method?: Method): AxiosPromise<T>;
    <T>(axios: AxiosRequestConfig): AxiosPromise<T>;
}
export declare const noRepeatAjax: Ajax;
export declare const cancelOldAjax: Ajax;
declare const defaultValue: DefaultExportType;
export default defaultValue;
