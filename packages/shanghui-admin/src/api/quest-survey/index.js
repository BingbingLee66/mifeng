import request from '@business/common/src/utils/request'

// 基础题型:列表查询
export const getBaseQuestion = params => {
  return request({
    url: '/ecservice/api/ec/form/getBaseQuestion',
    method: 'get',
    params
  })
}
// 常用题型:列表查询
export const getCommonList = params => {
  return request({
    url: '/ecservice/api/ec/form/getCommonList',
    method: 'get',
    params
  })
}
// 总后台:问卷题目保存
export const saveQuest = params => {
  return request({
    url: '/ecservice/scrmapi/questionnaire/save',
    method: 'post',
    data: params
  })
}

// 上传并检测图片文件到对应目录
export const uploadAndCheckImg = (params, query) => {
  return request({
    url: `/ecservice/ec/upload/uploadAndCheckImg?folder=${query}`,
    method: 'post',
    data: params
  })
}

// 总后台：问卷发布-停止
export const updateState = params => {
  return request({
    url: '/ecservice/scrmapi/questionnaire/updateState',
    method: 'put',
    params
  })
}
// 总后台二维码
export const getQrCode = params => {
  return request({
    url: '/ecservice/scrmapi/questionnaire/qrCode',
    params
  })
}

// 总后台:问卷详情回显
export const questionDetail = params => {
  return request({
    url: '/ecservice/scrmapi/questionnaire/detail',
    method: 'get',
    params
  })
}

// 问卷冻结
export const freezeQuestionnaire = params => {
  return request({
    url: '/ecservice/scrmapi/questionnaire/freeze',
    method: 'put',
    params
  })
}
// 问卷解冻
export const unFreezeQuestionnaire = params => {
  return request({
    url: '/ecservice/scrmapi/questionnaire/unFreeze',
    method: 'put',
    params
  })
}
