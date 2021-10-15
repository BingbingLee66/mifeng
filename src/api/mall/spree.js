import request from '@/utils/request'

const baseUrl = process.env.VUE_APP_BASE_API_2

// 创建大礼包
export function createSpree(params) {
  return request({
    url: baseUrl + '/bigGiftBag/bigGiftbag',
    method: 'post',
    data: params
  })
}

// 大礼包列表
export function getSpreeList(params) {
  return request({
    url: baseUrl + '/bigGiftBag/bigGiftBagList',
    method: 'get',
    params
  })
}

// 更新发行量
export function updateSpreeIssue(params) {
  return request({
    url: baseUrl + '/updateQuota/' + params.giftId + '/' + params.quota,
    method: 'put'
  })
}

// 查询大礼包详情
export function querySpreedInfo(params) {
  return request({
    url: baseUrl + '/bigGiftBag/BigGiftBagMsg/' + params,
    method: 'get'
  })
}

// 更新发行状态
export function updateIssueStatus(params) {
  return request({
    url: baseUrl + `/bigGiftBag/issue/${params.giftId}/${params.status}/${params.updateId}`,
    method: 'put'
  })
}

// 查询已发放列表
export function querySpreeIssued(params) {
  return request({
    url: baseUrl + '/bigGiftBag/issuedBigGiftBagList',
    method: 'get',
    params
  })
}
