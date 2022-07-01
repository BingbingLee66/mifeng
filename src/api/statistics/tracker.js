import request from '@/utils/request'

// 上报前端hash路由
export const reportHashUrlData = data => request({
  url: '/ec/chamberStats/webDataCollection',
  method: 'post',
  data
})

// 上报点击事件
export const reportClickData = data => request({
  url: '/ec/chamberStats/save',
  method: 'post',
  data
})
