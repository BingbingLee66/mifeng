import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/ec/chamber/list',
    method: 'get',
    params
  })
}

export function getDetail(params) {
  return request({
    url: '/ec/chamber/detail',
    method: 'get',
    params
  })
}

export function save(params) {
  return request({
    url: '/ec/chamber/save',
    method: 'post',
    data: params
  })
}

export function updateStatus(params) {
  return request({
    url: '/ec/chamber/update-status',
    method: 'put',
    params
  })
}

export function upload(params) {
  return request({
    url: '/ec/upload/license',
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data: params
  })
}

export function getJoinList(params) {
  return request({
    url: '/ec/chamber/join-list',
    method: 'get',
    params
  })
}

export function updateAudit(params) {
  return request({
    url: '/ec/chamber/audit-status',
    method: 'put',
    params
  })
}
// 修改商会权重
export function updateChamberLevel(params) {
  return request({
    url: '/ec/chamber/updateChamberLevel',
    method: 'put',
    params
  })
}
// 数据维度（商会列表）
export function chamberSearchList(params) {
  return request({
    url: '/ec/chamber/chamberSearchList',
    method: 'get',
    params
  })
}

// 获取线索列表
export const getClueList = params => request({
  url: '/chamber/ysh-clue/getList',
  params
})

//  商会后台使用统计 全部导出
export const listAllChamberStatsDataByCkeyDownload = params => request({
  url: '/ec/chamberStats/listAllChamberStatsDataByCkeyDownload',
  method: 'get',
  params,
  responseType: 'blob'
})

// 商会主页二维码或者入会专属二维码
export const getChamberQrcode = params => request({
  url: '/ec/chamber/getChamberQrCodeMsg',
  method: 'get',
  params
})
