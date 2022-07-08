export const getRequestExtraParam = (url?: string):Map<string, string> | null => {
  if (!url) {
    return null
  }
  const paramStrMatch = url.match(/#.+/)
  if (!paramStrMatch) {
    return null
  }
  const paramMap = new Map<string, string>()
  paramStrMatch[0].replace('#', '').split('&').forEach(value => {
    const kv = value.split("=")
    if (kv.length !== 2) {
      return
    }
    paramMap.set(kv[0], kv[1])
  })
  return paramMap
}

export const existExtraParam = (url: string, param: string): boolean => {
  if (!url) {
    return false
  }
  return new RegExp(`[#|,]${param}=`).test(url)
}

export const isWanted = (wanted: unknown, value?: unknown):boolean => {
  if (!value) {
    return false
  }
  return wanted === value
}

export const appendParam = (url: string, key: string, value: string): string => {
  if (url.search('#') !== -1) {
    return `${url}&${key}=${value}`
  } else {
    return `${url}#${key}=${value}`
  }
}
