import request from '@business/common/src/utils/request'
// 总后台:答卷总览列表
export const getAnswersList = params => {
  return request({
    url: '/ecservice/scrmapi/answers/list',
    method: 'get',
    params
  })
}

// 总后台:填空-多级联动查看详情
export const answersOtherDetail = params => {
  return request({
    url: '/ecservice/scrmapi/answers/detail',
    method: 'get',
    params
  })
}

// 总后台:选项附件下载
export const download = params => {
  return request({
    url: `/ecservice/scrmapi/answers/download?problemId=${params}`,
    method: 'post',
    responseType: 'blob'
  })
}
// 总后台:用户答卷列表
export const userAnswerList = params => {
  return request({
    url: '/ecservice/scrmapi/answers/user/list',
    method: 'get',
    params
  })
}

// 总后台:查看个人答卷详情
export const answersUserDetail = params => {
  return request({
    url: '/ecservice/scrmapi/answers/user/detail',
    method: 'get',
    params
  })
}

// 总后台:查看其他选项
export const getOtherAnswers = params => {
  return request({
    url: '/ecservice/scrmapi/answers/other',
    params
  })
}

// 总后台：答卷导出
export const excelExporAnswer = params => {
  return request({
    url: '/ecservice/scrmapi/answers/excelExporAnswer',
    method: 'get',
    responseType: 'blob',
    params,
    hiddenError: true
  })
}
