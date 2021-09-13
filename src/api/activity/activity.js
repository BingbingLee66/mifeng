import request from '@/utils/request'

const baseUrl2 = process.env.VUE_APP_BASE_API_2

// 创建活动
export function createActivity(params) {
  return request({
    url: '/api/ec/activity/activity-save',
    method: 'post',
    data: params
  })
}

// 查询活动详情
export function getActivity(params) {
  return request({
    url: '/api/ec/activity/get-activity',
    method: 'get',
    params
  })
}

// 查询活动列表
export function getActivityList(params) {
  return request({
    url: '/api/ec/activity/activity-list',
    method: 'get',
    params
  })
}

// 修改发布状态
export function publishActivity(params) {
  return request({
    url: '/api/ec/activity/update-activity-publish',
    method: 'put',
    params
  })
}

// 删除活动
export function delActivity(params) {
  return request({
    url: '',
    method: 'put',
    params
  })
}

// 修改权重
export function updateActivitySort(params) {
  return request({
    url: '/api/ec/activity/update-activity-sort',
    method: 'put',
    params
  })
}

// 获取活动来源
export function getChamberOptions() {
  return request({
    url: baseUrl2 + '/ec/mall/get-chamber-options',
    method: 'get'
  })
}

// 上传活动图片
export function uploadPortrait(params) {
  return request({
    url: '/ec/upload/activity-img',
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data: params
  })
}
