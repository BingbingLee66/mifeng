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

// 上报 sls日志
/**
 * userAgent 浏览器内核
 * ip 浏览器ip
 * time 时间戳
 * date 日期
 * url 访问路径
 * ckey 商会标识
 * user_only 用户唯一标识
 * method 请求类型
 * status 响应状态
 * params 请求参数
 * extend 扩展参数
 */
// export const reportSlsData = data => sls.send({
//   userAgent: navigator.userAgent.toLowerCase(),
//   ip: getNetworkIp(),
//   time: Date.now(),
//   date: formatDateTime(new Date(), 'yyyy-MM-dd hh:mm:ss'),
//   url: data.url,
//   ckey: data.ckey,
//   user_only: data.user_only,
//   method: data.method,
//   status: data.status,
//   params: data.params,
//   extend: data.extend
// })

