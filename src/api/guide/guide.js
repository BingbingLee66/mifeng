import request from '@/utils/request'
const baseUrl = process.env.VUE_APP_BASE_API_2
const baseUrl1 = process.env.VUE_APP_BASE_API

export function getListByRank(params) {
    return request({
      url: baseUrl1 + '/ec/menu/listByRank',
      method: 'get',
      params
    })
}