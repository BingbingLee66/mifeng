import request from '@/utils/request'
const baseUrl = process.env.VUE_APP_BASE_API
export function getSts() {
  return request({
    url: baseUrl + '/vod/medio/token',
    method: 'get'
  })
}
