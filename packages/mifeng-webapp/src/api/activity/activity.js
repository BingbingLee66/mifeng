import request from '@/utils/request'

// 创建活动
export function createActivity(params) {
  return request({
    url: '/ecservice/api/ec/activity/activity-save-v1',
    method: 'post',
    data: params
  })
}

// 获取活动是否有关联个人相册 true-有关联 false-未关联
export function getAlbumRelevance(params) {
  return request({
    url: '/ecservice/api/ec/activity/activity-personal-album-association',
    method: 'get',
    params
  })
}
// 查询活动详情
export function getActivity(params) {
  return request({
    url: '/ecservice/api/ec/activity/get-activity',
    method: 'get',
    params
  })
}

// 查询活动列表
export function getActivityList(params) {
  return request({
    url: '/ecservice/api/ec/activity/activity-list',
    method: 'get',
    params
  })
}

// 修改发布状态
export function publishActivity(params) {
  return request({
    url: '/ecservice/api/ec/activity/update-activity-publish',
    method: 'put',
    params
  })
}

// 删除活动
export function delActivity(params) {
  return request({
    url: '/ecservice/api/ec/activity/delete-activity',
    method: 'delete',
    params
  })
}

// 修改权重
export function updateActivitySort(params) {
  return request({
    url: '/ecservice/api/ec/activity/update-activity-sort',
    method: 'put',
    params
  })
}

// 查询活动来源列表
export function getActivitySource(params) {
  return request({
    url: '/ecservice/api/ec/activity-hot/chamber-list',
    method: 'post',
    params
  })
}

// 上传活动图片
export function uploadPortrait(params, handleProgress) {
  return request({
    url: '/ecservice/ec/upload/activity-img',
    method: 'post',
    onUploadProgress: handleProgress,
    headers: { 'Content-Type': 'multipart/form-data' },
    data: params
  })
}

// 设置直播间链接和观看权限
export function setLinkAndCompetence(params) {
  return request({
    url: '/ecservice/api/ecservice/api/ec/activity/',
    method: 'post',
    data: params
  })
}
export const activityDetail = params =>
  request({
    url: '/ecservice/api/ec/activity/detail',
    params
  })
// 活动时间修改
export const updateActivityTime = (id, params) =>
  request({
    url: `/ecservice/api/ec/activity/activities/${id}/time?endTime=${params}`,
    method: 'put'
  })
// 活动时间回显
export const showActivityTime = id =>
  request({
    url: `/ecservice/api/ec/activity/activities/${id}/time`,
    method: 'get'
  })
// 上传座位表
export const uploadSeating = data =>
  request({
    url: '/ecservice/api/ec/singin/uploadSeating',
    method: 'post',
    data
  })

// 获取设置直播间权限的商会ckey列表
export function getLinkPowerChamberCkeys(params) {
  return request({
    url: '/ecservice/api/ec/activity/hasLikAndCompetenceCkeys',
    data: params
  })
}
