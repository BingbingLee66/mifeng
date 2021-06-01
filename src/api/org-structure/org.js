import request from '@/utils/request'

export function getDepartmentList(params) {
  return request({
    url: '/api/ec/department/list',
    method: 'get',
    params
  })
}

export function saveDepartment(params) {
  return request({
    url: '/api/ec/department/save',
    method: 'post',
    params
  })
}

export function delDepartment(params) {
  return request({
    url: '/api/ec/department/delete',
    method: 'delete',
    params
  })
}

export function getMemberList(params) {
  return request({
    url: '/ec/member/member-list',
    method: 'get',
    params
  })
}

export function updateDepartment(params) {
  return request({
    url: '/api/ec/department/update-department',
    method: 'put',
    params
  })
}

/*
* 获取部门入会专属二维码
* */
export function getInviteLogo(params) {
  return request({
    url: '/api/ec/department/invite-logo',
    method: 'get',
    params
  })
}

/*
* 刷新部门入会专属二维码
* */
export function updateInviteLogo(params) {
  return request({
    url: '/api/ec/department/update-qrcode',
    method: 'get',
    params
  })
}
