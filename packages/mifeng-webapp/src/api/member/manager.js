import request from '@/utils/request'

export function getUserList(params) {
  return request({
    url: '/ecservice/ec/member/all-user',
    method: 'post',
    data: params
  })
}

export function memberMe(params) {
  return request({
    url: '/ecservice/ec/member/me',
    method: 'get',
    params
  })
}

export function memberAuditMe(params) {
  return request({
    url: '/ecservice/ec/member/audit-me',
    method: 'get',
    params
  })
}

export function getUserDetail(params) {
  return request({
    url: '/ecservice/ec/member/user-detail',
    method: 'get',
    params
  })
}

export function add(params) {
  return request({
    url: '/ecservice/ec/member/add',
    method: 'post',
    data: params
  })
}

export function update(params) {
  return request({
    url: '/ecservice/ec/member/update',
    method: 'post',
    data: params
  })
}

export function updateUserStatus(params) {
  return request({
    url: '/ecservice/ec/member/update-user-status',
    method: 'put',
    params
  })
}

export function uploadPortrait(params) {
  return request({
    url: '/ecservice/ec/upload/portrait',
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data: params
  })
}

export function uploadIdCard(params) {
  return request({
    url: '/ecservice/ec/upload/id-card',
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data: params
  })
}

export function uploadCompanyLogo(params) {
  return request({
    url: '/ecservice/ec/upload/company-logo',
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data: params
  })
}

export function uploadLicense(params) {
  return request({
    url: '/ecservice/ec/upload/license',
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data: params
  })
}

export function getMemberList(params) {
  return request({
    url: '/ecservice/ec/member/list',
    method: 'post',
    hiddenSuccess: true,
    data: params
  })
}

export function updateStatus(params) {
  return request({
    url: '/ecservice/ec/member/update-status',
    method: 'put',
    params
  })
}

export function getMemberDetail(params) {
  return request({
    url: '/ecservice/ec/member/member-detail',
    method: 'get',
    hiddenError: true,
    params
  })
}

export function getMemberAuditDetail(params) {
  return request({
    url: '/ecservice/ec/member/member-audit-detail',
    method: 'get',
    params
  })
}

export function auditList(params) {
  return request({
    url: '/ecservice/ec/member/audit-list',
    method: 'get',
    params
  })
}

export function reauditList(params) {
  return request({
    url: '/ecservice/ec/member/reaudit-list',
    method: 'get',
    params
  })
}

export function updateAudit(params) {
  return request({
    url: '/ecservice/ec/member/audit-status',
    method: 'put',
    data: params
  })
}

export function updateReaudit(params) {
  return request({
    url: '/ecservice/ec/member/reaudit-status',
    method: 'put',
    data: params
  })
}

export function transferPresident(params) {
  return request({
    url: '/ecservice/ec/member/transfer-president',
    method: 'post',
    data: params
  })
}

// 入会审核详情
export function examineDetail(params) {
  return request({
    url: '/ecservice/ec/member/getMemberAuditInfo',
    method: 'get',
    params
  })
}

export function getPositionOptions() {
  return request({
    url: '/ecservice/ec/companyPosition/get-options',
    method: 'get'
  })
}

// 批量认证会员
export const authorizeMemberAuthBatch = data =>
  request({ url: '/ecservice/ec/memberAuth/batchAuthenticate', method: 'post', data })

// 会员认证
export const authorizeMemberAuth = params =>
  request({ url: '/ecservice/ec/memberAuth/authenticate', method: 'post', params })

// 取消会员认证
export const cancelAuthorizeMemberAuth = params =>
  request({ url: '/ecservice/ec/memberAuth/unauthenticate', method: 'post', params })
