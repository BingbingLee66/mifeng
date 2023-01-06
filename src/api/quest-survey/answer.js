import request from '@/utils/request'

// 总后台:答卷总览列表
export const getAnswersList = params => {
  return request({
    url: '/scrmapi/answers/list',
    method: 'get',
    params
  })
}
// 秘锋:答卷总览列表
export const getAnswersListByMiF = params => {
  return request({
    url: '/crmapi/answers/list',
    method: 'get',
    params
  })
}
// 秘锋:填空-多级联动查看详情
export const answersOtherDetailByMiF = params => {
  return request({
    url: '/crmapi/answers/detail',
    method: 'get',
    params
  })
}
// 总后台:填空-多级联动查看详情
export const answersOtherDetail = params => {
  return request({
    url: '/scrmapi/answers/detail',
    method: 'get',
    params
  })
}
// 秘锋:选项附件下载
export const downloadByMiF = params => {
  return request({
    url: `/crmapi/answers/download?problemId=${params}`,
    method: 'post',
    responseType: 'blob'
  })
}
// 总后台:选项附件下载
export const download = params => {
  return request({
    url: `/scrmapi/answers/download?problemId=${params}`,
    method: 'post',
    responseType: 'blob'
  })
}
// 总后台:用户答卷列表
export const userAnswerList = params => {
  return request({
    url: '/scrmapi/answers/user/list',
    method: 'get',
    params
  })
}
// 秘锋:用户答卷列表
export const userAnswerListByMiF = params => {
  return request({
    url: '/crmapi/answers/user/list',
    method: 'get',
    params
  })
}
