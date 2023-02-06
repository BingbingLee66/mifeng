import request from '@/utils/request'

// 登录
export const login = params => {
  return request({
    url: '/ecservice/crmapi/user/login',
    params,
    method: 'post'
  })
}

// 获取菜单
export const getMenuList = () => {
  return request({
    url: '/ecservice/ec/menu/listForRouter'
  })
}

// 登出
export const logout = data => {
  return request({
    url: '/ecservice/user/logout',
    data,
    method: 'post'
  })
}

// 获取用户信息
export const getUserInfo = () => {
  return request({
    url: '/ecservice/ec/user/info'
  })
}

/**
 * 查询省市区，树形数据 (无需token)
 * @returns {*}
 */
export const getAreaTree = () => request({ url: '/ecservice/ec/ysh-area-code/no-auth/tree?level=2' })

/**
 * 上传商会Logo (无需token)
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
export const uploadLogo = data => request.post('/ecservice/ec/upload/no-auth/system-logo', data)

/**
 * 注册
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
export const register = data => request.post('/ecservice/ec/user/register', data)
