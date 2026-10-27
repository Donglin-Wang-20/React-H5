import request from '@/utils/request'

/**
 * 事件埋点上报
 * 传入 config 可以跳过默认错误提示，例如：eventTrackingApi(data, { skipErrorToast: true })
 */
export function eventTrackingApi(data, config = {}) {
  return request({
    url: '/distribution/system/eventTracking',
    method: 'post',
    data,
    ...config
  })
}
