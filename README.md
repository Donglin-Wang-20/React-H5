# React-H5

基于 `weixue-cms-h5` 的目录结构和工程约定搭建的 **React 移动端 H5 框架**。工程骨架已完成，并已迁移通用落地页；其余业务页面可以继续按同样的方式迁移。

## 技术栈

| 能力         | 原 Vue 项目             | 当前 React 项目               |
| ------------ | ----------------------- | ----------------------------- |
| 视图层       | Vue 2.6                 | React 18.3                    |
| 构建工具     | Vue CLI 4 / webpack     | Vite 8（Rolldown）            |
| 路由         | vue-router 3，hash 模式 | react-router-dom 7，hash 模式 |
| 状态管理     | Vuex 3                  | Zustand 5（含持久化）         |
| 移动端组件库 | Vant 2                  | antd-mobile 5                 |
| 请求         | axios                   | axios（封装双实例）           |
| 样式         | Less + postcss-pxtorem  | Less + postcss-pxtorem        |
| 移动端适配   | amfe-flexible           | amfe-flexible                 |
| 代码规范     | ESLint + Prettier       | ESLint 9 + Prettier           |
| 移动端调试   | vconsole                | vconsole（按需开启）          |

> React 固定在 **18.3.1**：antd-mobile v5 官方支持 React 16 ~ 18，其 Toast / Dialog 仍依赖旧版渲染 API。升级 React 19 需要额外接入 `unstableSetRender` 兼容层，骨架阶段不引入。

## 快速开始

要求 Node.js >= 20.19.0。

```bash
npm install

npm run dev          # 开发，默认 http://localhost:1234
npm run build        # 生产构建，输出 dist/
npm run build:test   # 测试环境构建（.env.test）
npm run preview      # 预览构建产物
npm run lint         # ESLint
npm run lint:fix     # ESLint 自动修复
npm run format       # Prettier 格式化
```

如果 1234 端口被占用，Vite 会自动顺延到下一个可用端口。

## 目录结构

```text
src/
├── api/                     # 接口层：一个业务域一个文件
│   ├── eventTracking.js     # 埋点上报
│   ├── generalLandingPage.js# 通用落地页接口
│   ├── home.js              # 示例接口
│   └── index.js             # API 统一出口
├── assets/                  # 图片、字体等静态资源
├── components/              # 全局公共组件
│   ├── PageContainer/       # NavBar + 内容区 + 底部操作区
│   ├── PageLoading/         # 路由懒加载 fallback
│   └── index.js
├── layout/                  # 全局布局：页面动画、标题、滚动恢复
│   └── index.jsx
├── router/
│   ├── index.jsx            # 路由入口，自动扫描 modules
│   ├── lazy.jsx             # 路由级懒加载封装
│   └── modules/
│       ├── home.jsx         # 首页 + 示例页路由
│       └── landing.jsx      # 通用落地页路由
├── store/
│   ├── index.js
│   └── modules/
│       ├── app.js           # 应用环境、演示计数（sessionStorage）
│       └── user.js          # token、用户信息（localStorage）
├── styles/
│   ├── global.less          # 全局重置、antd-mobile 主题变量
│   └── variables.less       # Less 变量（自动注入所有 less 文件）
├── utils/
│   ├── createRequest.js     # axios 实例工厂
│   ├── request.js           # 主业务接口实例
│   ├── requestClass.js      # 课程服务接口实例
│   ├── wx.js                # 微信 JSSDK / 支付封装
│   └── index.js             # 环境判断、防抖、深拷贝、query 解析
├── views/
│   ├── home/                # 首页（非懒加载）
│   ├── demo/                # 框架示例页（懒加载）
│   ├── generalLandingPage/  # 通用落地页（长图 + 埋点 + 小程序跳转）
│   └── error-page/          # 404 与路由异常页
├── App.jsx                  # ConfigProvider + 全局初始化
├── main.jsx                 # 应用入口
└── settings.js              # 项目标题、版本、设计稿宽度
```

工程配置文件：

```text
vite.config.js       # 别名、端口、代理、分包、gzip、Less 全局变量
postcss.config.js    # pxtorem 换算规则
eslint.config.js     # ESLint 9 flat config
.env / .env.development / .env.production / .env.test
```

