import request from '@/utils/request'

// 热门供需-列表
export function hotSupplyDemandList(params) {
  return request({
    url: '/ec/demand/_mget',
    method: 'get',
    params
  })
}
// 热门供需-批量删除
export function deleteHotSupplyDemand(params) {
  return request({
    url: '/ec/demand/_mdelete',
    method: 'delete',
    data: params
  })
}
// 热门供需-权重修改
export function weightSupplyDemand(params) {
  return request({
    url: `/ec/demand/${params.id}/demand-weight/${params.value}`,
    method: 'put',
  })
}
// 热门供需-批量添加供需到热门
export function addHotSupplyDemand(data, ckey = 'ysh') {
  return request({
    url: `/ec/demand/${ckey}/_mcreate`,
    method: 'post',
    data
  })
}
