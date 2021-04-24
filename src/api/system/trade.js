import request from '@/utils/request'

export function getTradeList(params) {
  return request({
    url: '/ec/trade/list',
    method: 'get',
    params
  })
}

export function addTrade(params) {
  return request({
    url: '/ec/trade/save',
    method: 'post',
    data: params
  })
}

export function updateTrade(params) {
  return request({
    url: '/ec/trade/save',
    method: 'post',
    data: params
  })
}

export function delTrade(params) {
  return request({
    url: '/ec/trade/delete',
    method: 'put',
    params
  })
}

export function getTradeOptions(params) {
  return request({
    url: '/ec/trade/get-options',
    method: 'get',
    params
  })
}
