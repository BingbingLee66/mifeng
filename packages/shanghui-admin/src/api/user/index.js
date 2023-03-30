import request from '@/utils/request'

// 登录
export const login = params => {
  return request({
    url: '/ecservice/user/login',
    params,
    method: 'post'
  })
}
