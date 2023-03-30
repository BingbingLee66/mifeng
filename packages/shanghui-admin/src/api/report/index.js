import request from '@/utils/request'

// 相册举报列表
export const getReportList = params =>
  request({
    url: 'ecservice/ec/report/album-reportList',
    method: 'get',
    params
  })

// 相册举报详情
export const getReportById = id =>
  request({
    url: `ecservice/ec/report/album-reportInfo?albumId=${id}`,
    method: 'get'
  })
