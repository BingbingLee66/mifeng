import request from '@/utils/request'

export function getOperatedType() {
  return request({
    url: '/ec/operatedlog/operate-type',
    method: 'get'
  })
}

export function getLogList(params) {
  return request({
    url: '/ec/operatedlog/list',
    method: 'get',
    params
  })
}
