import { AxiosPromise, AxiosRequestConfig, Method } from "axios";
import { RejectPolicy } from "../interceptor/debounce";
declare type AjaxConfig = {
    url: string;
    method?: Method;
    param?: any;
    rejectPolicy?: RejectPolicy;
    axiosConfig?: AxiosRequestConfig;
};
declare const betterAjax: <T>(config: AjaxConfig) => AxiosPromise<T>;
export default betterAjax;
