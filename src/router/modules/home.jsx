import { lazyLoad } from '@/router/lazy'
import Home from '@/views/home'

// 首页不做懒加载，保证首屏速度（与原 Vue 项目一致）
export default [
  {
    path: '/',
    element: <Home />,
    handle: { title: '首页' }
  },
  {
    path: '/home',
    element: <Home />,
    handle: { title: '首页' }
  },
  {
    path: '/demo',
    element: lazyLoad(() => import('@/views/demo')),
    handle: { title: '框架示例' }
  }
]
