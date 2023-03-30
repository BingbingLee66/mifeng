import request from '../utils/request'
// 校验问卷标题
export const checkQuestionnaireTitle = data => {
  return request({
    url: '/ecservice/scrmapi/questionnaire/checkTitle',
    data,
    method: 'post'
  })
}
// 查询问卷列表
export const getQuestionnaireList = params => {
  return request({
    url: '/ecservice/scrmapi/questionnaire/list',
    params
  })
}
// 问卷分享
export const getQuestionnaireShareInfo = params =>
  request({
    url: '/ecservice/scrmapi/questionnaire/qrCode',
    params
  })
// 问卷发布停止
export const updateQuestionnaireState = params => {
  return request({
    url: '/ecservice/scrmapi/questionnaire/updateState',
    method: 'put',
    params
  })
}
// 问卷删除
export const deleteQuestionnaire = params => {
  return request({
    url: '/ecservice/scrmapi/questionnaire/delete',
    method: 'delete',
    params
  })
}
// 问卷发布-停止
export const updateState = params => {
  return request({
    url: '/ecservice/scrmapi/questionnaire/updateState',
    method: 'put',
    params
  })
}
export const chamberStatSave = data =>
  request({
    url: '/ecservice/ec/chamberStats/save',
    method: 'post',
    data
  })
