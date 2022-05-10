import request from '@/utils/request'


//分页查询供需列表
export function supplyDemandList(params) {
  return request({
    url: '/ec/ysh-content/pagedList',
    method: 'get',
    params
  })
}