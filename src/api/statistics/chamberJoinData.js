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
