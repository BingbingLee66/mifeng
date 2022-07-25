import request from '@/utils/request'
/**
 * 修改权重
 * @param {*} data
 * @returns
 */
export function updateOrganizationsSort(data) {
  return request({
    url: '/ec/socialOrg/weight',
    method: 'post',
    data
  })
}
/**
 * 导入
 * @param {*} data
 * @returns
 */
export function uploadOrganizationsData(data) {
  return request({
    url: '/ec/socialOrg/importSocialOrg',
    method: 'post',
    data
  })
}
/**
 * 获取列表数据
 * @param {*} data
 * @returns
 */
export function getListInfo(params) {
  return request({
    url: '/ec/socialOrg/list',
    method: 'get',
    params
  })
}
/**
 * 添加社会组织
 * @param {*} data
 * @returns
 */
export function setOrganization(data) {
  return request({
    url: '/ec/socialOrg/insert',
    method: 'post',
    data
  })
}
/**
 * 删除组织
 * @param {*} data
 */
export function delOrganization(data) {
  console.log(data)
  return request({
    url: '/ec/socialOrg/delBatch',
    method: 'delete',
    data
  })
}
/**
 * 认领入驻
 * @param {*} data
 * @returns
 */
export function claimOrganization(data) {
  return request({
    url: '/ec/socialOrg/settled',
    method: 'post',
    data
  })
}
/**
 * 社会组织名录详情
 * @param {*} params
 * @returns
 */
export function OrganizationDetail(params) {
  return request({
    url: '/ec/socialOrg/detail/' + params,
    method: 'get',
  })
}
/**
 * 编辑社会组织
 * @param {*} data
 * @returns
 */
export function updateOrganization(data) {
  return request({
    url: '/ec/socialOrg/update',
    method: 'put',
    data
  })
}