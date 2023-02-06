import request from '@/utils/request'
const baseUrl = process.env.VUE_APP_BASE_API_2

export function getList(params) {
  return request({
    url: baseUrl + '/ec/mall/get-supplier-list',
    method: 'get',
    params
  })
}

export function getSupplierOptions(params) {
  return request({
    url: baseUrl + '/ec/mall/get-all-supplier-list',
    method: 'get',
    params
  })
}

export function updateStatus(params) {
  return request({
    url: baseUrl + '/ec/mall/charge-supplier-status',
    method: 'put',
    data: params
  })
}

export function save(params) {
  return request({
    url: baseUrl + '/ec/mall/supplier',
    method: 'post',
    data: params
  })
}

// 设置结算周期
export function setUpSettlementPeriod(params) {
  return request({
    url: baseUrl + '/ec/mall/supplier-settlement-period',
    method: 'post',
    data: params
  })
}
