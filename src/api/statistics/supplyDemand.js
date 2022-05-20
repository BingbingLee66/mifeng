import request from '@/utils/request'

// 获取标签热词排行榜列表
export const getLabelHotList = params => request({ url: '/ec/ysh-stats-label/list', params })

// 获取行业热词排行榜列表
export const getTradeHotList = params => request({ url: '/ec/ysh-stats-trade/list', params })
