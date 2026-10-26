import { NavBar, SafeArea } from 'antd-mobile'
import { useNavigate } from 'react-router-dom'
import './index.less'

/**
 * 通用页面容器：顶部 NavBar + 内容区 + 可选底部操作区
 *
 * @param {object} props
 * @param {React.ReactNode} props.title 导航栏标题，传 undefined 时不渲染导航栏
 * @param {boolean|Function} props.back 返回行为：false 隐藏返回键，函数则自定义返回逻辑
 * @param {React.ReactNode} props.right 导航栏右侧内容
 * @param {React.ReactNode} props.footer 底部固定操作区
 * @param {React.ReactNode} props.children 页面内容
 */
export default function PageContainer({ title, back = true, right, footer, children, className = '', bodyClassName = '', ...rest }) {
  const navigate = useNavigate()

  const handleBack = () => {
    if (typeof back === 'function') {
      back()
      return
    }
    navigate(-1)
  }

  const showBack = back !== false

  return (
    <div className={`page-container ${className}`.trim()} {...rest}>
      {title !== undefined && (
        <NavBar className='page-container__navbar' back={showBack ? '' : null} onBack={showBack ? handleBack : undefined} right={right}>
          {title}
        </NavBar>
      )}
      <div className={`page-container__body ${bodyClassName}`.trim()}>{children}</div>
      {footer ? (
        <div className='page-container__footer'>
          {footer}
          {/* SafeArea 只渲染占位元素，不承载子节点 */}
          <SafeArea position='bottom' />
        </div>
      ) : null}
    </div>
  )
}
