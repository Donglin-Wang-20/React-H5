import { Toast } from 'antd-mobile'
import axios from 'axios'
import { useUserStore } from '@/store'

function toastError(message) {
  Toast.show({
    icon: 'fail',
    content: message || '请求失败，请稍后重试'
  })
}

/**
 * 创建 axios 实例，统一处理鉴权、业务错误与网络错误
 * @param {string} baseURL 接口基础路径
 * @param {object} options axios 配置
 */
export function createRequest(baseURL, options = {}) {
  const service = axios.create({
    baseURL,
    timeout: 20000,
    ...options
  })

  service.interceptors.request.use(
    (config) => {
      const { token } = useUserStore.getState()
      if (token) {
        // 按后端约定调整 header 名称
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => Promise.reject(error)
  )

  service.interceptors.response.use(
    (response) => {
      const res = response.data
      const { skipErrorToast } = response.config

      // 兼容没有 code 字段的接口，业务约定 code === 200 为成功
      if (res && typeof res === 'object' && 'code' in res && String(res.code) !== '200') {
        if (!skipErrorToast) toastError(res.msg || res.message)
        return Promise.reject(res)
      }

      return res
    },
    (error) => {
      if (error.code !== 'ERR_CANCELED' && !error.config?.skipErrorToast) {
        toastError(error.response?.data?.msg || error.message)
      }
      return Promise.reject(error)
    }
  )

  return service
}
