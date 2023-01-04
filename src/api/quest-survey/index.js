import request from '@/utils/request'

// 基础题型:列表查询
export const getBaseQuestion = params => {
  return request({
    url: '/api/ec/form/getBaseQuestion',
    method: 'get',
    params
  })
}
// 常用题型:列表查询
export const getCommonList = params => {
  return request({
    url: '/api/ec/form/getCommonList',
    method: 'get',
    params
  })
}
// 总后台:问卷题目保存
export const saveQuest = params => {
  return request({
    url: '/scrmapi/questionnaire/save',
    method: 'post',
    data: params
  })
}
// 秘锋:问卷题目保存
export const saveQuestByMiF = params => {
  return request({
    url: '/crmapi/questionnaire/save',
    method: 'post',
    data: params
  })
}

// 上传并检测图片文件到对应目录
export const uploadAndCheckImg = (params, query) => {
  return request({
    url: `/ec/upload/uploadAndCheckImg?folder=${query}`,
    method: 'post',
    data: params
  })
}
// 问卷发布-停止
export const updateState = params => {
  return request({
    url: '/crmapi/questionnaire/updateState',
    method: 'put',
    params
  })
}
// 总后台二维码
export const getQrCode = params => {
  return request({
    url: `/scrmapi/questionnaire/qrCode?questionnaireId=${params}`,
    method: 'get',
  })
}
// 秘锋问卷二维码
export const getQrCodeByMiF = params => {
  return request({
    url: `/crmapi/questionnaire/qrCode?questionnaireId=${params}`,
    method: 'get',
  })
}
// 秘锋:问卷详情回显
export const questionDetailBiMiF = params => {
  return request({
    url: '/crmapi/questionnaire/detail',
    method: 'get',
    params
  })
}
// 总后台:问卷详情回显
export const questionDetail = params => {
  return request({
    url: '/scrmapi/questionnaire/detail',
    method: 'get',
    params
  })
}

// 查询问卷列表
export const getQuestionnaireList = params => {
  return request({
    url: '/scrmapi/questionnaire/list',
    params
  })
}
// 校验问卷标题
export const checkQuestionnaireTitle = data => {
  return request({
    url: '/scrmapi/questionnaire/checkTitle',
    data,
    method: 'post'
  })
}
// 问卷发布停止
export const updateQuestionnaireState = params => {
  return request({
    url: '/scrmapi/questionnaire/updateState',
    method: 'put',
    params
  })
}
// 问卷删除
export const deleteQuestionnaire = params => {
  return request({
    url: '/scrmapi/questionnaire/delete',
    method: 'delete',
    params
  })
}

// 问卷冻结
export const freezeQuestionnaire = params => {
  return request({
    url: '/scrmapi/questionnaire/freeze',
    method: 'put',
    params
  })
}

