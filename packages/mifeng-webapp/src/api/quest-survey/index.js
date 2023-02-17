import request from '@/utils/request'

// 查询问卷列表
export const getQuestionnaireList = params =>
  request({
    url: '/ecservice/crmapi/questionnaire/list',
    params
  })

// 问卷发布-停止
export const updateQuestionnaireState = params =>
  request({
    url: '/ecservice/crmapi/questionnaire/updateState',
    params,
    method: 'put'
  })

// 校验问卷标题
export const checkQuestionnaireTitle = data =>
  request({
    url: '/ecservice/crmapi/questionnaire/checkTitle',
    data,
    method: 'post'
  })
// 问卷删除
export const deleteQuestionnaire = params =>
  request({
    url: '/ecservice/crmapi/questionnaire/delete',
    params,
    method: 'delete'
  })

// 问卷分享
export const getQuestionnaireShareInfo = params =>
  request({
    url: '/ecservice/crmapi/questionnaire/qrCode',
    params
  })

/**
 * 答卷总览列表
 * @param { object } params { businessType, questionnaireId}
 * @returns
 */
export const getAnswersListByMiF = params => {
  return request({
    url: '/ecservice/crmapi/answers/list',
    method: 'get',
    params
  })
}

/**
 * 填空-多级联动查看详情
 * @param { object } params { questionId, pageNum, pageSize }
 * @returns
 */
export const answersOtherDetailByMiF = params => {
  return request({
    url: '/ecservice/crmapi/answers/detail',
    method: 'get',
    params
  })
}

/**
 * 选项附件下载
 * @param { object } params
 * @returns
 */
export const downloadByMiF = params => {
  return request({
    url: `/ecservice/crmapi/answers/download?problemId=${params}`,
    method: 'post',
    responseType: 'blob',
    hiddenSuccess: true,
    hiddenError: true
  })
}

/**
 * 用户答卷列表
 * @param { object } params { job, name, pageNum, pageSize, phone, questionnaireId,username }
 * @returns
 */
export const userAnswerListByMiF = params => {
  return request({
    url: '/ecservice/crmapi/answers/user/list',
    method: 'get',
    params
  })
}

/**
 * 查看个人答卷详情
 * @param { object } params { businessType, questionnaireId, userId }
 * @returns
 */
export const answersUserDetailByMiF = params => {
  return request({
    url: '/ecservice/crmapi/answers/user/detail',
    method: 'get',
    params
  })
}

/**
 * 其他选项答题明细
 * @param { object } params { questionId }
 * @returns
 */
export const answersDetailOhter = params => {
  return request({
    url: '/ecservice/crmapi/answers/other',
    method: 'get',
    params
  })
}
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
// 秘锋:问卷题目保存
export const saveQuestByMiF = params => {
  return request({
    url: '/ecservice/crmapi/questionnaire/save',
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
// 问卷发布-停止
export const updateState = params => {
  return request({
    url: '/ecservice/crmapi/questionnaire/updateState',
    method: 'put',
    params
  })
}
// 秘锋问卷二维码
export const getQrCodeByMiF = params => {
  return request({
    url: '/ecservice/crmapi/questionnaire/qrCode',
    params
  })
}
// 秘锋:问卷详情回显
export const questionDetailBiMiF = params => {
  return request({
    url: '/ecservice/crmapi/questionnaire/detail',
    method: 'get',
    params
  })
}

// 秘锋：答卷导出
export const excelExporAnswer = params => {
  return request({
    url: '/ecservice/crmapi/answers/excelExporAnswer',
    method: 'get',
    responseType: 'blob',
    params,
    hiddenSuccess: true,
    hiddenError: true
  })
}
