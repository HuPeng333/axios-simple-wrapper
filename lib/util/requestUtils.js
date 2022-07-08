"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseObjToPostParam = void 0;
/**
 * 构建post请求的参数
 * @param postParam {Object} post请求参数
 */
const parseObjToPostParam = (postParam) => {
    if (!postParam || typeof postParam != 'object') {
        return '';
    }
    let params = '';
    Object.keys(postParam).forEach(key => {
        params += (key + '=' + postParam[key] + '&');
    });
    // 替换最后一个多余的&符号
    const len = params.length;
    if (len === 0) {
        return '';
    }
    else {
        return encodeURIComponent(params.substring(0, len - 1));
    }
};
exports.parseObjToPostParam = parseObjToPostParam;
