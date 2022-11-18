import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    params: {
      username: data.username,
      password: data.password
    }
  })
}

export function getInfo() {
  return request({
    url: '/ec/user/info',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
// 官方账号列表
export function officialUserList(params) {
  return request({
    url: '/ec/official-user/officialUserList',
    method: 'get',
    params
  })
}
// 筛选可添加为官方账号的用户账号
export function availableWxUser(params) {
  return request({
    url: '/ec/official-user/availableWxUser',
    method: 'get',
    params
  })
}
// 添加官方账号
export function addOfficial(data) {
  return request({
    url: '/ec/official-user/add',
    method: 'post',
    data
  })
}
// 删除官方账号
export function deleteOfficial(id) {
  return request({
    url: `/ec/official-user/delete/${id}`,
    method: 'delete',
  })
}
// 分页查询发布者信息
let requestFlag = true
let result
export function getPromulgator(params) {
  if (requestFlag) {
    requestFlag = false
    setTimeout(() => {
      requestFlag = true
    }, 100)
    result = request({
      url: '/ec/dynamic-record/getPromulgator',
      method: 'get',
      params
    })
  }
  return result
}

// 查询后台管理员信息
export function getAdminUserList(params) {
  return request({
    url: '/ec/public/getAdminUserList',
    method: 'get',
    params
  })
}

// 社会组织模糊查询
export function getSocialOrg(params) {
  return request({
    url: '/ec/socialOrg/non-stationed/info',
    method: 'get',
    params
  })
}

// 注册
export function register(data) {
  return request({
    url: '/ec/user/register',
    method: 'post',
    data
  })
}

// 查询省市区，树形数据 (无需token)
export function getAreaTree() {
  return request({
    url: '/ec/ysh-area-code/no-auth/tree',
    method: 'get'
  })
}

// 上传商会Logo (无需token)
export function uploadLogo(data) {
  return request({
    url: '/ec/upload/no-auth/system-logo',
    method: 'post',
    data
  })
}
