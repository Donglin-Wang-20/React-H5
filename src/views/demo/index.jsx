import { Button, Dialog, List, Tag, Toast } from 'antd-mobile'
import PageContainer from '@/components/PageContainer'
import { useAppStore } from '@/store'
import './index.less'

export default function Demo() {
  const count = useAppStore((state) => state.count)
  const appEnv = useAppStore((state) => state.appEnv)
  const appSystem = useAppStore((state) => state.appSystem)
  const increment = useAppStore((state) => state.increment)
  const reset = useAppStore((state) => state.reset)

  const showToast = () => {
    Toast.show({
      content: '这是一个 Toast 提示',
      duration: 1500
    })
  }

  const showDialog = () => {
    Dialog.alert({
      title: 'antd-mobile Dialog',
      content: '公共交互组件的用法示例，业务中可继续封装为自己的 hooks。',
      confirmText: '我知道了'
    })
  }

  return (
    <PageContainer
      title='框架示例'
      footer={
        <Button block color='primary' shape='rounded' onClick={increment}>
          点击 +1（当前 {count}）
        </Button>
      }
    >
      <section className='demo__hero'>
        <span className='demo__tag'>SKELETON</span>
        <h1>页面骨架示例</h1>
        <p>这个页面演示了路由懒加载、状态管理、antd-mobile、环境变量与公共页面容器的用法。</p>
      </section>

      <List className='demo__list' header='状态管理（Zustand）' mode='card'>
        <List.Item extra={count}>当前计数</List.Item>
        <List.Item
          extra={
            <Button size='mini' onClick={reset}>
              重置
            </Button>
          }
        >
          操作
        </List.Item>
        <List.Item extra={appEnv}>容器环境</List.Item>
        <List.Item extra={appSystem}>操作系统</List.Item>
      </List>

      <List className='demo__list' header='组件库（antd-mobile）' mode='card'>
        <List.Item clickable arrowIcon onClick={showToast}>
          Toast 提示
        </List.Item>
        <List.Item clickable arrowIcon onClick={showDialog}>
          Dialog 弹窗
        </List.Item>
        <List.Item extra={<Tag color='primary'>按需引入</Tag>}>组件样式</List.Item>
      </List>

      <List className='demo__list' header='运行环境' mode='card'>
        <List.Item extra={import.meta.env.MODE}>Vite 模式</List.Item>
        <List.Item extra={<Tag color='success'>{import.meta.env.VITE_APP_NODE_ENV}</Tag>}>应用环境</List.Item>
        <List.Item description={import.meta.env.VITE_APP_BASE_API}>主接口地址</List.Item>
      </List>

      <section className='demo__next'>
        <h2>新增页面的方式</h2>
        <p>1. 在 src/views 下创建页面目录，例如 views/order/index.jsx</p>
        <p>2. 在 src/router/modules 下新增路由模块，自动生效</p>
        <pre className='demo__code'>{`// src/router/modules/order.jsx
import { lazyLoad } from '@/router/lazy'

export default [
  {
    path: '/order',
    element: lazyLoad(() => import('@/views/order')),
    handle: { title: '订单' }
  }
]`}</pre>
      </section>
    </PageContainer>
  )
}
