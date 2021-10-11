import request from '@/utils/request'

const baseUrl = process.env.VUE_APP_BASE_API_3

export function getExplodeGoodsList(params) {
  return request({
    url: baseUrl + '/api/ec/mall/explodeGoods/listExplodeGoods',
    method: 'get',
    params
  })
}

export function getIssuedCouponList(params) {
  return request({
    url: baseUrl + '/api/issueCoupon/issuedCouponList/',
    method: 'get',
    params
  })
}

// 发放优惠券
export function createSend(params) {
  return request({
    url: baseUrl + '/api/issueCoupon/createIssuingCoupon',
    method: 'post',
    data: params
  })
}

export function sendCoupon(params) {
  return request({
    url: baseUrl + '/api/issueCoupon/sendCoupon',
    method: 'put',
    params
  })
}

// 已发放劵列表
export function getIssuedCouponUserList(params) {
  return request({
    url: baseUrl + '/api/issueCoupon/issuedCouponUserList',
    method: 'get',
    params
  })
}

