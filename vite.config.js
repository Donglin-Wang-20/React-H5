import path from 'node:path'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import { compression } from 'vite-plugin-compression2'

const rootDir = path.dirname(fileURLToPath(import.meta.url))
const resolve = (dir) => path.resolve(rootDir, dir)

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, rootDir)
  // vite build / build:test 都视作生产构建
  const isProd = command === 'build'
  const proxyTarget = env.VITE_APP_PROXY_TARGET

  return {
    // 静态资源基础路径，部署到子目录时可通过 VITE_APP_PUBLIC_PATH 覆盖
    base: env.VITE_APP_PUBLIC_PATH || './',
    plugins: [
      react(),
      // 生产环境生成 gzip 文件，对应原 Vue 项目的 CompressionPlugin
      ...(isProd
        ? [
            compression({
              algorithms: ['gzip'],
              threshold: 10240,
              logLevel: 'silent'
            })
          ]
        : [])
    ],
    resolve: {
      // 对齐原 Vue 项目的别名配置
      alias: {
        '@': resolve('src'),
        assets: resolve('src/assets'),
        api: resolve('src/api'),
        views: resolve('src/views'),
        components: resolve('src/components'),
        store: resolve('src/store'),
        utils: resolve('src/utils'),
        styles: resolve('src/styles')
      }
    },
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          // 向所有 less 文件注入全局变量（只包含变量，不产生重复样式）
          additionalData: '@import "variables.less";',
          paths: [resolve('src/styles')]
        }
      }
    },
    server: {
      host: '0.0.0.0',
      port: 1234,
      open: false,
      // 需要走本地代理时，把 VITE_APP_BASE_API 设为 /api 并配置 VITE_APP_PROXY_TARGET
      ...(proxyTarget
        ? {
            proxy: {
              '/api': {
                target: proxyTarget,
                changeOrigin: true,
                rewrite: (url) => url.replace(/^\/api/, '')
              }
            }
          }
        : {})
    },
    build: {
      outDir: 'dist',
      assetsDir: 'static',
      sourcemap: false,
      target: 'es2015',
      chunkSizeWarningLimit: 1500,
      rolldownOptions: {
        output: {
          codeSplitting: {
            groups: [
              {
                name: 'chunk-react',
                test: /node_modules[\\/](react|react-dom|scheduler|react-router|react-router-dom)[\\/]/,
                priority: 30
              },
              {
                name: 'chunk-antd-mobile',
                test: /node_modules[\\/]antd-mobile[\\/]/,
                priority: 20
              },
              {
                name: 'chunk-vendor',
                test: /node_modules[\\/]/,
                priority: 10
              }
            ]
          }
        }
      }
    }
  }
})
