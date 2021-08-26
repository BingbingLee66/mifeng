import request from '@/utils/request'
const baseUrl = process.env.VUE_APP_BASE_API_2

export function getSkuOptions(params) {
  return request({
    url: baseUrl + '/ec/goodsSku/get-options',
    method: 'get',
    params
  })
}

export function getGoodsDetail(params) {
  return request({
    url: baseUrl + '/ec/mall/get-goods',
    method: 'get',
    params
  })
}

export function uploadGoodsImg(params) {
  return request({
    url: baseUrl + '/mall/upload/goods-img',
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data: params
  })
}

export function add(params) {
  return request({
    url: baseUrl + '/ec/mall/add-good',
    method: 'post',
    data: params
  })
}

export function update(params) {
  return request({
    url: baseUrl + '/ec/mall/update-good',
    method: 'post',
    data: params
  })
}
