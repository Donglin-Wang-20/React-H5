import { useEffect } from 'react'
import { Outlet, ScrollRestoration, useLocation, useMatches } from 'react-router-dom'
import settings from '@/settings'
import './index.less'

function useDocumentTitle() {
  const matches = useMatches()

  useEffect(() => {
    // 取最深一层带 title 的路由，等价于原 Vue 项目的 to.meta.title
    const matched = [...matches].reverse().find((match) => match.handle && match.handle.title)
    document.title = matched ? matched.handle.title : settings.title
  }, [matches])
}

export default function BasicLayout() {
  const location = useLocation()
  useDocumentTitle()

  return (
    <div className='app-layout'>
      {/* key 变化时触发页面入场动画，同时让每个页面拥有独立生命周期 */}
      <main className='app-page' key={location.key}>
        <Outlet />
      </main>
      <ScrollRestoration />
    </div>
  )
}
