import request from '@/utils/request'
const baseUrl = process.env.VUE_APP_BASE_API_2

export function getPlatformMemberPaidData(params) {
  return request({
    url: baseUrl + '/ec/mall/platform-chamber-join-statistics',
    method: 'get',
    params
  })
}

export function getPlatformMemberJoinData(params) {
  return request({
    url: baseUrl + '/ec/mall/memberdata-dailyStatistics',
    method: 'get',
    params
  })
}

export function getPlatformChamberData(params) {
  return request({
    url: baseUrl + '/ec/mall/platform-chamber-data',
    method: 'get',
    params
  })
}
// 商会统计数据列表查询
export function getAllChamberStatsDataByCkeyList(params) {
  return request({
    url: baseUrl + '/ec/chamberStats/getAllChamberStatsDataByCkeyList',
    method: 'get',
    params
  })
}
// 获取商会登录记录
export function getChamberLoginDataList(params) {
  return request({
    url: baseUrl + '/ec/chamberStats/getChamberLoginDataList',
    method: 'get',
    params
  })
}
// 商会详情统计数据列表查询
export function getChamberTypeStatsDataByCkeyList(params) {
  return request({
    url: baseUrl + '/ec/chamberStats/getChamberTypeStatsDataByCkeyList',
    method: 'get',
    params
  })
}
