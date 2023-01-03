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
// 问卷题目保存
export const saveQuest = params => {
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
// 总后台问卷二维码
export const getQrCode = params => {
  return request({
    url: `/scrmapi/questionnaire/qrCode?questionnaireId=${params}`,
    method: 'get',
  })
}
// 秘锋二维码
export const getQrCodeByMiF = params => {
  return request({
    url: `/crmapi/questionnaire/qrCode?questionnaireId=${params}`,
    method: 'get',
  })
}
