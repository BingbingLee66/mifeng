import request from '@/utils/request'

export function getUserList(params) {
  return request({
    url: '/ec/member/all-user',
    method: 'get',
    params
  })
}

export function memberMe(params) {
  return request({
    url: '/ec/member/me',
    method: 'get',
    params
  })
}

export function memberAuditMe(params) {
  return request({
    url: '/ec/member/audit-me',
    method: 'get',
    params
  })
}

export function getUserDetail(params) {
  return request({
    url: '/ec/member/user-detail',
    method: 'get',
    params
  })
}

export function add(params) {
  return request({
    url: '/ec/member/add',
    method: 'post',
    data: params
  })
}

export function update(params) {
  return request({
    url: '/ec/member/update',
    method: 'post',
    data: params
  })
}

export function updateUserStatus(params) {
  return request({
    url: '/ec/member/update-user-status',
    method: 'put',
    params
  })
}

export function uploadPortrait(params) {
  return request({
    url: '/ec/upload/portrait',
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data: params
  })
}

export function uploadIdCard(params) {
  return request({
    url: '/ec/upload/id-card',
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data: params
  })
}

export function uploadCompanyLogo(params) {
  return request({
    url: '/ec/upload/company-logo',
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data: params
  })
}

export function uploadLicense(params) {
  return request({
    url: '/ec/upload/license',
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data: params
  })
}

export function list(params) {
  return request({
    url: '/ec/member/list',
    method: 'get',
    params
  })
}

export function updateStatus(params) {
  return request({
    url: '/ec/member/update-status',
    method: 'put',
    params
  })
}

export function getMemberDetail(params) {
  return request({
    url: '/ec/member/member-detail',
    method: 'get',
    params
  })
}

export function getMemberAuditDetail(params) {
  return request({
    url: '/ec/member/member-audit-detail',
    method: 'get',
    params
  })
}

export function auditList(params) {
  return request({
    url: '/ec/member/audit-list',
    method: 'get',
    params
  })
}

export function reauditList(params) {
  return request({
    url: '/ec/member/reaudit-list',
    method: 'get',
    params
  })
}

export function updateAudit(params) {
  return request({
    url: '/ec/member/audit-status',
    method: 'put',
    data: params
  })
}

export function updateReaudit(params) {
  return request({
    url: '/ec/member/reaudit-status',
    method: 'put',
    data: params
  })
}

export function transferPresident(params) {
  return request({
    url: '/ec/member/transfer-president',
    method: 'post',
    data: params
  })
}

// 入会审核详情
export function examineDetail(params) {
  return request({
    url: '/ec/member/getMemberAuditInfo',
    method: 'get',
    params
  })
}

// 批量认证会员
export const authorizeMemberAuthBatch = data => request({ url: '/ec/memberAuth/batchAuthenticate', method: 'post', data })

// 会员认证
export const authorizeMemberAuth = params => request({ url: '/ec/memberAuth/authenticate', method: 'post', params })

// 取消会员认证
export const cancelAuthorizeMemberAuth = params => request({ url: '/ec/memberAuth/unauthenticate', method: 'post', params })
