import request from '@/utils/request'

const baseUrl = process.env.VUE_APP_BASE_API_2

export function getExplodeGoodsList(params) {
  return request({
    url: baseUrl + '/api/ec/mall/explodeGoods/listExplodeGoods',
    method: 'get',
    params
  })
}

export function createSpree(params) {
  return request({
    url: baseUrl + '',
    method: 'post',
    params
  })
}

export function queryDetail(params) {
  return request({
    url: baseUrl + '/ec/mall/get-goods',
    method: 'get',
    params
  })
}

// 生成二维码
export function getSpreeQrCode(params) {
  return request({
    url: baseUrl + '',
    method: 'get',
    params
  })
}

// 生成短链接
export function getSpreeLink(params) {
  return request({
    url: baseUrl + '',
    method: 'get',
    params
  })
}

// 更新发行量
export function updateSpreeIssue(params) {
  return request({
    url: baseUrl + '',
    method: 'get',
    params
  })
}

// 停止发放
export function stopGrantSpree(params) {
  return request({
    url: baseUrl + '',
    method: 'get',
    params
  })
}

// 继续发放
export function continueGrantSpree(params) {
  return request({
    url: baseUrl + '',
    method: 'get',
    params
  })
}