## 路由约定

路由使用 `createHashRouter`，与原 Vue 项目一致，适配微信内置浏览器和纯静态托管。

`src/router/index.jsx` 会自动扫描 `src/router/modules/*.jsx`：

```jsx
// src/router/modules/order.jsx
import { lazyLoad } from '@/router/lazy'

export default [
  {
    path: '/order',
    element: lazyLoad(() => import('@/views/order')),
    handle: { title: '订单' }
  }
]
```

约定：

- 每个模块默认导出一个路由对象或路由数组，新增文件无需修改路由入口。
- `handle.title` 会被 `layout` 写入 `document.title`。
- 首页使用静态引入保证首屏；其余页面统一用 `lazyLoad` 做路由级懒加载。
- 未匹配路由由 `path: '*'` 渲染 404 页面。
- 需要嵌套路由时，在路由对象中使用 `children`。
- 如果必须使用 history 模式，将 `createHashRouter` 换成 `createBrowserRouter`，并在网关或 Nginx 配置 `index.html` fallback。

## 已实现页面

### 通用落地页 `/generalLandingPage`

页面文件：`src/views/generalLandingPage/index.jsx`

访问方式（`pageId` 放在 hash 内、hash 外都可以）：

```text
http://localhost:1234/#/generalLandingPage?pageId=xxx
http://localhost:1234/?pageId=xxx#/generalLandingPage
```

处理流程：

1. 从 URL 读取 `pageId`，调用 `/distribution/system/landingPage/selectById`。
2. 展示接口返回的 `pageUrl` 长图，底部固定一个跳转按钮。
3. 自动上报 `OldQuantityActivation` 埋点（`platform: 1`）。
4. 有 `miniPageUrl`：最多等待埋点 500ms，然后通过 `location.href` 跳转。
5. 没有 `miniPageUrl`：仍然上报埋点，并提示“页面链接生成失败”。
6. 没有 `pageId`、接口失败或没有 `pageUrl`：展示“链接失效”。

开发注意：React StrictMode 会重复执行 effect，页面用“同一个 `pageId` 共用一个请求 Promise”的方式，避免重复请求和重复埋点。

## 请求层

`utils/request.js` 和 `utils/requestClass.js` 分别对应原项目的两个 axios 实例，底层由 `createRequest.js` 统一创建：

```js
import { getH5Detail } from '@/api'

const res = await getH5Detail(123)
```

已处理的公共逻辑：

- `baseURL` 来自 `VITE_APP_BASE_API` / `VITE_APP_CLASS_API`。
- 自动携带 `useUserStore` 中的 token（header 名称可按后端约定调整）。
- 业务码不等于 `200` 时统一 Toast 提示并 reject。
- 网络错误统一提示，可通过请求配置 `skipErrorToast: true` 关闭。
- 超时时间 20 秒。

### 本地代理

默认直接请求测试环境域名。如果浏览器跨域或需要走本地代理：

1. 把 `.env.development` 中的 `VITE_APP_BASE_API` 改为 `/api`。
2. 打开 `VITE_APP_PROXY_TARGET=https://apitest.myweixue.com`。
3. 重启 dev server，代理规则见 `vite.config.js`。

## 状态管理

使用 Zustand，不需要 Provider：

```js
import { useAppStore } from '@/store'

const count = useAppStore((state) => state.count)
const increment = useAppStore((state) => state.increment)
```

- `store/modules/app.js`：容器环境、系统、演示计数，持久化到 sessionStorage。
- `store/modules/user.js`：token、用户信息，持久化到 localStorage。
- 新增业务 store 时，在 `store/modules` 下建文件，并从 `store/index.js` 导出。

## 样式与移动端适配

沿用原项目的双基准方案：

| 范围                          | 设计稿宽度 | rootValue |
| ----------------------------- | ---------- | --------- |
| `src/**` 业务样式             | 750        | 75        |
| `node_modules/antd-mobile/**` | 375        | 37.5      |

`amfe-flexible` 会把根字号设为 `clientWidth / 10`（桌面端最大按 540px 计算）。因此：

