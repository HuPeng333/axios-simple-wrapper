"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelOldAjax = exports.noRepeatAjax = exports.applyDebounceInterceptor = void 0;
const axios_1 = require("axios");
const debounce_1 = require("./interceptor/debounce");
const betterAjax_1 = require("./common/betterAjax");
/**
 * 设置防抖拦截器
 * @see RejectPolicy 三种防抖策略
 * @param axios axios实例
 * @param interceptorConfig 拦截器设置
 */
const applyDebounceInterceptor = (axios, interceptorConfig) => {
    (0, debounce_1.default)(axios, interceptorConfig);
};
exports.applyDebounceInterceptor = applyDebounceInterceptor;
const noRepeatAjax = (p1, p2, p3) => {
    if (typeof p1 === 'string') {
        return (0, betterAjax_1.default)({
            // 不添加参数, 默认就是rejectIfExist
            // url: appendParam(p1, 'rejectPolicy', 'rejectIfExist'),
            url: p1,
            method: p3,
            param: p2,
        });
    }
    else {
        return (0, axios_1.default)(p1);
    }
};
exports.noRepeatAjax = noRepeatAjax;
const cancelOldAjax = (p1, p2, p3) => {
    if (typeof p1 === 'string') {
        return (0, betterAjax_1.default)({
            url: p1,
            method: p3,
            param: p2,
            rejectPolicy: 'cancelOldTask'
        });
    }
    else {
        return (0, axios_1.default)(p1);
    }
};
exports.cancelOldAjax = cancelOldAjax;
const defaultValue = {
    default: {}
};
exports.default = defaultValue;
