import request from '@/utils/request'

export function getActivitySummaryStatistics(params) {
  return request({
    url: '/api/ec/activity/activity-summary',
    method: 'get',
    params
  })
}

export function getActivitySummaryChamber(params) {
  return request({
    url: '/api/ec/activity/activity-summary-chamber',
    method: 'get',
    params
  })
}
