const axios = require('axios')

/**
 * 任务列表
 * @type {Map<string, CancelTokenSource>}
 */
const manager = new Map()



const missionManager = {
    /**
     * 添加一个任务
     * @param {string} url
     * @param {'REJECT_IF_EXIST' | 'CANCEL_OLD_TASK' | 'NO_POLICY'} policy 拒绝策略
     * @param {string} rejectMessage 当出现错误时抛出的自定义信息
     * @return {CancelToken} 取消token,将其添加到axios中
     */
    addMission (url, policy, rejectMessage = 'the request is rejected because of the RejectPolicy') {
        const cancelTokenSource = axios.CancelToken.source()

        const task = manager.get(url)

        const token = cancelTokenSource.token
        if (task != null) {
            if (policy === 'CANCEL_OLD_TASK') {
                task.cancel()
            } else if (policy === 'REJECT_IF_EXIST') {
                throw new Error(rejectMessage)
            }
        }
        manager.set(url, cancelTokenSource)
        return token
    },
    /**
     * 移除一个任务
     * @param {string} url 任务url
     */
    removeMission (url) {
        manager.delete(url)
    }
}

module.exports = missionManager
