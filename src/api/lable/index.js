import request from '@/utils/request'

// 供需可用标签集合
export const getAvailableLabelList = params => request({ url: '/ec/label/availableLabelList', method: 'get', params })

// 获取行业标签集合
export const getTradeLabelList = params => request({ url: '/ec/label/tradeList', method: 'get', params })