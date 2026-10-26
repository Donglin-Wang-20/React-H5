import { createRequest } from './createRequest'

// 主业务接口实例，对应原 Vue 项目的 utils/request.js
const request = createRequest(import.meta.env.VITE_APP_BASE_API)

export default request
