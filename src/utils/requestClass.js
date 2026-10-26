import { createRequest } from './createRequest'

// 课程服务接口实例，对应原 Vue 项目的 utils/requestClass.js
const requestClass = createRequest(import.meta.env.VITE_APP_CLASS_API)

export default requestClass