- `src` 下的样式直接按 **750 设计稿标注的 px** 书写，构建时自动换算。
- antd-mobile 自身的 375 设计稿样式会自动按 37.5 换算，无需手工处理。
- 例：设计稿 32px 的间距，在 less 中写 `32px`，375px 屏幕下渲染为 16px。
- 不需要手动写 rem；确实需要跳过转换时，给规则加上 `.no-rem` 类（1px 细线不会被转换）。
- 主题色、字体色、圆角等变量在 `src/styles/variables.less` 中维护，antd-mobile 的 CSS 变量在 `global.less` 中覆盖。

如果页面尺寸整体偏大/偏小，优先检查设计稿基准和 `postcss.config.js` 中的 `rootValue`。

## 环境变量

| 变量                    | 说明                                         |
| ----------------------- | -------------------------------------------- |
| `VITE_APP_TITLE`        | 应用标题（index.html 和默认 document.title） |
| `VITE_APP_PUBLIC_PATH`  | 静态资源基础路径，默认 `./`                  |
| `VITE_APP_VCONSOLE`     | 开发环境是否启用 vConsole                    |
| `VITE_APP_BASE_API`     | 主业务接口地址                               |
| `VITE_APP_CLASS_API`    | 课程服务接口地址                             |
| `VITE_APP_PROXY_TARGET` | 可选，本地代理目标                           |
| `VITE_APP_NODE_ENV`     | 环境标识，保留原项目命名                     |

只有 `VITE_` 前缀的变量会暴露给客户端代码。

## 从 Vue 迁移页面

| Vue / Vant                       | React / antd-mobile                    |
| -------------------------------- | -------------------------------------- |
| `views/xxx/index.vue`            | `views/xxx/index.jsx` + `index.less`   |
| `vue-router` 路由模块            | `router/modules/xxx.jsx`               |
| `van-button`                     | `Button`                               |
| `van-nav-bar`                    | `NavBar`（或直接使用 `PageContainer`） |
| `van-popup` / `van-action-sheet` | `Popup` / `ActionSheet`                |
| `van-dialog` / `van-toast`       | `Dialog` / `Toast`                     |
| `van-form` / `van-field`         | `Form` / `Input` / `Picker`            |
| `van-list` / `van-cell`          | `List` / `List.Item`                   |
| `van-swipe` / `van-tabbar`       | `Swiper` / `TabBar`                    |
| `van-empty` / 错误页             | `ErrorBlock`                           |
| Vuex                             | Zustand                                |
| `this.$route.query`              | `useSearchParams` 或 `getQueryParams`  |
| `created` / `mounted` / `watch`  | `useEffect` / `useMemo` / 自定义 hooks |
| `v-model`                        | 受控状态 + `onChange`                  |

迁移建议：

1. 先按业务域补齐 `src/api`，保持接口路径与原项目一致。
2. 每次迁移一个 `views` 页面，并在 `router/modules` 注册对应路由。
3. 公共弹窗、埋点、微信分享等逻辑抽到 `src/utils` 或 `src/hooks`。
4. 原项目依赖 `html2canvas`、`fabric`、`pdfjs-dist`、`@vant/area-data` 等，按页面需要再安装。

## 构建与部署

- 构建产物在 `dist/`，静态资源在 `dist/static/`。
- 大于 10KB 的 js/css 会自动生成 `.gz` 文件。
- `base` 默认为 `./`，可部署到任意子目录；如需固定根路径，修改 `VITE_APP_PUBLIC_PATH`。
- Hash 路由无需服务端 rewrite；使用 history 路由时需配置 fallback。
- 构建目标为 ES2015，浏览器基线见 `.browserslistrc`（iOS 12+ / Android 8+）。如需兼容更老的微信 WebView，可再接入 `@vitejs/plugin-legacy`。

## 当前未包含的内容

框架只负责工程基建，以下业务能力需要按页面迁移时补充：

- 除通用落地页外的其他业务页面与页面级组件
- 登录、支付、订单等完整业务流程
- 通用埋点工具（通用落地页已内置该页面的埋点）
- 地区数据、海报生成、PDF 预览等页面级依赖
- 多语言、权限路由等扩展能力
