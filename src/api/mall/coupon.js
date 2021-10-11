import request from '@/utils/request'

const baseUrl = process.env.VUE_APP_BASE_API_3

export function getExplodeGoodsList(params) {
  return request({
    url: baseUrl + '/api/ec/mall/explodeGoods/listExplodeGoods',
    method: 'get',
    params
  })
}

// 创建优惠券
export function createCoupon(params) {
  return request({
    url: baseUrl + '/coupon',
    method: 'post',
    data: params
  })
}

// 查询优惠劵列表
export function getCouponList(params) {
  return request({
    url: baseUrl + '/coupons',
    method: 'get',
    params
  })
}

// 查询优惠劵详情
export function queryCouponDetailById(params) {
  return request({
    url: baseUrl + '/coupon/' + params,
    method: 'get'
  })
}

// 更新发行量
export function updateIssue(params) {
  return request({
    url: baseUrl + '/coupon-size/' + params.templateId + '/' + params.quota,
    method: 'put'
  })
}

// 继续/停止发优惠券
export function updateIssueStatus(params) {
  return request({
    url: baseUrl + '/coupon-status/' + params.templateId + '/' + params.status,
    method: 'put'
  })
}

// 查询已发送优惠券列表
export function queryCouponIssued(params) {
  return request({
    url: baseUrl + '/coupon/sends',
    method: 'get',
    params
  })
}

export function queryDetail(params) {
  return request({
    url: baseUrl + '/ec/mall/get-goods',
    method: 'get',
    params
  })
}
