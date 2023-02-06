import request from '@/utils/request'

// 获取权限角色列表
export const getRoleList = params => {
  return request({
    url: '/ecservice/ec/role/list',
    params
  })
}

// 获取成员列表
export const getAdminUserList = params => {
  return request({
    url: '/ecservice/ec/adminUser/list',
    params
  })
}

// 获取角色列表
export const getRoleOptionList = params => {
  return request({
    url: '/ecservice/ec/role/get-options',
    params
  })
}

// 新增|编辑角色
export const saveRole = data => {
  return request({
    url: '/ecservice/ec/role/save',
    method: 'post',
    data
  })
}

// 删除角色
export const deleteRole = params => {
  return request({
    url: '/ecservice/ec/role/delete',
    method: 'put',
    params
  })
}

// 更新角色状态
export const updateRoleStatus = params => {
  return request({
    url: '/ecservice/ec/role/update-status',
    method: 'put',
    params
  })
}

// 保存成员账号
export const saveAdminUser = data => {
  return request({
    url: '/ecservice/ec/adminUser/save',
    method: 'post',
    data
  })
}

// 删除成员账号
export const deleteAdminUser = params => {
  return request({
    url: '/ecservice/ec/adminUser/delete',
    method: 'put',
    params
  })
}

// 更新成员账号状态
export const updateAdminUserStatus = params => {
  return request({
    url: '/ecservice/ec/adminUser/update-status',
    method: 'put',
    params
  })
}

// 获取权限列表
export const getAuthorityActionList = () => {
  return request({
    url: '/ecservice/ec/action/list'
  })
}

// 获取当前角色的权限列表
export const getRoleActions = params => {
  return request({
    url: '/ecservice/ec/actionGroup/actions',
    params
  })
}

// 保存角色权限
export const saveRoleActions = data => {
  return request({
    url: '/ecservice/ec/actionGroup/save',
    method: 'post',
    data
  })
}

// 获取菜单权限列表
export const getMenuActions = params => {
  return request({
    url: '/ecservice/ec/actionGroup/list',
    params
  })
}
