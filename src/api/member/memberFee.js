import request from '@/utils/request'
const baseUrl = process.env.VUE_APP_BASE_API_2

export function getMemberFeeList(params) {
  return request({
    url: baseUrl + '/ec/mall/member-fee-list',
    method: 'get',
    params
  })
}

export function getMemberList(params) {
  return request({
    url: baseUrl + '/ec/mall/member-list',
    method: 'get',
    params
  })
}

export function memberFeePay(params) {
  return request({
    url: baseUrl + '/ec/mall/member-fee-pay',
    method: 'post',
    data: params
  })
}

export function getMemberFeeNoticeList(params) {
  return request({
    url: baseUrl + '/ec/mall/member-fee-notice-list',
    method: 'get',
    params
  })
}

export function sendSms(params) {
  return request({
    url: baseUrl + '/ec/mall/send-sms',
    method: 'post',
    data: params
  })
}

export function getSmsList(params) {
  return request({
    url: baseUrl + '/ec/mall/sms-list',
    method: 'get',
    params
  })
}

export function getSmsDetails(params) {
  return request({
    url: baseUrl + '/ec/mall/members-from-bid',
    method: 'get',
    params
  })
}
