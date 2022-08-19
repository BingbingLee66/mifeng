import request from '@/utils/request'

// 活动报名审核列表
export function getApplyList(params) {
  return request({
    url: '/api/ec/invesActivity-apply/list',
    method: 'get',
    params
  })
}

// 通过/驳回报名申请
export function aduitActivityApply(params) {
  return request({
    url: '/api/ec/invesActivity-apply/audit',
    method: 'post',
    data: params
  })
}

// 某活动报名列表
export function getActivityApply(params) {
  return request({
    url: '/api/ec/invesActivity-apply/list-byId',
    method: 'get',
    params
  })
}

// 活动报名审核详情
export function getActivityApplyDetail(params) {
  return request({
    url: '/api/ec/invesActivity-apply/detail',
    method: 'get',
    params
  })
}
