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
