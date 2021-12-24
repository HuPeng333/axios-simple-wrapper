/**
 * 构建post请求的参数
 * @param postParam {Object} post请求参数
 */
export const parseObjToPostParam = (postParam) => {
  let params = ''
  Object.keys(postParam).forEach(key => {
    params += ('&' + key + '=' + postParam[key])
  })
  // 替换第一个多余的&符号
  const len = postParam.length
  if (len === 0) {
    return ''
  } else {
    return params.substr(1, len)
  }
}
