import request from '@/utils/request'

// 选择会员列表
export const getChoosedMemberList = params => request({
  url: '/ec/memberPermissions/chooseMemberList',
  method: 'get',
  params
})

// 权限会员列表
export const getMemberPermissionsList = params => request({
  url: '/ec/memberPermissions/memberPermissionsList',
  method: 'get',
  params
})

// 添加会员到权限列表
export const addMemberPermission = data => request({
  url: '/ec/memberPermissions/add',
  method: 'post',
  data
})

// 权限列表中移除会员
export const deleteMemberPermission = id => request({
  url: `/ec/memberPermissions/delete/${id}`,
  method: 'delete'
})

// 会员配置权限
export const setMemberPermissions = data => request({
  url: '/ec/memberPermissions/configurePermissions',
  method: 'post',
  data
})
