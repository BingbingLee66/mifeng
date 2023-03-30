import request from '@/utils/request'

// 模板库列表
export const noticeTemplateList = params =>
  request({
    url: '/ecservice/ec/notice-template/noticeTemplateList',
    method: 'get',
    params
  })

// 单个查询模板库信息
export const getNoticeTemplateDetail = params =>
  request({
    url: '/ecservice/ec/notice-template/getNoticeTemplateDetail',
    method: 'get',
    params
  })

// 模板库详情
export const getNoticeTemplateDetailById = params =>
  request({
    url: '/ecservice/ec/notice-template/getNoticeTemplateDetailById',
    method: 'get',
    params
  })

// 模板名称列表
export const noticeTemplateNameList = params =>
  request({
    url: '/ecservice/ec/notice-template/noticeTemplateNameList',
    method: 'get',
    params
  })

// 同步模板库、申请模板库
export function synchronizeAndApplyTemplate(data) {
  return request({
    url: '/ecservice/ec/notice-template/synchronizeAndApplyTemplate',
    method: 'post',
    data
  })
}

// 模板设置列表
export const noticeTemplateSetList = params =>
  request({
    url: '/ecservice/ec/notice-template-set/noticeTemplateSetList',
    method: 'get',
    params
  })

// 模板设置详情
export const getNoticeTemplateSetDetailById = params =>
  request({
    url: '/ecservice/ec/notice-template-set/getNoticeTemplateSetDetailById',
    method: 'get',
    params
  })

// 新增-编辑模板设置
export function noticeTemplateSetAdd(data) {
  return request({
    url: '/ecservice/ec/notice-template-set/add',
    method: 'post',
    data
  })
}

// 模板设置删除-禁用-启用 (0禁用 1启用 2删除)
export const noticeTemplateSetUpdateStatus = params =>
  request({
    url: '/ecservice/ec/notice-template-set/updateStatus',
    method: 'put',
    params
  })

// 变量值列表
export const getKeyValueList = params =>
  request({
    url: '/ecservice/ec/notice-template-set/getKeyValueList',
    method: 'get',
    params
  })

// 管理模板-商会列表
export const distributionChambers = params =>
  request({
    url: '/ecservice/ec/template-distribution/chambers',
    method: 'get',
    params
  })

// 单个-批量模板分配
export const batchTemplateDistribution = data =>
  request({
    url: '/ecservice/ec/template-distribution/batch-template-distribution',
    method: 'post',
    data
  })

// 单个-批量分配数量
export const batchDistributionNum = data =>
  request({
    url: '/ecservice/ec/template-distribution/batch-distribution-num',
    method: 'post',
    data
  })

// 管理模板-管理模板列表
export const distributionTemplates = params =>
  request({
    url: '/ecservice/ec/template-distribution/templates',
    method: 'get',
    params
  })

// 更新模板分配明细状态
export const distributionUpdateStatus = params =>
  request({
    url: '/ecservice/ec/template-distribution/updateStatus',
    method: 'put',
    params
  })

// 管理模板-分配记录列表
export const distributionList = params =>
  request({
    url: '/ecservice/ec/template-distribution/distribution-list',
    method: 'get',
    params
  })

// 管理模板-模板分配短信统计
export const templateDistributionSmsStat = params =>
  request({
    url: '/ecservice/ec/template-distribution/template-distribution-sms-stat',
    method: 'get',
    params
  })

// 查询所有会员列表
export const getMemberList = data =>
  request({ url: '/ecservice/ec/member/all-member-page-list', hiddenSuccess: true, method: 'post', data })

// 查询指定商会会员列表
export const getChamberMemberList = data =>
  request({ url: '/ecservice/ec/member/chamber-member-page-list', hiddenSuccess: true, method: 'post', data })
// 查询商会和会员数
export const getMemberCountList = params =>
  request({ url: '/ecservice/ec/chamber/chamber-member-count-list', method: 'get', params })

// 根据渠道查询商会后台模板
export const selectTemplateList = params =>
  request({ url: '/ecservice/ec/template-distribution/template-distribution-select-list', method: 'get', params })
// 根据渠道查询总后台模板
export const selectTemplateListAdmin = params =>
  request({ url: '/ecservice/ec/notice-template-set/notice-template-set-select-list', method: 'get', params })

// 查询指定商会会员列表
export const memberPageList = data =>
  request({ url: '/ecservice/ec/member/chamber-member-page-list', method: 'post', data })
