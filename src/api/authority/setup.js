import request from '@/utils/request'

export function getActionList () {
  return request({
    url: '/ec/action/list',
    method: 'get'
  })
}

export function getRoleActions (params) {
  return request({
    url: '/ec/actionGroup/actions',
    method: 'get',
    params
  })
}

export function save (params) {
  return request({
    url: '/ec/actionGroup/save',
    method: 'post',
    data: params
  })
}
