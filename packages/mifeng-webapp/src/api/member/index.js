import request from '@/utils/request'
// 会内职位
export const getMemberOptions = params => {
  return request({
    url: '/ecservice/ec/memberPost/get-options',
    params,
    method: 'get'
  })
}
// 行业数据
export const getTradeOptions = params => {
  return request({
    url: '/ecservice/ec/trade/get-options',
    params,
    method: 'get'
  })
}
// 部门数据
export const getDepartmentList = params => {
  return request({
    url: '/ecservice/api/ec/department/list',
    params,
    method: 'get'
  })
}
// 批量认证会员
export const authorizeMemberAuthBatch = data =>
  request({ url: '/ecservice/ec/memberAuth/batchAuthenticate', method: 'post', data })
