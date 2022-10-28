import request from '@/utils/request'

// 数据统计概况
export function getDataStatistics(params) {
  return request({
    url: '/ec/invesInfoStat/get-data-statistics',
    method: 'get',
    params
  })
}

// 数据统计趋势图
export function getReadTrendChart(params) {
  return request({
    url: '/ec/invesInfoStat/get-read-trend-chart',
    method: 'get',
    params
  })
}

// 数据统计详情
export function getReadDataDetail(params) {
  return request({
    url: '/ec/invesInfoStat/get-read-data-detail',
    method: 'get',
    params
  })
}

// 获取平台标记标签
export function getMemberLabelList(params) {
  return request({
    url: '/ec/member-label/get-list',
    method: 'get',
    params
  })
}
