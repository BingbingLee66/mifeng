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
