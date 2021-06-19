import request from '@/utils/request'
const baseUrl = process.env.VUE_APP_BASE_API_2

export function getList(params) {
  return request({
    url: baseUrl + '/ec/mall/admin-goods-list',
    method: 'get',
    params
  })
}
