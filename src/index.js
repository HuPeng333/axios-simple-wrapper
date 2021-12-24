const axios = require('axios')
const missionManager = require('./missionManager.js')
const {parseObjToPostParam} = require("./util/postParamUtil")

/**
 * 发送请求
 * @param {Object} config
 */
function betterAjax(config) {
    const url = config.url
    const token = missionManager.addMission(url, config.rejectPolicy ? config.rejectPolicy : 'REJECT_IF_EXIST', betterAjax.rejectMessage)
    const method = config.method ? config.method : 'GET'
    const axiosConfig = {
        ...config.axiosConfig,
        url,
        method,
        cancelToken: token
    }

    if (method === 'GET') {
        axiosConfig.params = config.param
    } else {
        axiosConfig.data = parseObjToPostParam(config.param)
    }

    return axios(
       axiosConfig
    ).finally(() => {
        // 移除任务
        missionManager.removeMission(url)
    })
}

betterAjax.axios = axios
betterAjax.noRepeatAjax = (url, param, method = 'GET') => {
    return betterAjax({
        url,
        method,
        rejectPolicy: 'REJECT_IF_EXIST',
        param
    })
}
betterAjax.cancelOldAjax = (url, param, method = 'GET') => {
    return betterAjax({
        url,
        method,
        rejectPolicy: 'CANCEL_OLD_TASK',
        param
    })
}
module.exports = betterAjax




