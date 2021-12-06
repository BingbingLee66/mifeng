import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/ec/articleSource/list',
    method: 'get',
    params
  })
}

export function save(params) {
  return request({
    url: '/ec/articleSource/save',
    method: 'post',
    data: params
  })
}

export function updateStatus(params) {
  return request({
    url: '/ec/articleSource/update-status',
    method: 'put',
    params
  })
}

export function del(params) {
  return request({
    url: '/ec/articleSource/delete',
    method: 'put',
    params
  })
}

export function getOptions() {
  return request({
    url: '/ec/articleSource/get-options',
    method: 'get'
  })
}
