import request from '@/utils/request'
// 获取标签热词排行榜列表
export function getLabelHotList(params) {
  return request({
    url: '/statistics/ec/ysh-stats-label/list',
    method: 'get',
    params
  })
}

// 获取行业热词排行榜列表
export function getTradeHotList(params) {
  return request({
    url: '/statistics/ec/ysh-stats-trade/list',
    method: 'get',
    params
  })
}

// 获取供需统计列表
export function getSupplyDemandStatsList(params) {
  return request({
    url: '/statistics/ec/stats/demand/demand-stats-list',
    method: 'get',
    params
  })
}

// 获取供需数据累计
export function getSupplyDemandTotalStats(params) {
  return request({
    url: '/statistics/ec/stats/demand/demand-stats-total',
    method: 'get',
    params
  })
}
