import { useEffect } from 'react'
import { Button, ErrorBlock } from 'antd-mobile'
import { useNavigate, useRouteError } from 'react-router-dom'
import '../index.less'

export default function ErrorPage() {
  const navigate = useNavigate()
  const error = useRouteError()

  useEffect(() => {
    if (import.meta.env.DEV) {
      console.error('[RouteError]', error)
    }
  }, [error])

  return (
    <div className='error-page'>
      <ErrorBlock status='disconnected' title='页面出错了' description='请刷新页面重试，或者返回首页' />
      <div className='error-page__actions'>
        <Button block color='primary' shape='rounded' onClick={() => window.location.reload()}>
          刷新页面
        </Button>
        <Button block shape='rounded' onClick={() => navigate('/', { replace: true })}>
          返回首页
        </Button>
      </div>
    </div>
  )
}
