import request from '@/utils/request'

// 相册举报列表
export const getReportList = params => request({
  url: '/ec/report/album-reportList',
  method: 'get',
  params
})

// 相册举报详情
export const getReportById = params => request({
  url: '/ec/report/album-reportInfo',
  method: 'get',
  params
})
