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

// 获取转介绍来源渠道
export const getPutSource = () => request({
  url: '/chamber/ysh-clue/getputsource',
  method: 'get',
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
// 生成二维码并下载

export const registerCodeDownload = params => request({
  url: '/ec/chamber/register-code-download',
  method: 'get',
  params,
  responseType: 'blob'
})
// 查询商务列表
export const businessList = () => request({
  url: '/ec/chamber/business-list',
  method: 'get',
})
// 查询运营列表
export const operatingLlist = () => request({
  url: '/ec/chamber/operating-list',
  method: 'get',
})
// 未签约商会导出表格
export const unSignedExport = params => request({
  url: '/ec/chamber/un-signed/export',
  method: 'get',
  params
})
// 备注负责人
export const updateDirector = data => request({
  url: '/ec/chamber/update-director',
  method: 'post',
  data
})
// 标记已签约
export const chamberSign = data => request({
  url: '/ec/chamber/sign',
  method: 'post',
  data
})
// 延迟试用时间
export const addTryTime = data => request({
  url: '/ec/chamber/add-try-time',
  method: 'post',
  data
})
// 未签约商会查询接口
// export const unsignedData = params => {
//   request({
//     url: '/ec/chamber/un-signed/list',
//     method: 'get',
//     params,
//   })
// }
export const unsignedData = params => request({
  url: '/ec/chamber/un-signed/list',
  method: 'get',
  params
})
// 未签约商会导出表格
export const exportUnSigned = data =>
  request({
    url: '/ec/chamber/un-signed/export',
    method: 'post',
    data,
    responseType: 'blob'
  })
// 开通&关闭直播权限
export const livePermissionUpdate = params =>
  request({
    url: '/ec/chamber/live/permission',
    method: 'put',
    data: params
  })

