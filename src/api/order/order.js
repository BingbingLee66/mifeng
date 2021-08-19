import request from '@/utils/request'
const baseUrl = process.env.VUE_APP_BASE_API_2

export function getAllList(params) {
  return request({
    url: baseUrl + '/ec/mall/get-all-order-list',
    method: 'get',
    params
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
    params
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
