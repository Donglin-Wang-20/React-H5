import { SpinLoading } from 'antd-mobile'
import './index.less'

export default function PageLoading() {
  return (
    <div className='page-loading'>
      <SpinLoading color='primary' />
      <span className='page-loading__text'>加载中...</span>
    </div>
  )
}
