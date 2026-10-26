import { Toast } from 'antd-mobile'
import wx from 'weixin-js-sdk'

const defaultJsApiList = ['chooseWXPay']

/**
 * 注入微信 JSSDK 配置
 * @param {object} config 后端返回的签名配置
 * @param {string[]} jsApiList 需要使用的微信 API
 */
export function useWxJsSdk(config, jsApiList = defaultJsApiList) {
  return new Promise((resolve, reject) => {
    try {
      wx.config({
        debug: false,
        appId: config.appId,
        // 后端可能返回 timeStamp，微信 JSSDK 使用 timestamp
        timestamp: config.timestamp || config.timeStamp,
        nonceStr: config.nonceStr,
        signature: config.signature,
        jsApiList
      })

      wx.ready(() => resolve())

      wx.error((error) => {
        Toast.show({
          icon: 'fail',
          content: error?.errMsg || '微信 JSSDK 配置失败'
        })
        reject(error)
      })
    } catch (error) {
      Toast.show({
        icon: 'fail',
        content: '微信 JSSDK 初始化失败'
      })
      reject(error)
    }
  })
}

/**
 * 微信支付
 * @param {object} options 支付参数
 * @param {Function} onCancel 取消/失败后的回调
 */
export function wxPay(options, onCancel) {
  const { nonceStr, packageValue, paySign, signType, timeStamp, appId } = options

  return new Promise((resolve, reject) => {
    wx.chooseWXPay({
      appId,
      timestamp: timeStamp,
      nonceStr,
      package: packageValue,
      signType,
      paySign,
      success: (res) => resolve(res),
      cancel: (res) => {
        if (typeof onCancel === 'function') onCancel()
        resolve(res)
      },
      fail: (error) => {
        if (typeof onCancel === 'function') onCancel()
        reject(error)
      }
    })
  })
}
