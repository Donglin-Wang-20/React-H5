import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import 'amfe-flexible'
import App from '@/App'
import router from '@/router'
import '@/styles/global.less'

// 移动端调试：在 .env 中打开 VITE_APP_VCONSOLE
if (import.meta.env.DEV && import.meta.env.VITE_APP_VCONSOLE === 'true') {
  import('vconsole').then(({ default: VConsole }) => {
    new VConsole()
  })
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App>
      <RouterProvider router={router} />
    </App>
  </StrictMode>
)
