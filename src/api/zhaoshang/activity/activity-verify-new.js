import request from '@/utils/request'

// 获取商会活动详情
export const getInvesChamberActivityInfoById = activityId => request({
  url: `/api/ec/invesActivity-apply/chamberActivityInfo/${activityId}`,
  method: 'get'
})

// 上传座位表
export const uploadInvesSeating = data => request({
  url: '/api/ec/invesSingin/uploadSeating',
  method: 'post',
  data
})

// 删除座位表
export const deleteInvesSeating = activityId => request({
  url: `/api/ec/invesSingin/Seat/clean/${activityId}`,
  method: 'get'
})

// 获取活动报名列表
export const getActivityList = (id, params) => request({
  url: `/api/ec/invesSingin/activity/${id}`,
  method: 'get',
  params
})

// 导入活动报名数据
export const uploadInvesSigninData = data => request({
  url: '/api/ec/invesSingin',
  method: 'post',
  data
})

// 修改报名状态
export const modifyInvesSigninStatus = ({ status, id, activityId }, params) => request({
  url: `/api/ec/invesSingin/apply/${status}/${id}/${activityId}`,
  method: 'put',
  params
})

// 保存备注
export const saveInvesRemark = (id, params) => request({
  url: `/api/ec/invesSingin/remark/${id}`,
  params,
  method: 'post'
})

// 签到
export const handleApplySignin = ({ num, status, id }) => request({
  url: `/api/ec/invesActivity-apply/signin/${num}/${status}/${id}`,
  method: 'put'
})

// 查询替补人员信息
export const queryInvesSubInfo = phone => request({
  url: `/api/ec/invesSingin/distinguish/${phone}`,
  method: 'get',
})

// 设置替补人员
export const setInvesSubUser = ({ id, phone }) => request({
  url: `/api/ec/invesSingin/user-alert/${id}/${phone}`,
  method: 'get'
})

// 签退
export const handleInvesSignOut = ({ id, status }) => request({
  url: `/api/ec/invesActivity-apply/signout/${status}/${id}`,
  method: 'put'
})

// 获取各个状态审核总数量
export const getStatusCount = id => request({
  url: `/api/ec/invesSingin/status-count/${id}`,
  method: 'get'
})

// 设置座位号
export const resetInvesSigninSeat = (activityApplyId, data) => request({
  url: `/api/ec/invesSingin/seat/reset/${activityApplyId}`,
  method: 'post',
  data
})

// 空座变为已就坐
export const modifyInvesSeatStatus = (activityApplyId, data) => request({
  url: `/api/ec/invesSingin/seat/status/${activityApplyId}`,
  method: 'post',
  data
})
// 获取活动excel
export const getInvesActivityExcel = (id, params) => request({
  url: `/api/ec/invesSingin/activity/${id}/excel`,
  method: 'get',
  params,
  responseType: 'blob'
})
