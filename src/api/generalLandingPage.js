import request from '@/utils/request'

// 根据 pageId 查询通用落地页
export function queryLandingPageById(params) {
  return request({
    url: '/distribution/system/landingPage/selectById',
    method: 'get',
    params
  })
}
