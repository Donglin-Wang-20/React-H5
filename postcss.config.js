export default {
  plugins: {
    autoprefixer: {},
    'postcss-pxtorem': {
      // 750 设计稿：src 下的 px 按 75 换算；
      // antd-mobile 等 375 设计的第三方样式按 37.5 换算。
      // 与原 Vue 项目 vue.config.js 中 Vant 的处理方式一致。
      rootValue({ file }) {
        if (!file) return 75
        return file.includes('node_modules') ? 37.5 : 75
      },
      propList: ['*'],
      minPixelValue: 1,
      selectorBlackList: ['.no-rem'],
      mediaQuery: false
    }
  }
}
