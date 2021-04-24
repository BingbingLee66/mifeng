import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/ec/contentColumn/list',
    method: 'get',
    params
  })
}

export function getInfoColumnList() {
  return request({
    url: '/ec/contentColumn/info-column-list',
    method: 'get'
  })
}

export function save(params) {
  return request({
    url: '/ec/contentColumn/save',
    method: 'post',
    data: params
  })
}

export function updateStatus(params) {
  return request({
    url: '/ec/contentColumn/update-status',
    method: 'put',
    params
  })
}

export function del(params) {
  return request({
    url: '/ec/contentColumn/delete',
    method: 'put',
    params
  })
}

export function getContentColumnOptionsWithCkey(params) {
  return request({
    url: '/ec/contentColumn/get-options-with-ckey',
    method: 'get',
    params
  })
}

export function getContentColumnOptions() {
  return request({
    url: '/ec/contentColumn/get-options',
    method: 'get'
  })
}

export function getAllContentColumnOptions() {
  return request({
    url: '/ec/contentColumn/get-all-options',
    method: 'get'
  })
}
