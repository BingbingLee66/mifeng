import request from '@/utils/request'

export function getStatistics(params) {
  return request({
    url: '/ecmall/ec/mall/memberdata-statistics',
    method: 'get',
    params
  })
}

export function getDailyStatistics(params) {
  return request({
    url: '/ecmall/ec/mall/memberdata-dailyStatistics',
    method: 'get',
    params
  })
}

export function getTradeBar(params) {
  return request({
    url: '/ecmall/ec/mall/memberdata-trade-bar',
    method: 'get',
    params
  })
}

export function getAgeBar(params) {
  return request({
    url: '/ecmall/ec/mall/memberdata-age-bar',
    method: 'get',
    params
  })
}

export function getGenderBar(params) {
  return request({
    url: '/ecmall/ec/mall/memberdata-gender-bar',
    method: 'get',
    params
  })
}

export function getYearsBar(params) {
  return request({
    url: '/ecmall/ec/mall/memberdata-years-bar',
    method: 'get',
    params
  })
}
