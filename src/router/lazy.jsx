import { lazy, Suspense } from 'react'
import PageLoading from '@/components/PageLoading'

/**
 * 路由级懒加载，用法对齐原 Vue 项目路由中的 () => import('@/views/xxx')
 */
export function lazyLoad(loader) {
  const Component = lazy(loader)

  return (
    <Suspense fallback={<PageLoading />}>
      <Component />
    </Suspense>
  )
}
