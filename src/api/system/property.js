import request from '@/utils/request'

export function getList (params) {
  return request({
    url: '/ec/systemProperty/logo-me',
    method: 'get',
    params
  })
}

export function getInfo (params) {
  return request({
    url: '/ec/systemProperty/me',
    method: 'get',
    params
  })
}

export function upload (params) {
  return request({
    url: '/ec/upload/system-logo',
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data: params
  })
}

export function updateLogo (params) {
  return request({
    url: '/ec/systemProperty/update-logo',
    method: 'put',
    params
  })
}

export function updateJoinInfo (params) {
  return request({
    url: '/ec/systemProperty/update-join-info',
    method: 'put',
    params
  })
}

export function createQrcode (params) {
  return request({
    url: '/ec/systemProperty/create-qrcode',
    method: 'post',
    params
  })
}
