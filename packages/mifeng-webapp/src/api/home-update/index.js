import request from '@/utils/request'

// 热门供需-列表
export function getHotDemandList(params) {
  return request({
    url: '/ecservice/ec/demand/_mget',
    method: 'get',
    params
  })
}
// 热门供需-批量删除
export function deleteHotSupplyDemand(params) {
  return request({
    url: '/ecservice/ec/demand/_mdelete',
    method: 'delete',
    data: params
  })
}
// 热门供需-权重修改
export function modifyDemandWeight(params) {
  return request({
    url: `/ecservice/ec/demand/${params.id}/demand-weight/${params.value}`,
    method: 'put'
  })
}
// 热门供需-批量添加供需到热门
export function addHotSupplyDemand(data, ckey = 'ysh') {
  return request({
    url: `/ecservice/ec/demand/${ckey}/_mcreate`,
    method: 'post',
    data
  })
}

// 分页查询供需列表
export function getSupplyDemandList(params) {
  return request({
    url: '/ecservice/ec/ysh-content/pagedList',
    method: 'get',
    params
  })
}
