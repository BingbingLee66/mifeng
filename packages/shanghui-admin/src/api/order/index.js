import request from '@/utils/request'

const baseUrl = '/ecmall'

// 批量发货
export function batchShipment(params) {
  return request({
    url: baseUrl + '/ec/mall/import-shipping',
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data: params
  })
}

export function getAllList(params) {
  return request({
    url: baseUrl + '/ec/mall/get-all-order-list',
    method: 'get',
    params,
    hiddenError: false
  })
}

export function getList(params) {
  return request({
    url: baseUrl + '/ec/mall/get-order-list',
    method: 'get',
    params
  })
}

export function getOrder(params) {
  return request({
    url: baseUrl + '/ec/mall/get-order',
    method: 'get',
    params
  })
}

export function updateShipping(params) {
  return request({
    url: baseUrl + '/ec/mall/update-shipping',
    method: 'post',
    data: params
  })
}

export function updateOrder(params) {
  return request({
    url: baseUrl + '/ec/mall/update-order',
    method: 'post',
    data: params
  })
}

export function getMatchForm(params) {
  return request({
    url: baseUrl + '/ec/mall/match-form',
    method: 'get',
    params
  })
}

export function getChannelList() {
  return request({
    url: baseUrl + '/ec/mall/channel/thChannel-list-all',
    method: 'get'
  })
}
