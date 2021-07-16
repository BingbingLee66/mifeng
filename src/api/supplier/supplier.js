import request from '@/utils/request'
const baseUrl = process.env.VUE_APP_BASE_API_2

export function getAllSupplierList(params) {
  return request({
    url: baseUrl + '/ec/mall/get-all-supplier-list',
    method: 'get',
    params
  })
}

export function updateOrder(params) {
  return request({
    url: baseUrl + '/ec/mall/update-order',
    method: 'get',
    params
  })
}
