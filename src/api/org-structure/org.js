import request from '@/utils/request'

export function getUserList(params) {
  return request({
    url: '/ec/member/all-user',
    method: 'get',
    params
  })
}

