import request from '@/utils/request'

const baseUrl = process.env.VUE_APP_BASE_API_2

export function getIssuedCouponList(params) {
  return request({
    url: baseUrl + '/api/issueCoupon/issuedCouponList',
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

// 发送优惠券
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

// 已发送列表
export function getIssuedListByOrderId(id, params) {
  return request({
    url: baseUrl + '/coupon-user/sends/' + id,
    method: 'get',
    params
  })
}

