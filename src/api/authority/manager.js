import request from '@/utils/request'

export function getList (params) {
  return request({
    url: '/ec/role/list',
    method: 'get',
    params
  })
}

export function updateStatus (params) {
  return request({
    url: '/ec/role/update-status',
    method: 'put',
    params
  })
}

export function save (params) {
  return request({
    url: '/ec/role/save',
    method: 'post',
    data: params
  })
}

export function delRole (params) {
  return request({
    url: '/ec/role/delete',
    method: 'put',
    params
  })
}

export function getOptions (params) {
  return request({
    url: '/ec/role/get-options',
    method: 'get',
    params
  })
}
