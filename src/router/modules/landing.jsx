import { lazyLoad } from '@/router/lazy'

export default [
  {
    path: '/generalLandingPage',
    element: lazyLoad(() => import('@/views/generalLandingPage')),
    handle: { title: '通用落地页' }
  }
]
