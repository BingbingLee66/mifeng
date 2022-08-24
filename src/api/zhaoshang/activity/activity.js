import request from '@/utils/request'

const baseUrl2 = process.env.VUE_APP_BASE_API_2

// 创建活动
export function createActivity(params) {
  return request({
    url: '/api/ec/invesActivity/activity-save-v1',
    method: 'post',
    data: params
  })
}

// 查询活动详情
export function getActivity(params) {
  return request({
    url: '/api/ec/invesActivity/get-activity',
    method: 'get',
    params
  })
}

// 查询活动列表
export function getActivityList(params) {
  return request({
    url: '/api/ec/invesActivity/activity-list',
    method: 'get',
    params
  })
}

// 修改发布状态
export function publishActivity(params) {
  return request({
    url: '/api/ec/invesActivity/update-activity-publish',
    method: 'put',
    params
  })
}

// 删除活动
export function delActivity(params) {
  return request({
    url: '/api/ec/invesActivity/delete-activity',
    method: 'delete',
    params
  })
}

// 修改权重
export function updateActivitySort(params) {
  return request({
    url: '/api/ec/invesActivity/update-activity-sort',
    method: 'put',
    params
  })
}

// 查询活动来源列表
// export function getActivitySource(params) {
//   return request({
//     url: '/api/ec/activity-hot/chamber-list',
//     method: 'post',
//     params
//   })
// }
//
// // 上传活动图片
// export function uploadPortrait(params) {
//   return request({
//     url: '/ec/upload/activity-img',
//     method: 'post',
//     headers: { 'Content-Type': 'multipart/form-data' },
//     data: params
//   })
// }
//
// // 设置直播间链接和观看权限
// export function setLinkAndCompetence(params) {
//   return request({
//     url: '/api/ecservice/api/ec/activity/',
//     method: 'post',
//     data: params
//   })
// }
