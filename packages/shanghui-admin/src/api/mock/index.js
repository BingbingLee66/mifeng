import request from '@/utils/request'

export const login = params => {
  return request({
    url: '/user/login',
    params,
    method: 'post'
  })
}

export const getMenuList = () => {
  return request({
    url: '/mock/menu/list'
  })
}

export const logout = data => {
  return request({
    url: '/mock/user/logout',
    data,
    method: 'post'
  })
}

export const getUserInfo = () => {
  return request({
    url: '/mock/user/info'
  })
}
