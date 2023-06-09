import request from '@/utils/request'
const baseUrl = '/reptile'
export function getCollectList(params) {
  return request({
    url: baseUrl + '/ec/crawlerArticle/collect-list',
    method: 'get',
    params
  })
}

export function getRecycleList(params) {
  return request({
    url: baseUrl + '/ec/crawlerArticle/recycle-list',
    method: 'get',
    params
  })
}

export function save(params) {
  return request({
    url: baseUrl + '/ec/crawlerArticle/save',
    method: 'post',
    data: params
  })
}

export function del(params) {
  return request({
    url: baseUrl + '/ec/crawlerArticle/delete',
    method: 'put',
    data: params,
    hiddenSuccess: true
  })
}

export function getDetail(params) {
  return request({
    url: baseUrl + '/ec/crawlerArticle/detail',
    method: 'get',
    params
  })
}

export function publish(params) {
  return request({
    url: baseUrl + '/ec/crawlerArticle/publish',
    method: 'put',
    data: params,
    hiddenSuccess: true
  })
}

export function toRecycleBin(params) {
  return request({
    url: baseUrl + '/ec/crawlerArticle/to-recycle-bin',
    method: 'put',
    data: params,
    hiddenSuccess: true
  })
}

export function toCollectionResult(params) {
  return request({
    url: baseUrl + '/ec/crawlerArticle/to-collect',
    method: 'put',
    params,
    hiddenSuccess: true
  })
}

export function getWebnameOptions() {
  return request({
    url: baseUrl + '/ec/crawlerArticle/webname-options',
    method: 'get'
  })
}

export function getChannelOptions() {
  return request({
    url: baseUrl + '/ec/crawlerArticle/channel-options',
    method: 'get'
  })
}

/** 供需爬虫**/
/**
 * 获取供需爬虫列表
 * @returns {*}
 */
export function getReptileDemands(params) {
  return request({
    url: baseUrl + '/ec/reptile/ysh-demand-reptile/list',
    method: 'get',
    params
  })
}

/**
 * 批量逻辑删除(移入回收站)
 * @returns {*}
 */
export function moveToRecycleStationBatch(params) {
  return request({
    url: baseUrl + '/ec/reptile/ysh-demand-reptile/moveToRecycleStationBatch',
    method: 'post',
    data: params
  })
}

/**
 * 批量移出回收站
 * @returns {*}
 */
export function shiftOutFromRecycleStationBatch(params) {
  return request({
    url: baseUrl + '/ec/reptile/ysh-demand-reptile/shiftOutRecycleStationBatch',
    method: 'post',
    data: params
  })
}
export function reptileDelBatch(params) {
  return request({
    url: baseUrl + '/ec/reptile/ysh-demand-reptile/delBatch',
    method: 'delete',
    data: params
  })
}
export function details(params) {
  return request({
    url: baseUrl + `/ec/reptile/ysh-demand-reptile/${params}`,
    method: 'get'
  })
}
export const demandPublish = data =>
  request({ url: baseUrl + '/ec/reptile/ysh-demand-reptile/publish', method: 'post', data })
// export function demandPublish() {
//   return request({
//     url: baseUrl + '/ec/reptile/ysh-demand-reptile/publish',
//     method: 'post'
//   })
// }

export function getWebSiteSelect() {
  return request({
    url: baseUrl + '/ec/reptile/ysh-reptile-website/all',
    method: 'get'
  })
}
/**
 * 获取爬虫网站列表
 * @returns {*}
 */
export function getWebSites(params) {
  return request({
    url: baseUrl + '/ec/reptile/ysh-reptile-website/list',
    method: 'get',
    params
  })
}

/**
 * 保存或新增爬虫网站
 * @returns {*}
 */
export function saveOrUpdate(params) {
  return request({
    url: baseUrl + '/ec/reptile/ysh-reptile-website/insertOrUpdate',
    method: 'post',
    data: params
  })
}

/**
 * 采集爬虫网站
 * @returns {*}
 */
export function collect() {
  return request({
    url: baseUrl + '/ec/reptile/ysh-reptile-website/collect/{id}',
    method: 'post'
  })
}

/**
 * 批量删除爬虫网站配置
 * @returns {*}
 */
export function delBatch(params) {
  return request({
    url: baseUrl + '/ec/reptile/ysh-reptile-website/delBatch',
    method: 'delete',
    data: params
  })
}
