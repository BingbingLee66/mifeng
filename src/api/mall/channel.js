import request from '@/utils/request'
const baseUrl = process.env.VUE_APP_BASE_API_2

export function getList(params) {
  return request({
    url: baseUrl + '/ec/mall/channel/thChannel-list',
    method: 'get',
    params
  })
}

export function delChannel(params) {
  return request({
    url: baseUrl + '/ec/mall/channel/channel-delete',
    method: 'delete',
    params
  })
}


export function save (params) {
  return request({
    url: baseUrl + '/ec/mall/channel/channel-save',
    method: 'post',
    data: params
  })
}
