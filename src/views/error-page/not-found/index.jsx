import { Button, ErrorBlock } from 'antd-mobile'
import { useNavigate } from 'react-router-dom'
import '../index.less'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className='error-page'>
      <ErrorBlock status='empty' title='页面不存在' description='链接可能已失效，或者页面还在迁移中' />
      <div className='error-page__actions'>
        <Button block color='primary' shape='rounded' onClick={() => navigate('/', { replace: true })}>
          返回首页
        </Button>
      </div>
    </div>
  )
}
