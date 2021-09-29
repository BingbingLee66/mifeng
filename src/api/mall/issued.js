import request from '@/utils/request'

const baseUrl = process.env.VUE_APP_BASE_API_2

export function getExplodeGoodsList(params) {
  return request({
    url: baseUrl + '/api/ec/mall/explodeGoods/listExplodeGoods',
    method: 'get',
    params
  })
}

export function createSend(params) {
  return request({
    url: baseUrl + '',
    method: 'get',
    params
  })
}

export function sendCoupon(params) {
  return request({
    url: baseUrl + '',
    method: 'get',
    params
  })
}
