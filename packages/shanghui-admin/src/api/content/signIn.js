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
export function yshCheckInTextDelBatch(ids) {
  return request({
    url: '/ecservice/ec/ysh-check-in-text/delBatch?ids=' + ids,
    method: 'delete'
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
