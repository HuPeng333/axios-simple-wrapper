/**
 * 构建post请求的参数
 * @param postParam {Object} post请求参数
 */
export const parseObjToPostParam = (postParam?: Record<string, string | number>) => {
  if (!postParam || typeof postParam != 'object') {
    return ''
  }
  let params = ''
  Object.keys(postParam).forEach(key => {
    params += (encodeURIComponent(key) + '=' + encodeURIComponent(postParam[key]) + '&')
  })
  // 替换最后一个多余的&符号
  const len = params.length
  if (len === 0) {
    return ''
  } else {
    return params.substring(0, len - 1)
  }
}

