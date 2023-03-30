import request from '@/utils/request'

// 签到文本列表
export function yshCheckInTextList(params) {
  return request({
    url: '/ecservice/ec/ysh-check-in-text/list',
    method: 'get',
    params
  })
}

// 批量删除签到文本列表
export function yshCheckInTextDelBatch(params) {
  return request({
    url: '/ecservice/ec/ysh-check-in-text/delBatch',
    method: 'delete',
    data: params
  })
}

// 新增
export function yshCheckInTextInsert(params) {
  return request({
    url: '/ecservice/ec/ysh-check-in-text/insert',
    method: 'post',
    data: params
  })
}
