import request from '@/utils/request'

// 获取商会活动详情
export const getChamberActivityInfoById = activityId => request({
  url: `/api/ec/activity-apply/chamberActivityInfo/${activityId}`,
  method: 'get'
})

// 上传座位表
export const uploadSeating = data => request({
  url: '/api/ec/singin/uploadSeating',
  method: 'post',
  data
})

// 获取活动报名列表
export const getActivitySinginList = (id, params) => request({
  url: `/api/ec/singin/activity/${id}`,
  method: 'get',
  params
})

// 导入活动报名数据
export const uploadSinginData = data => request({
  url: '/api/ec/singin',
  method: 'post',
  data
})

// 修改报名状态
export const modifySinginStatus = ({ status, id }) => request({
  url: `/api/ec/singin/apply/${status}/${id}`,
  method: 'put'
})

// 保存备注
export const saveRemark = (id, params) => request({
  url: `/api/ec/singin/remark/${id}`,
  params,
  method: 'post'
})

// 签到
export const handleSignin = ({ num, status, id }) => request({
  url: `/api/ec/singin/signin/${num}/${status}/${id}`,
  method: 'put'
})

// 查询替补人员信息
export const querySubInfo = phone => request({
  url: `/api/ec/singin/detail/${phone}`,
  method: 'get',
})

// 设置替补人员
export const setSubUser = ({ id, phone }) => request({
  url: `/api/ec/singin/user-alert/${id}/${phone}`,
  method: 'get'
})

// 签退
export const handleSignOut = ({ id, status }) => request({
  url: `/api/ec/singin/signout/${status}/${id}`,
  method: 'put'
})

// 获取各个状态审核总数量
export const getSigninStatusCount = id => request({
  url: '/api/ec/singin/status-count',
  method: 'get'
})
