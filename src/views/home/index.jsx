import { Button } from 'antd-mobile'
import { useNavigate } from 'react-router-dom'
import logo from '@/assets/logo.png'
import settings from '@/settings'
import './index.less'

const stack = [
  { name: 'React 18', desc: '视图层' },
  { name: 'Vite 8', desc: '开发与构建' },
  { name: 'React Router 7', desc: 'Hash 路由' },
  { name: 'Zustand 5', desc: '状态管理' },
  { name: 'antd-mobile 5', desc: '移动端组件库' },
  { name: 'Less + PxToRem', desc: '样式与适配' }
]

const conventions = [
  '新增页面只需在 router/modules 下添加路由模块，入口自动扫描',
  '路由级懒加载 + Suspense，首屏只加载首页',
  '主服务与课程服务两套 axios 实例，统一错误提示',
  'Zustand 状态持久化，按业务拆分 store/modules',
  '750 设计稿 + postcss-pxtorem，自动适配移动端',
  'Hash 路由，适配微信内置浏览器与静态托管'
]

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className='home'>
      <header className='home__hero'>
        <div className='home__logo-wrap'>
          <img className='home__logo' src={logo} alt={settings.title} />
        </div>
        <p className='home__eyebrow'>WEIXUE CMS · H5</p>
        <h1 className='home__title'>{settings.title} H5</h1>
        <p className='home__subtitle'>React 移动端工程框架</p>
        <p className='home__desc'>已按 weixue-cms-h5 的目录与工程约定搭建，页面和业务逻辑可以直接在这个骨架上迁移。</p>
        <div className='home__actions'>
          <Button block color='primary' shape='rounded' onClick={() => navigate('/demo')}>
            查看框架示例
          </Button>
          <Button block shape='rounded' onClick={() => navigate('/not-exist')}>
            预览 404 页面
          </Button>
        </div>
      </header>

      <section className='home__section'>
        <div className='home__section-head'>
          <h2>技术栈</h2>
          <span>STACK</span>
        </div>
        <div className='home__grid'>
          {stack.map((item) => (
            <div className='home__card' key={item.name}>
              <strong>{item.name}</strong>
              <span>{item.desc}</span>
            </div>
          ))}
        </div>
      </section>

      <section className='home__section'>
        <div className='home__section-head'>
          <h2>工程约定</h2>
          <span>CONVENTION</span>
        </div>
        <ul className='home__list'>
          {conventions.map((item, index) => (
            <li className='home__list-item' key={item}>
              <span className='home__index'>{String(index + 1).padStart(2, '0')}</span>
              <p>{item}</p>
            </li>
          ))}
        </ul>
      </section>

      <footer className='home__footer'>
        <span>v{settings.version}</span>
        <span>{import.meta.env.MODE}</span>
      </footer>
    </div>
  )
}
