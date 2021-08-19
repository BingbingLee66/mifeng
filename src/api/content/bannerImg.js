import request from '@/utils/request'

export function editlevel(params) {
  return request({
    url: '/ec/bannerImg/editlevel',
    method: 'put',
    data: params
  })
}

export function save(params) {
  return request({
    url: '/ec/bannerImg/save',
    method: 'post',
    data: params
  })
}

export function del(params) {
  return request({
    url: '/ec/bannerImg/delete',
    method: 'put',
    params
  })
}

export function getList(params) {
  return request({
    url: '/ec/bannerImg/list',
    method: 'get',
    params
  })
}

export function upload(params) {
  return request({
    url: '/ec/upload/banner-img',
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data: params
  })
}

export function checkUpperLimit(params) {
  return request({
    url: '/ec/bannerImg/check-upperlimit',
    method: 'get',
    params
  })
}
