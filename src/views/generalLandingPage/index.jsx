import { ErrorBlock, Toast } from 'antd-mobile'
import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { eventTrackingApi, queryLandingPageById } from '@/api'
import PageLoading from '@/components/PageLoading'
import './index.less'

const BUTTON_IMAGE = 'https://distributionback.myweixue.com/distribution/20220919/dy-images/button.png'
const TRACKING_TIMEOUT = 500

/**
 * 兼容两种链接形式：
 * 1. .../#/generalLandingPage?pageId=xxx
 * 2. .../?pageId=xxx#/generalLandingPage
 */
function getPageId(searchParams) {
  const match = window.location.href.match(/[?&]pageId=([^&/#]+)/)
  if (match?.[1]) {
    try {
      return decodeURIComponent(match[1])
    } catch {
      return match[1]
    }
  }
  return searchParams.get('pageId') || ''
}

function buildTrackingData(detail) {
  return {
    current: 'OldQuantityActivation',
    platform: 1,
    content: JSON.stringify({
      memberId: '',
      theme: detail?.pageName || '',
      action: '落地页访问',
      course: '人文思辨',
      phone: ''
    })
  }
}

function jumpMini(url) {
  const miniPageUrl = url?.trim()
  if (!miniPageUrl) return
  window.location.href = miniPageUrl
}

/**
 * 只上报埋点，不跳转。
 * 用于 miniPageUrl 生成失败时，仍然保留访问数据。
 */
async function trackOnly(detail) {
  try {
    await eventTrackingApi(buildTrackingData(detail), { skipErrorToast: true })
    if (import.meta.env.DEV) console.log('埋点发送成功')
  } catch (error) {
    console.error('埋点发送失败:', error)
  }
}

/**
 * 上报埋点后跳转。
 * 埋点最多等待 500ms，避免接口慢导致用户一直停在落地页。
 */
async function trackAndJump(detail) {
  let timer
  const timeoutPromise = new Promise((resolve) => {
    timer = setTimeout(() => resolve({ timeout: true }), TRACKING_TIMEOUT)
  })

  try {
    const result = await Promise.race([eventTrackingApi(buildTrackingData(detail), { skipErrorToast: true }).then(() => ({ success: true })), timeoutPromise])

    if (result.success && import.meta.env.DEV) {
      console.log('埋点发送成功')
    }
    if (result.timeout && import.meta.env.DEV) {
      console.log('埋点请求超时，500ms 后跳转')
    }
  } catch (error) {
    console.error('埋点发送失败:', error)
  } finally {
    clearTimeout(timer)
    jumpMini(detail?.miniPageUrl)
  }
}

// 同一个 pageId 共用一次请求，避免 React StrictMode 开发环境下重复请求和重复埋点
const landingPageRequests = new Map()

function loadLandingPage(pageId) {
  if (landingPageRequests.has(pageId)) {
    return landingPageRequests.get(pageId)
  }

  const promise = queryLandingPageById({ pageId })
    .then((res) => {
      const nextDetail = res?.data || {}

      if (nextDetail.miniPageUrl?.trim()) {
        // 埋点不阻塞页面展示，最多等 500ms 后跳转
        trackAndJump(nextDetail)
      } else {
        // 小程序链接为空：仍然上报埋点，然后提示刷新
        trackOnly(nextDetail).then(() => {
          Toast.show({
            icon: 'fail',
            content: '页面链接生成失败，请刷新页面重试',
            position: 'top',
            duration: 3000
          })
        })
      }

      return nextDetail
    })
    .finally(() => {
      // 等当前事件循环结束再删除，保证 StrictMode 的第二次 effect 能复用同一个 Promise
      setTimeout(() => {
        if (landingPageRequests.get(pageId) === promise) {
          landingPageRequests.delete(pageId)
        }
      }, 0)
    })

  landingPageRequests.set(pageId, promise)
  return promise
}

export default function GeneralLandingPage() {
  const [searchParams] = useSearchParams()
  const pageId = getPageId(searchParams)
  const [detail, setDetail] = useState(null)
  const [loading, setLoading] = useState(Boolean(pageId))
  const requestIdRef = useRef(0)

  useEffect(() => {
    if (!pageId) {
      requestIdRef.current += 1
      setDetail(null)
      setLoading(false)
      return
    }

    const requestId = requestIdRef.current + 1
    requestIdRef.current = requestId

    setDetail(null)
    setLoading(true)

    loadLandingPage(pageId)
      .then((nextDetail) => {
        if (requestId !== requestIdRef.current) return
        setDetail(nextDetail)
        setLoading(false)
      })
      .catch(() => {
        if (requestId !== requestIdRef.current) return
        setDetail(null)
        setLoading(false)
      })
  }, [pageId])

  const handleJump = () => {
    if (detail?.miniPageUrl?.trim()) {
      jumpMini(detail.miniPageUrl)
      return
    }

    Toast.show({
      icon: 'fail',
      content: '页面信息加载失败，请刷新后重试',
      position: 'top'
    })
  }

  return (
    <div className='general-landing'>
      {loading ? (
        <PageLoading />
      ) : detail?.pageUrl ? (
        <>
          <div className='general-landing__image-wrap'>
            <img className='general-landing__image' src={detail.pageUrl} alt={detail.pageName || '活动详情'} />
          </div>
          <div className='general-landing__footer'>
            <img
              className='general-landing__button'
              src={BUTTON_IMAGE}
              alt='立即领取'
              role='button'
              tabIndex={0}
              onClick={handleJump}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  handleJump()
                }
              }}
            />
          </div>
        </>
      ) : (
        <div className='general-landing__empty'>
          <ErrorBlock status='empty' title='链接失效' description={null} />
        </div>
      )}
    </div>
  )
}
