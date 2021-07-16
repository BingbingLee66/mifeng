import request from '@/utils/request'
const baseUrl = process.env.VUE_APP_BASE_API_2

export function getContentStatistics(params) {
  return request({
    url: baseUrl + '/ec/mall/platform-content-statistics',
    method: 'get',
    params
  })
}

export function getContentData(params) {
  return request({
    url: baseUrl + '/ec/mall/platform-content-data',
    method: 'get',
    params
  })
}
