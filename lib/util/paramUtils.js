"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appendParam = exports.isWanted = exports.existExtraParam = exports.getRequestExtraParam = void 0;
const getRequestExtraParam = (url) => {
    if (!url) {
        return null;
    }
    const paramStrMatch = url.match(/#.+/);
    if (!paramStrMatch) {
        return null;
    }
    const paramMap = new Map();
    paramStrMatch[0].replace('#', '').split('&').forEach(value => {
        const kv = value.split("=");
        if (kv.length !== 2) {
            return;
        }
        paramMap.set(kv[0], kv[1]);
    });
    return paramMap;
};
exports.getRequestExtraParam = getRequestExtraParam;
const existExtraParam = (url, param) => {
    if (!url) {
        return false;
    }
    return new RegExp(`[#|,]${param}=`).test(url);
};
exports.existExtraParam = existExtraParam;
const isWanted = (wanted, value) => {
    if (!value) {
        return false;
    }
    return wanted === value;
};
exports.isWanted = isWanted;
const appendParam = (url, key, value) => {
    if (url.search('#') !== -1) {
        return `${url}&${key}=${value}`;
    }
    else {
        return `${url}#${key}=${value}`;
    }
};
exports.appendParam = appendParam;
