import request from '@/utils/request'

// 分页查询供需列表
export function supplyDemandList(params) {
  return request({
    url: '/ec/ysh-content/pagedList',
    method: 'get',
    params
  })
}

export const publishSupplyDemand = data => request({ url: '/ec/ysh-content', method: 'post', data })
