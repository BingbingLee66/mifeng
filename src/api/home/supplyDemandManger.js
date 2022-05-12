import request from '@/utils/request'

// 分页查询供需列表
export function supplyDemandList(params) {
  return request({
    url: '/ec/ysh-content/pagedList',
    method: 'get',
    params
  })
}

// 发布供需
export const publishSupplyDemand = data => request({ url: '/ec/ysh-content', method: 'post', data })

// 获取举报信息
export const getReportList = params => request({ url: '/ec/report/reportList', method: 'get', params })

// 查看可冻结列表
export const getFreezeAbleList = params => request({ url: '/ec/ysh-content/canFreezes', method: 'get', params })

// 查看可解冻列表
export const getUnFreezeAbleList = params => request({ url: '/ec/ysh-content/canUnFreezes', method: 'get', params })
