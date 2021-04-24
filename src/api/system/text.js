import request from '@/utils/request'

export function getList () {
  return request({
    url: '/ec/agreement/list',
    method: 'get'
  })
}

export function getDetail (params) {
  return request({
    url: '/ec/agreement/detail',
    method: 'get',
    params
  })
}

export function updateStatus (params) {
  return request({
    url: '/ec/agreement/update-status',
    method: 'put',
    params
  })
}

export function save (params) {
  return request({
    url: '/ec/agreement/save',
    method: 'post',
    data: params
  })
}
