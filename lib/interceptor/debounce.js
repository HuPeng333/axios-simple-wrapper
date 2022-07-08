"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestRejectError = void 0;
const paramUtils_1 = require("../util/paramUtils");
const requestParam_1 = require("../types/requestParam");
const manager = new Map();
const debounceManager = (axios) => {
    return {
        addMission(url, policy, rejectMessage = 'the request is rejected because of the RejectPolicy') {
            const cancelTokenSource = axios.CancelToken.source();
            const task = manager.get(url);
            const token = cancelTokenSource.token;
            if (task != null) {
                if (policy === 'cancelOldTask') {
                    task.cancel();
                }
                else if (policy === 'rejectIfExist') {
                    throw new Error(rejectMessage);
                }
            }
            manager.set(url, cancelTokenSource);
            return token;
        },
        /**
         * 移除一个任务
         * @param {string} url 任务url
         */
        removeMission(url) {
            if (!url) {
                return;
            }
            manager.delete(url);
        }
    };
};
const checkPolicy = (policy) => {
    if (!policy) {
        return 'rejectIfExist';
    }
    if (policy === 'rejectIfExist' || policy === 'cancelOldTask' || policy === 'noPolicy') {
        return policy;
    }
    else {
        console.warn(`unknown reject policy: ${policy}, it will use 'rejectIfExist' instead`);
        return 'rejectIfExist';
    }
};
/**
 * 结构与AxiosError相同, 以便能够拿到config和message
 */
class RequestRejectError {
    constructor(config, message = '您点击的太快了!') {
        this.config = config;
        this.message = message;
    }
}
exports.RequestRejectError = RequestRejectError;
const defaultDebounceInterceptorConfig = {
    rejectErrorClass: RequestRejectError
};
function applyDebounceInterceptor(axios, interceptorConfig = defaultDebounceInterceptorConfig) {
    const manager = debounceManager(axios);
    axios.interceptors.request.use(config => {
        if (!config.url) {
            return config;
        }
        const paramMap = (0, paramUtils_1.getRequestExtraParam)(config.url);
        try {
            const cancelToken = manager.addMission(config.url, checkPolicy(paramMap === null || paramMap === void 0 ? void 0 : paramMap.get(requestParam_1.default.KEY_REJECT_POLICY)));
            Object.assign(config, {
                cancelToken
            });
        }
        catch (e) {
            // error只能从manager.addMission方法中产生
            if (interceptorConfig.disableOnDevelopmentMode && process.env.NODE_ENV == 'development') {
                console.log(`find repeat request: ${config.url}`);
                return config;
            }
            else {
                return Promise.reject(new interceptorConfig.rejectErrorClass(config));
            }
        }
        return config;
    });
    if (process.env.NODE_ENV === 'test') {
        // 测试
        axios.interceptors.response.use(value => {
            const map = (0, paramUtils_1.getRequestExtraParam)(value.config.url);
            const remove = map === null || map === void 0 ? void 0 : map.get('removeRequest');
            if (remove && remove === 'true') {
                manager.removeMission(value.config.url);
            }
            return value;
        }, error => {
            const map = (0, paramUtils_1.getRequestExtraParam)(error.config.url);
            const remove = map === null || map === void 0 ? void 0 : map.get('removeRequest');
            if (remove && remove === 'true') {
                manager.removeMission(error.config.url);
            }
            return Promise.reject(error);
        });
    }
    else {
        // 正常开发或生产用
        axios.interceptors.response.use(value => {
            manager.removeMission(value.config.url);
            return value;
        }, error => {
            if (error.config && error.config.url) {
                manager.removeMission(error.config.url);
            }
            return Promise.reject(error);
        });
    }
}
exports.default = applyDebounceInterceptor;
