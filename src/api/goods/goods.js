import request from '@/utils/request'
const baseUrl = process.env.VUE_APP_BASE_API_2
const baseUrl1 = process.env.VUE_APP_BASE_API

export function getChamberAllList(params) {
  return request({
    url: baseUrl1 + '/ec/chamber/all-list',
    method: 'get',
    params
  })
}

export function getBookingList(params) {
  return request({
    url: baseUrl + '/ec/mall/goods-booking-list',
    method: 'get',
    params
  })
}

export function getList(params) {
  return request({
    url: baseUrl + '/ec/mall/chamber-goods-list',
    method: 'get',
    params
  })
}

export function getTopList(params) {
  return request({
    url: baseUrl + '/ec/mall/top-goods-list',
    method: 'get',
    params
  })
}

export function updateGoodsStatus(params) {
  return request({
    url: baseUrl + '/ec/mall/change-good-status',
    method: 'put',
    data: params
  })
}

export function batchUpdateGoodsStatus(params) {
  return request({
    url: baseUrl + '/ec/mall/batch-charge-good-status',
    method: 'put',
    data: params
  })
}

export function adminUdateGoodsStatus(params) {
  return request({
    url: baseUrl + '/ec/mall/admin-change-good-status',
    method: 'put',
    data: params
  })
}

export function batchAdminUpdateGoodsStatus(params) {
  return request({
    url: baseUrl + '/ec/mall/admin-batch-charge-good-status',
    method: 'put',
    data: params
  })
}

export function del(params) {
  return request({
    url: baseUrl + '/ec/mall/delete-good',
    method: 'put',
    data: params
  })
}

export function batchDel(params) {
  return request({
    url: baseUrl + '/ec/mall/batch-delete-good',
    method: 'put',
    data: params
  })
}

export function countTop() {
  return request({
    url: baseUrl + '/ec/mall/top-count',
    method: 'get'
  })
}

export function setTop(params) {
  return request({
    url: baseUrl + '/ec/mall/top-good',
    method: 'put',
    data: params
  })
}

export function cancelSetTop(params) {
  return request({
    url: baseUrl + '/ec/mall/cancel-top-good',
    method: 'put',
    data: params
  })
}

export function updateSetTop(params) {
  return request({
    url: baseUrl + '/ec/mall/update-top-good',
    method: 'put',
    data: params
  })
}
