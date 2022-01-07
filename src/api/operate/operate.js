import request from '@/utils/request'
// 新建/编辑邀请有礼
export function add(params) {
  return request({
    url: '/api/ec/memberExcitation/add',
    method: 'post',
    data: params
  })
}
// 邀请记录列表
export function detailList(params) {
  return request({
    url: '/api/ec/memberExcitation/detailList',
    method: 'get',
    params
  })
}
// 邀请有礼有效期
export function excitataionTime(params) {
  return request({
    url: '/api/ec/memberExcitation/getExcitationTime',
    method: 'get',
    params
  })
}
// 邀请有礼列表导出表格
export function guideTable(params) {
  return request({
    url: '/api/ec/memberExcitation/guideTable/' + params.id,
    method: 'post',
    responseType: 'blob'
  })
}
// 邀请有礼列表
export function list(params) {
  return request({
    url: '/api/ec/memberExcitation/list',
    method: 'get',
    params
  })
}
