import request from '@/utils/request'
const baseUrl = process.env.VUE_APP_BASE_API_2

export function getPlatformMallStatistics(params) {
  return request({
    url: baseUrl + '/ec/mall/platform-mall-statistics',
    method: 'get',
    params
  })
}

export function getMallStatistics(params) {
  return request({
    url: baseUrl + '/ec/mall/mall-statistics',
    method: 'get',
    params
  })
}

export function getPlatformMallTradeStatistics(params) {
  return request({
    url: baseUrl + '/ec/mall/platform-mall-trade-data',
    method: 'get',
    params
  })
}

export function getMallTradeStatistics(params) {
  return request({
    url: baseUrl + '/ec/mall/mall-trade-data',
    method: 'get',
    params
  })
}

export function getPlatformMallData(params) {
  return request({
    url: baseUrl + '/ec/mall/platform-mall-data',
    method: 'get',
    params
  })
}

export function getPlatformMallGoodsRank(params) {
  return request({
    url: baseUrl + '/ec/mall/platform-mall-goods-rank',
    method: 'get',
    params
  })
}

export function getMallGoodsRank(params) {
  return request({
    url: baseUrl + '/ec/mall/mall-goods-rank',
    method: 'get',
    params
  })
}
