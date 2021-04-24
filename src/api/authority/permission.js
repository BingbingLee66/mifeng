import request from '@/utils/request'

export function getRoleActions (params) {
  return request({
    url: '/ec/actionGroup/list',
    method: 'get',
    params
  })
}
