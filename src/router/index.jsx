import { createHashRouter } from 'react-router-dom'
import BasicLayout from '@/layout'
import ErrorPage from '@/views/error-page/error'
import NotFound from '@/views/error-page/not-found'

// 自动扫描路由模块：新增 src/router/modules/xxx.jsx 后无需修改此文件
const routeModules = import.meta.glob('./modules/*.jsx', { eager: true })

const moduleRoutes = Object.values(routeModules).flatMap((module) => {
  const routes = module.default || []
  return Array.isArray(routes) ? routes : [routes]
})

const router = createHashRouter([
  {
    element: <BasicLayout />,
    errorElement: <ErrorPage />,
    children: [
      ...moduleRoutes,
      {
        path: '*',
        element: <NotFound />,
        handle: { title: '页面不存在' }
      }
    ]
  }
])

export default router
