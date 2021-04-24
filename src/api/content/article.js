import request from '@/utils/request'

export function getChamberContentList(params) {
  return request({
    url: '/ec/article/chamber-content-list',
    method: 'get',
    params
  })
}

export function getAboutChamberList(params) {
  return request({
    url: '/ec/article/about-chamber-list',
    method: 'get',
    params
  })
}

export function getContactUs(params) {
  return request({
    url: '/ec/article/contact-us',
    method: 'get',
    params
  })
}

export function getGlobalContentList(params) {
  return request({
    url: '/ec/article/global-content-list',
    method: 'get',
    params
  })
}

export function getManagerList(params) {
  return request({
    url: '/ec/article/manager-content-list',
    method: 'get',
    params
  })
}

export function getAuditList(params) {
  return request({
    url: '/ec/article/audit-list',
    method: 'get',
    params
  })
}

export function save(params) {
  return request({
    url: '/ec/article/save',
    method: 'post',
    data: params
  })
}

export function updateStatus(params) {
  return request({
    url: '/ec/article/update-status',
    method: 'put',
    params
  })
}

export function updateStatusPlatform(params) {
  return request({
    url: '/ec/article/update-status-platform',
    method: 'put',
    data: params
  })
}

export function del(params) {
  return request({
    url: '/ec/article/delete',
    method: 'put',
    data: params
  })
}

export function getDetail(params) {
  return request({
    url: '/ec/article/detail',
    method: 'get',
    params
  })
}

export function getUpdateDetail(params) {
  return request({
    url: '/ec/article/update-detail',
    method: 'get',
    params
  })
}

export function uploadRichhtmlImg(params) {
  return request({
    url: '/ec/upload/richhtml-img',
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data: params
  })
}

export function updateAudit (params) {
  return request({
    url: '/ec/article/audit-status',
    method: 'put',
    data: params
  })
}

export function getTopList () {
  return request({
    url: '/ec/article/top-list',
    method: 'get'
  })
}

export function countTop () {
  return request({
    url: '/ec/article/count-top',
    method: 'get'
  })
}

export function setTop (params) {
  return request({
    url: '/ec/article/set-top',
    method: 'put',
    params
  })
}

export function cancelTop (params) {
  return request({
    url: '/ec/article/cancel-top',
    method: 'put',
    params
  })
}

export function uploadCoverImg(params) {
  return request({
    url: '/ec/upload/article-cover-img',
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data: params
  })
}
