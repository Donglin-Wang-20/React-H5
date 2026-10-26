/**
 * 判断当前是否在微信内置浏览器中
 */
export function isWechat() {
  return /MicroMessenger/i.test(navigator.userAgent)
}

/**
 * 判断当前是否在企业微信中
 */
export function isWecom() {
  return /wxwork/i.test(navigator.userAgent)
}

/**
 * 判断当前是否在支付宝中
 */
export function isAlipay() {
  return /AlipayClient/i.test(navigator.userAgent)
}

/**
 * 获取当前容器环境：wecom / wechat / alipay / browser
 */
export function getAppEnv() {
  if (isWecom()) return 'wecom'
  if (isWechat()) return 'wechat'
  if (isAlipay()) return 'alipay'
  return 'browser'
}

/**
 * 获取当前手机系统：ios / android / other
 */
export function getSystemAgent() {
  const ua = navigator.userAgent
  if (/iPhone|iPad|iPod|iOS/i.test(ua)) return 'ios'
  if (/Android/i.test(ua)) return 'android'
  return 'other'
}

/**
 * 防抖
 * @param {Function} fn 需要执行的函数
 * @param {number} wait 间隔时间
 * @param {boolean} immediate 是否立即执行一次
 */
export function debounce(fn, wait = 300, immediate = false) {
  let timer = null
  let result

  return function debounced(...args) {
    const callNow = immediate && !timer
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      timer = null
      if (!immediate) result = fn.apply(this, args)
    }, wait)
    if (callNow) result = fn.apply(this, args)
    return result
  }
}

/**
 * 深拷贝（仅处理可被 JSON 表达的数据结构）
 */
export function deepClone(source) {
  if (source === null || typeof source !== 'object') return source
  const target = Array.isArray(source) ? [] : {}
  Object.keys(source).forEach((key) => {
    target[key] = deepClone(source[key])
  })
  return target
}

/**
 * 解析 URL 上的 query 参数，兼容 hash 路由（#/page?id=1）
 */
export function getQueryParams(url = window.location.href) {
  const queryIndex = url.indexOf('?')
  if (queryIndex === -1) return {}

  return url
    .slice(queryIndex + 1)
    .split('#')[0]
    .split('&')
    .reduce((params, pair) => {
      if (!pair) return params
      const [rawKey, rawValue = ''] = pair.split('=')
      const key = safeDecode(rawKey)
      if (key) params[key] = safeDecode(rawValue)
      return params
    }, {})
}

function safeDecode(value) {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}
