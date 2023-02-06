import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/ecservice/ec/contentColumn/list',
    method: 'get',
    params
  })
}

export function getInfoColumnList(params) {
  return request({
    url: '/ecservice/ec/contentColumn/info-column-list',
    method: 'get',
    params
  })
}

export function save(params) {
  return request({
    url: '/ecservice/ec/contentColumn/save',
    method: 'post',
    data: params
  })
}

export function updateStatus(params) {
  return request({
    url: '/ecservice/ec/contentColumn/update-status',
    method: 'put',
    params,
    hiddenSuccess: true
  })
}

export function del(params) {
  return request({
    url: '/ecservice/ec/contentColumn/delete',
    method: 'put',
    params
  })
}

export function getContentColumnOptionsWithCkey(params) {
  return request({
    url: '/ecservice/ec/contentColumn/get-options-with-ckey',
    method: 'get',
    params
  })
}

export function getContentColumnOptions() {
  return request({
    url: '/ecservice/ec/contentColumn/get-options',
    method: 'get'
  })
}

export function getAllContentColumnOptions() {
  return request({
    url: '/ecservice/ec/contentColumn/get-all-options',
    method: 'get'
  })
}
// 商会指定模块下 栏目列表
export function getOptionsWithCkey(params) {
  return request({
    url: '/ecservice/ec/contentColumn/get-options-with-ckey',
    method: 'get',
    params
  })
}
// 栏目权重设置
export function updateColumnLevel(params) {
  return request({
    url: '/ecservice/ec/contentColumn/updateColumnLevelById?id=' + params.id + '&level=' + params.level,
    method: 'get'
  })
}
// 删除栏目
export function delColumn(id) {
  return request({
    url: '/ecservice/ec/contentColumn/delete?id=' + id,
    method: 'delete'
  })
}

/** 修改栏目是否给专委会使用 */
export function updateSpecialCommittee(data) {
  return request({
    url: '/ecservice/ec/contentColumn/updateSpecialCommittee',
    method: 'post',
    data
  })
}

/** 是否展示专委会栏目 */
export function showSpecialCommittee(ckey) {
  return request({
    url: `/ecservice/ec/role/existSpecialCommittee/${ckey}`,
    method: 'get'
  })
}
