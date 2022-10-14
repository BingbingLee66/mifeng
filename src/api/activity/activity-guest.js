import request from '@/utils/request'

// 活动嘉宾添加接口
export function createGuest(params) {
  return request({
    url: '/api/ec/activity-guests/save',
    method: 'post',
    data: params
  })
}

// 活动嘉宾编辑接口
export function updateGuest(params) {
  return request({
    url: '/api/ec/activity-guests/update',
    method: 'put',
    data: params
  })
}

// 活动嘉宾列表接口
export function getGuestList(params) {
  return request({
    url: '/api/ec/activity-guests/page',
    method: 'get',
    params,
  })
}

// 活动嘉宾删除接口
export function delGuest(params) {
  return request({
    url: '/api/ec/activity-guests/delete',
    method: 'delete',
    data: params
  })
}

// 嘉宾库分页查询
export function getChamberGuestList(params) {
  return request({
    url: '/api/ec/chamber-guests/page',
    method: 'get',
    params
  })
}

// 嘉宾库删除接口
export function delChamberGuest(params) {
  return request({
    url: '/api/ec/chamber-guests/delete',
    method: 'delete',
    data: params
  })
}

// 嘉宾库编辑接口
export function updateChamberGuest(params) {
  return request({
    url: '/api/ec/chamber-guests/update',
    method: 'put',
    data: params
  })
}

// 用户库分页查询
export function getWxUserList(params) {
  return request({
    url: '/api/ecservice/ec/wx-user/page',
    method: 'get',
    params
  })
}

// 会员库分页查询
export function getMemberList(params) {
  return request({
    url: '/api/ecservice/ec/member/page',
    method: 'get',
    params
  })
}
