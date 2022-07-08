"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const assert_1 = require("../util/assert");
const requestUtils_1 = require("../util/requestUtils");
const paramUtils_1 = require("../util/paramUtils");
const requestParam_1 = require("../types/requestParam");
const betterAjax = (config) => {
    const axios = (0, assert_1.nonNull)(index_1.default.default.axios, `'default.axios' is null, you must specific the default axios object to use the function!`);
    const { url } = config;
    let method = config.method ? config.method : 'GET';
    const axiosConfig = Object.assign(Object.assign({}, config.axiosConfig), { url: config.rejectPolicy ? (0, paramUtils_1.appendParam)(url, requestParam_1.default.KEY_REJECT_POLICY, config.rejectPolicy) : url, method });
    if (method === 'GET') {
        if (config.param) {
            axiosConfig.params = config.param;
        }
    }
    else if (method === 'POST') {
        axiosConfig.data = (0, requestUtils_1.parseObjToPostParam)(config.param);
        if (!axiosConfig.headers) {
            axiosConfig.headers = {};
        }
        axiosConfig.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    }
    return axios(axiosConfig);
};
exports.default = betterAjax;
