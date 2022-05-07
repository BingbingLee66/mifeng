import request from '@/utils/request'


//热门供需-列表
export function kingKongAreaList(params) {
  return request({
    url: '/ec/demand/_mget',
    method: 'get',
    params
  })
}

