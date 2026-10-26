import { useEffect } from 'react'
import { ConfigProvider } from 'antd-mobile'
import zhCN from 'antd-mobile/es/locales/zh-CN'
import { useAppStore } from '@/store'

export default function App({ children }) {
  const initEnv = useAppStore((state) => state.initEnv)

  useEffect(() => {
    initEnv()
    if (import.meta.env.DEV) {
      console.log('[app] url:', window.location.href)
    }
  }, [initEnv])

  return <ConfigProvider locale={zhCN}>{children}</ConfigProvider>
}
