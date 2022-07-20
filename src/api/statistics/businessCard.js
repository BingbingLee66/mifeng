import request from '@/utils/request'
const baseUrl = process.env.VUE_APP_BASE_API_5

// 名片详情统计数据列表查询
export function getCardStatsDataList(params) {
  return request({
    url: baseUrl + '/v1.0/card/getCardStatsDataList',
    method: 'get',
    params
  })
}

// 名片数据总统计查询
export function getCardTotalData(params) {
    return request({
      url:  baseUrl + '/v1.0/card/getCardTotalData',
      method: 'get',
      params
    })
}

// 下载名片详情统计数据列表
export const listChamberTypeStatsDataByCkeyDownload = (params) => request({
    url:  baseUrl + '/v1.0/card/listChamberTypeStatsDataByCkeyDownload',
    method: 'get',
    params,
    responseType: 'blob'
  })


