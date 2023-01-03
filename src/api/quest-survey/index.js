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
    url: '/scrmapi/questionnaire/save',
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

