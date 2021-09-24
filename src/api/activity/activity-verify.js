import request from '@/utils/request'

// 活动报名审核列表
export function getActivityApplyList(params) {
  return request({
    url: '/api/ec/activity-apply/list',
    method: 'get',
    params
  })
}

// 通过/驳回报名申请
export function aduitActivityApply(params) {
  return request({
    url: '/api/ec/activity-apply/audit',
    method: 'post',
    data: params
  })
}

// 下载签到表
export function downloadActivityApply(params) {
  return request({
    url: '/api/ec/activity-apply/download',
    method: 'get',
    params
  })
}

// 某活动报名列表
export function getActivityApply(params) {
  return request({
    url: '/api/ec/activity-apply/list-byId',
    method: 'get',
    params
  })
}

// 某活动某人驳回理由列表
export function getActivityRejectApply(params) {
  return request({
    url: '/api/ec/activity-apply/list-reject-reason',
    method: 'get',
    params
  })
}

// 签到
export function signActivityApply(params) {
  return request({
    url: '/api/ec/activity-apply/sign',
    method: 'post',
    data: params
  })
}

// 活动活动来源列表
export function getActivitySource(params) {
  return request({
    url: '/api/ec/activity-hot/chamber-list',
    method: 'post',
    data: params
  })
}

// 活动报名审核详情
export function getActivityApplyDetail(params) {
  return request({
    url: '/api/ec/activity-apply/detail',
    method: 'get',
    params
  })
}
