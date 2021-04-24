import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/ec/chamber/list',
    method: 'get',
    params
  })
}

export function getDetail(params) {
  return request({
    url: '/ec/chamber/detail',
    method: 'get',
    params
  })
}

export function save(params) {
  return request({
    url: '/ec/chamber/save',
    method: 'post',
    data: params
  })
}

export function updateStatus(params) {
  return request({
    url: '/ec/chamber/update-status',
    method: 'put',
    params
  })
}

export function upload(params) {
  return request({
    url: '/ec/upload/license',
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data: params
  })
}

export function getJoinList(params) {
  return request({
    url: '/ec/chamber/join-list',
    method: 'get',
    params
  })
}

export function updateAudit(params) {
  return request({
    url: '/ec/chamber/audit-status',
    method: 'put',
    params
  })
}
