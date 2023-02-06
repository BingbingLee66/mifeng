import request from '@/utils/request'

export const getList = params => {
  return request({
    url: '/ecservice/ec/role/list',
    method: 'get',
    params
  })
}

export const updateStatus = params => {
  return request({
    url: '/ecservice/ec/role/update-status',
    method: 'put',
    params,
    hiddenSuccess: true
  })
}

export const save = data => {
  return request({
    url: '/ecservice/ec/role/save',
    method: 'post',
    data
  })
}

export const delRole = params => {
  return request({
    url: '/ecservice/ec/role/delete',
    method: 'put',
    params
  })
}

export const getOptions = params => {
  return request({
    url: '/ecservice/ec/role/get-options',
    method: 'get',
    params
  })
}
