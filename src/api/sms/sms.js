import request from '@/utils/request'

export function getList (params) {
  return request({
    url: '/ec/smsMt/list',
    method: 'get',
    params
  })
}

export function sendSms (params) {
  return request({
    url: '/ec/smsMt/send-msg',
    method: 'post',
    data: params
  })
}
