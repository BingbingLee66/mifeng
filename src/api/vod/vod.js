import request from '@/utils/request'

export function getSts() {
  return request({
    url: '/menu/list',
    method: 'get'
  })
}
