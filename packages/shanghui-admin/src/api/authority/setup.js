import request from '@/utils/request'

export const getActionList = () => {
  return request({
    url: '/ecservice/ec/action/list',
    method: 'get'
  })
}

export const getRoleActions = params => {
  return request({
    url: '/ecservice/ec/actionGroup/actions',
    method: 'get',
    params
  })
}

export const save = params => {
  return request({
    url: '/ecservice/ec/actionGroup/save',
    method: 'post',
    data: params
  })
}
