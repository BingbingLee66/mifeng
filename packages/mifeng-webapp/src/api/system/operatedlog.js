import request from '@/utils/request'

export function getOperatedType() {
  return request({
    url: '/ecservice/ec/operatedlog/operate-type',
    method: 'get'
  })
}

export function getLogList(params) {
  return request({
    url: '/ecservice/ec/operatedlog/list',
    method: 'get',
    params
  })
}
