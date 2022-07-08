import { AxiosRequestConfig, AxiosStatic } from "axios";
export declare type RejectPolicy = 'rejectIfExist' | 'cancelOldTask' | 'noPolicy';
/**
 * 结构与AxiosError相同, 以便能够拿到config和message
 */
export declare class RequestRejectError {
    config: AxiosRequestConfig;
    message: string;
    constructor(config: AxiosRequestConfig, message?: string);
}
export interface DebounceInterceptorConfig {
    /**
     * 在开发模式下不阻止重复请求，但会在控制台打印.
     * <p/>在React18的严格模式中, 若在useEffect中发送请求, 可能会重复发送两次造成重复请求
     */
    disableOnDevelopmentMode?: boolean;
    /**
     * 当出现错误时, 返回使用该构造器构造的实例
     */
    rejectErrorClass: {
        new (...args: ConstructorParameters<typeof RequestRejectError>): RequestRejectError;
    };
}
export default function applyDebounceInterceptor(axios: AxiosStatic, interceptorConfig?: DebounceInterceptorConfig): void;
