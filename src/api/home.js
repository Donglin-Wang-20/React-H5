import request from '@/utils/request'

// 示例接口：接入真实业务时，按域拆分成 goods.js / order.js 等文件
export function getH5Detail(id) {
  return request({
    url: `/distribution/system/h5/${id}`,
    method: 'get'
  })
}

export function addOrder(data, businessId) {
  return request({
    url: '/distribution/api/h5/order/add',
    method: 'post',
    data,
    headers: {
      BusinessId: businessId
    }
  })
}
