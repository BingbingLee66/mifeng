import request from '@/utils/request'
/**
 * 获取列表数据
 * @param {*} data
 * @returns
 */
export function getListInfo(params) {
  return request({
    url: '/ec/yyds/chamber-donation-list',
    method: 'get',
    params
  })
}
/**
 * 供应商列表
 * @param {*} params
 * @returns
 */
export function getSupplierInfo(params) {
  return request({
    url: '',
    method: 'get',
    params
  })
}
/**
 * 汇总数据
 * @param {*} params
 * @returns
 */
export function getChamberList(params) {
  return request({
    url: '/ec/yyds/chamber-donation-data',
    method: 'get',
    params
  })
}
// 下载名片详情统计数据列表
export function exportFile(params) {
  return request({
    url: '/ec/yyds/export-chamber-donation-list',
    method: 'get',
    params,
    responseType: 'blob'
  })
}
