import request from '@/utils/request'

// 添加热门活动
export function addHotActivity(params) {
  return request({
    url: '/api/ec/activity-hot/add-activity-hot',
    method: 'put',
    data: params
  })
}

// 移出热门活动
export function delHotActivity(params) {
  return request({
    url: '/api/ec/activity-hot/delById',
    method: 'delete',
    data: params
  })
}

// 查询活动来源列表
export function getActivitySource(params) {
  return request({
    url: '/api/ec/activity-hot/chamber-list',
    method: 'post',
    params
  })
}

// 查询热门活动列表
export function getHotActivityList(params) {
  return request({
    url: '/api/ec/activity-hot/list',
    method: 'get',
    params
  })
}

// 修改权重
export function updateHotActivitySort(params) {
  return request({
    url: '/api/ec/activity-hot/update-sort',
    method: 'post',
    params
  })
}
