import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

// 用户状态：登录后由业务页面写入，请求拦截器统一读取 token
export const useUserStore = create(
  persist(
    (set) => ({
      token: '',
      userInfo: null,
      setToken: (token) => set({ token }),
      setUserInfo: (userInfo) => set({ userInfo }),
      logout: () => set({ token: '', userInfo: null })
    }),
    {
      name: 'react-h5-user',
      storage: createJSONStorage(() => localStorage),
      version: 1
    }
  )
)
