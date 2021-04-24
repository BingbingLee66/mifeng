import request from '@/utils/request'

export function getList() {
  return request({
    url: '/ec/companyPosition/list',
    method: 'get'
  })
}

export function save(params) {
  return request({
    url: '/ec/companyPosition/save',
    method: 'post',
    data: params
  })
}

export function updateStatus(params) {
  return request({
    url: '/ec/companyPosition/update-status',
    method: 'put',
    params
  })
}

export function del(params) {
  return request({
    url: '/ec/companyPosition/delete',
    method: 'put',
    params
  })
}

export function getPositionOptions() {
  return request({
    url: '/ec/companyPosition/get-options',
    method: 'get'
  })
}
