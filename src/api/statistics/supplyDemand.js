import request from '@/utils/request'

// 获取标签热词排行榜列表
export const getLabelHotList = params => request({ url: '/ec/ysh-stats-label/list', params })

// 获取行业热词排行榜列表
export const getTradeHotList = params => request({ url: '/ec/ysh-stats-trade/list', params })

// 获取供需统计列表
export const getSupplyDemandStatsList = params => request({ url: '/ec/stats/demand/demand-stats-list', params })

// 获取供需数据累计
export const getSupplyDemandTotalStats = params => request({ url: '/ec/stats/demand/demand-stats-total', params })
