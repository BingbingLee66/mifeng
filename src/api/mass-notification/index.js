import request from '@/utils/request'

// 模板库列表
export const noticeTemplateList = params =>
  request({
    url: '/ec/notice-template/noticeTemplateList',
    method: 'get',
    params
  })

// 单个查询模板库信息
export const getNoticeTemplateDetail = params =>
  request({
    url: '/ec/notice-template/getNoticeTemplateDetail',
    method: 'get',
    params
  })

// 模板库详情
export const getNoticeTemplateDetailById = params =>
  request({
    url: '/ec/notice-template/getNoticeTemplateDetailById',
    method: 'get',
    params
  })

// 模板名称列表
export const noticeTemplateNameList = params =>
  request({
    url: '/ec/notice-template/noticeTemplateNameList',
    method: 'get',
    params
  })

// 同步模板库、申请模板库
export function synchronizeAndApplyTemplate(data) {
  return request({
    url: '/ec/notice-template/synchronizeAndApplyTemplate',
    method: 'post',
    data
  })
}

// 模板设置列表
export const noticeTemplateSetList = params =>
  request({
    url: '/ec/notice-template-set/noticeTemplateSetList',
    method: 'get',
    params
  })

// 模板设置详情
export const getNoticeTemplateSetDetailById = params =>
  request({
    url: '/ec/notice-template-set/getNoticeTemplateSetDetailById',
    method: 'get',
    params
  })

// 新增-编辑模板设置
export function noticeTemplateSetAdd(data) {
  return request({
    url: '/ec/notice-template-set/add',
    method: 'post',
    data
  })
}

// 模板设置删除-禁用-启用 (0禁用 1启用 2删除)
export const noticeTemplateSetUpdateStatus = params =>
  request({
    url: '/ec/notice-template-set/updateStatus',
    method: 'put',
    params
  })

// 变量值列表
export const getKeyValueList = params =>
  request({
    url: '/ec/notice-template-set/getKeyValueList',
    method: 'get',
    params
  })

// 查询所有会员列表
export const getMemberList = data => request({ url: '/ec/member/all-member-page-list', method: 'post', data })

// 查询指定商会会员列表
export const getChamberMemberList = data => request({ url: '/ec/member/chamber-member-page-list', method: 'post', data })
//查询商会和会员数
export const getMemberCountList = params => request({ url: '/ec/chamber/chamber-member-count-list', method: 'get', params })

// 根据渠道查询商会后台模板
export const selectTemplateList = params => request({ url: '/ec/template-distribution/template-distribution-select-list', method: 'get', params })
// 根据渠道查询总后台模板
export const selectTemplateListAdmin = params => request({ url: '/ec/notice-template-set/notice-template-set-select-list', method: 'get', params })

// 查询指定商会会员列表
export const memberPageList = data => request({ url: '/ec/member/chamber-member-page-list', method: 'post', data })
// 查询某个商会下面的职位
export const memberPostList = params => request({ url: '/ec/memberPost/member-post-select-list', method: 'get', params })

//商会后台 查询本商会会员

