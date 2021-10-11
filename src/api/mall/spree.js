import request from '@/utils/request'

const baseUrl = process.env.VUE_APP_BASE_API_3

// 创建大礼包
export function createSpree(params) {
  return request({
    url: baseUrl + 'api/bigGiftBag/bigGiftbag',
    method: 'post',
    data: params
  })
}

// 大礼包列表
export function getSpreeList(params) {
  return request({
    url: baseUrl + '/api/bigGiftBag/bigGiftBagList',
    method: 'get',
    params
  })
}

// 更新发行量
export function updateSpreeIssue(params) {
  return request({
    url: baseUrl + '',
    method: 'get',
    params
  })
}

// 查询大礼包详情
export function queryCouponInfo(params) {
  return request({
    url: baseUrl + '/coupon/valid/' + params,
    method: 'get'
  })
}

// 更新发行状态
export function updateIssueStatus(params) {
  return request({
    url: baseUrl + '/api/bigGiftBag/issue',
    method: 'put',
    params
  })
}

// 查询已发放列表
export function querySpreeIssued(params) {
  return request({
    url: baseUrl + '/api/bigGiftBag/issuedBigGiftBagList',
    method: 'get',
    params
  })
}
