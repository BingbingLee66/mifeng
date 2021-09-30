import request from '@/utils/request'

const baseUrl = process.env.VUE_APP_BASE_API_2

export function getExplodeGoodsList(params) {
  return request({
    url: baseUrl + '/api/ec/mall/explodeGoods/listExplodeGoods',
    method: 'get',
    params
  })
}

// 查询优惠劵列表
export function getCouponList(params) {
  return request({
    url: baseUrl + '',
    method: 'get',
    params
  })
}

// 更新发行量
export function updateIssueAmount(params) {
  return request({
    url: baseUrl + '',
    method: 'get',
    params
  })
}

// 停止发优惠券
export function stopIssue(params) {
  return request({
    url: baseUrl + '',
    method: 'get',
    params
  })
}

// 继续发优惠券
export function continueIssue(params) {
  return request({
    url: baseUrl + '',
    method: 'get',
    params
  })
}

// 创建优惠券
export function createCoupon(params) {
  return request({
    url: baseUrl + '',
    method: 'get',
    params
  })
}

// 查询优惠劵详情
export function queryCouponDetailById(params) {
  return request({
    url: baseUrl + '/api/coupon/' + params,
    method: 'get'
  })
}

export function queryDetail(params) {
  return request({
    url: baseUrl + '/ec/mall/get-goods',
    method: 'get',
    params
  })
}
