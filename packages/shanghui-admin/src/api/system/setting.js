import request from '@/utils/request'
const baseUrl = "/ecmall"

export function getSetting(params) {
  return request({
    url: baseUrl + '/ec/mall/get-systemSetting',
    method: 'get',
    params
  })
}

export function updateSetting(params) {
  return request({
    url: baseUrl + '/ec/mall/update-systemSetting',
    method: 'post',
    data: params
  })
}