// 查询某个商会下面的职位
export const memberPostList = params =>
  request({ url: '/ecservice/ec/memberPost/member-post-select-list', method: 'get', params })

// 创建群发通知
export const sendMsg = data => request({ url: '/ecservice/ec/group-send/add', method: 'post', data })
// 群发列表
export const sendList = params => request({ url: '/ecservice/ec/group-send/page-list', method: 'get', params })

// 模板管理列表
export const templateList = params =>
  request({ url: '/ecservice/ec/template-distribution/template-distribution-list', method: 'get', params })

// 接收人
export const receiverInfoList = params =>
  request({ url: '/ecservice/ec/group-send/receiver-info', method: 'get', params })
// 未读重发(一个渠道都没读)
export const unreadRetry = data => request({ url: '/ecservice/ec/group-send/unread-list-retry', method: 'put', data })

// 未读重发列表(一个渠道都没读)
export const unreadList = params => request({ url: '/ecservice/ec/group-send/unread-list', method: 'get', params })
// 删除群发通知
export const deleteSendItem = id =>
  request({ url: `/ecservice/ec/group-send/del/${id}`, method: 'delete', hiddenSuccess: true })
// 查询详情群发通知
export const sendDetail = id => request({ url: `/ecservice/ec/group-send/details/${id}`, method: 'get' })
// 查询发送情况
export const sendDetailList = params =>
  request({ url: '/ecservice/ec/group-send/group-send-detail-page-list', method: 'get', params })
// 获取通知接收情况
export const sendGetDetail = id =>
  request({ url: `/ecservice/ec/group-send/get-send-stat-detail?id=${id}`, method: 'get' })
// 导出发送记录
export const exportSendItem = gsId =>
  request({
    url: `/ecservice/group-send-detail/export/${gsId}`,
    method: 'post',
    responseType: 'blob',
    hiddenError: true,
    hiddenSuccess: true
  })
// 编辑群发通知

export const updateSendGetDetail = data => request({ url: '/ecservice/ec/group-send/edit', method: 'put', data })

// 用户接口查询
export const GetuserAll = data =>
  request({ url: '/ecservice/ec/member/user-all', hiddenSuccess: true, method: 'post', data })
// 秘书处后台用户根据ckey查询admin_user ID和总数接口
export const secretaryAdmin = data => request({ url: '/ecservice/ec/member/secretary-admin', method: 'post', data })
// 秘书处前台用户根据条件查询手机号和总数接口
export const secretaryuser = data => request({ url: '/ecservice/ec/member/secretary-user', method: 'post', data })

// 站内信通知最新一条未读站内信查询接口(30秒查一次的接口)
export const newNoRead = params =>
  request({ url: '/ecservice/ec/station-mail/no-read-station-mail', method: 'get', params })
// 站内信列表查询接口
export const stationPageList = params =>
  request({ url: '/ecservice/ec/group-send/station-page-list', method: 'get', params })
// 站内信详情查询接口
export const stationMailDetail = params => request({ url: '/ecservice/ec/station-mail/detail', method: 'get', params })
// 站内信已读接口
export const readStationMail = ({ id }) =>
  request({ url: `/ecservice/ec/station-mail/read-station-mail?id=${id}`, method: 'put' })
// 铃铛接口
export const stationMailDing = params => request({ url: '/ecservice/ec/station-mail/ding', method: 'get', params })

export const uploadFile = (params, data) => {
  return request({
    url: '/ecservice/ec/upload/file2name',
    method: 'post',
    params,
    data
  })
}

// 新增5g模板
export const add5GTemplate = data => {
  return request({
    url: '/ecservice/ec/notice-template-set/add-5G-sms-template',
    method: 'post',
    data
  })
}

// 5G模板列表
export const get5GTemplateList = params => {
  return request({
    url: '/ecservice/ec/notice-template/sms-5G-list',
    params
  })
}

// 生成h5跳转短链
export const generateH5SkipUrl = data => {
  return request({
    url: '/ecservice/ec/h5SkipConfig/h5Url',
    data,
    method: 'post'
  })
}

// 删除模板
export const deleteTemplate = id => {
  return request({
    url: `/ecservice/ec/notice-template/del/${id}`,
    method: 'delete'
  })
}

// 获取5G模板详情
export const get5GTemplateDetail = id => {
  return request({
    url: `/ecservice/ec/notice-template-set/sms-5G-details/${id}`
  })
}
