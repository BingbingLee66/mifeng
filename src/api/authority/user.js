import request from '@/utils/request'

export function getList (params) {
  return request({
    url: '/ec/adminUser/list',
    method: 'get',
    params
  })
}

export function updateStatus (params) {
  return request({
    url: '/ec/adminUser/update-status',
    method: 'put',
    params
  })
}

export function updatePass (params) {
  return request({
    url: '/ec/adminUser/update-pass',
    method: 'put',
    params
  })
}

export function save (params) {
  return request({
    url: '/ec/adminUser/save',
    method: 'post',
    data: params
  })
}

export function delRole (params) {
  return request({
    url: '/ec/adminUser/delete',
    method: 'put',
    params
  })
}
