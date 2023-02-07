import request from '@/utils/request'

export const chamberStatSave = data =>
  request({
    url: '/ecservice/ec/chamberStats/save',
    method: 'post',
    data
  })

export const webDataCollection = data =>
  request({
    url: '/ecservice/ec/chamberStats/webDataCollection',
    method: 'post',
    data
  })
// 问卷分页列表数据统计
export const getStatisticsData = params =>
  request({
    url: '/ecservice/crmapi/questionnaire/statistics/getStatisticsDataByCkey',
    method: 'get',
    params
  })
// 总览数据统计
export const getOverviewData = () =>
  request({
    url: '/ecservice/crmapi/questionnaire/statistics/getOverviewData',
    method: 'get'
  })
// 时间轴总览数据
export const getTimelineOverviewData = params =>
  request({
    url: '/ecservice/crmapi/questionnaire/statistics/getTimelineOverviewData',
    method: 'get',
    params
  })
