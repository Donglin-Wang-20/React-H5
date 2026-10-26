import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { getAppEnv, getSystemAgent } from '@/utils'

// 应用级状态：容器环境、系统、演示计数
export const useAppStore = create(
  persist(
    (set) => ({
      appEnv: 'unknown',
      appSystem: 'unknown',
      count: 0,
      initEnv: () =>
        set({
          appEnv: getAppEnv(),
          appSystem: getSystemAgent()
        }),
      increment: () => set((state) => ({ count: state.count + 1 })),
      reset: () => set({ count: 0 })
    }),
    {
      name: 'react-h5-app',
      storage: createJSONStorage(() => sessionStorage),
      version: 1
    }
  )
)
