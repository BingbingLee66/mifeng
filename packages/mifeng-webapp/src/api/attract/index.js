import request from '@/utils/request'

// 查询招商办信息 status 状态 -1全部 0正常 1冻结
export const getInfoList = params => request({ url: '/ecservice/ec/investment-info/list', method: 'get', params })

// 查询活动列表
export const getInvesActivityList = params =>
  request({ url: '/ecservice/api/ec/invesActivity/activity-list', method: 'get', params })
