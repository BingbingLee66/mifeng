import request from '@/utils/request'

const baseUrl = process.env.VUE_APP_BASE_API_2

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
export function querySpreeDetail(params) {
  return request({
    url: baseUrl + '/ec/mall/get-goods',
    method: 'get',
    params
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
