import request from '@/utils/request'

// 获取加入商会并且未冻结的用户
export const getJoinChamberAndNoFreezesUsers = params =>
  request({
    url: '/ecservice/ec/wx-user/joinChamberAndNoFreezes',
    method: 'get',
    params
  })

// 总后台入会审核列表
export const getAllAuditList = params =>
  request({
    url: '/ecservice/ec/member/all-audit-list',
    method: 'get',
    params
  })

// 总后台入会审核驳回操作
export const rejectAuditStatus = data =>
  request({
    url: '/ecservice/ec/member/audit-status',
    method: 'put',
    data
  })

// 总后台身份审核列表
export const getidentityList = params =>
  request({
    url: '/ecservice/ec/useridentity/list',
    method: 'get',
    params
  })
// 认证信息详情
export const getApproveDetail = params =>
  request({
    url: '/ecservice/ec/useridentity/approvedetail',
    method: 'get',
    params
  })
// 申请详情
export const getAuditDetail = params =>
  request({
    url: '/ecservice/ec/useridentity/auditdetail',
    method: 'get',
    params
  })

// 身份审批
export const approveIdentity = data =>
  request({
    url: '/ecservice/ec/useridentity/approve',
    method: 'post',
    data
  })