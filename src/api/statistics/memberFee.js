import request from '@/utils/request'
const baseUrl = process.env.VUE_APP_BASE_API_2

export function getPlatformMemberPaidData(params) {
  return request({
    url: baseUrl + '/ec/mall/platform-member-paid-data',
    method: 'get',
    params
  })
}

export function getPlatformChamberPaidData(params) {
  return request({
    url: baseUrl + '/ec/mall/platform-chamber-paid-data',
    method: 'get',
    params
  })
}
