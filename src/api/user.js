import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    params: {
      'username': data.username,
      'password': data.password
    }
  })
}

export function getInfo() {
  return request({
    url: '/ec/user/info',
    method: 'get'
  })
}

export function logout(token) {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
//官方账号列表
export function officialUserList(params) {
  return request({
    url: '/ec/official-user/officialUserList',
    method: 'get',
    params
  })
}
//筛选可添加为官方账号的用户账号
export function availableWxUser(params) {
  return request({
    url: '/ec/official-user/availableWxUser',
    method: 'get',
    params
  })
}