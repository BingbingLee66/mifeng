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

// 总后台冻结供需
export const freezeSupplyDemandByUpBackground = (id, data) => request({ url: `/ec/ysh-content/freeze/${id}`, method: 'put', data })

// 总后台解冻
export const unFreezeSupplyDemandByUpBackground = (id, data) => request({ url: `/ec/ysh-content/unFreeze/${id}`, method: 'put', data })

// 删除供需
export const deleteSupplyDemand = id => request({ url: `/ec/ysh-content/${id}`, method: 'delete' })

// 撤销删除供需
export const unDeleteSupplyDemand = id => request({ url: `/ec/ysh-content/unDel/${id}`, method: 'put' })

// 获取供需详情
export const getSupplyDemandDetail = id => request({ url: `/ec/ysh-content/${id}`, method: 'get' })
