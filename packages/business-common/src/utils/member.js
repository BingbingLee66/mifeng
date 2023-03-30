import request from './request'
export function getMemberOptions(params) {
  return request({
    url: '/ecservice/ec/memberPost/get-options',
    method: 'get',
    params,
  })
}
