import request from '@/utils/request'
const baseUrl = process.env.VUE_APP_BASE_API_2

export function getStatistics(params) {
  return request({
    url: baseUrl + '/ec/mall/memberdata-statistics',
    method: 'get',
    params
  })
}

export function getDailyStatistics(params) {
  return request({
    url: baseUrl + '/ec/mall/memberdata-dailyStatistics',
    method: 'get',
    params
  })
}

export function getTradeBar(params) {
  return request({
    url: baseUrl + '/ec/mall/memberdata-trade-bar',
    method: 'get',
    params
  })
}

export function getAgeBar(params) {
  return request({
    url: baseUrl + '/ec/mall/memberdata-age-bar',
    method: 'get',
    params
  })
}

export function getGenderBar(params) {
  return request({
    url: baseUrl + '/ec/mall/memberdata-gender-bar',
    method: 'get',
    params
  })
}

export function getYearsBar(params) {
  return request({
    url: baseUrl + '/ec/mall/memberdata-years-bar',
    method: 'get',
    params
  })
}
