import request from '@/utils/request'
const baseUrl = process.env.VUE_APP_BASE_API_4
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
    data: params
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
    data: params
  })
}

export function toRecycleBin(params) {
  return request({
    url: baseUrl + '/ec/crawlerArticle/to-recycle-bin',
    method: 'put',
    data: params
  })
}

export function toCollectionResult(params) {
  return request({
    url: baseUrl + '/ec/crawlerArticle/to-collect',
    method: 'put',
    params
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
/**
 * 获取供需爬虫列表
 * @returns {*}
 */
export function getReptileDemands() {
  return request({
    url: baseUrl + '/ec/reptile/ysh-demand-reptile/list',
    method: 'get'
  })
}

export function moveToRecycleStationBatch() {
  return request({
    url: baseUrl + '/ec/reptile/ysh-demand-reptile/moveToRecycleStationBatch',
    method: 'post'
  })
}
export function shiftOutFromRecycleStationBatch() {
  return request({
    url: baseUrl + '/ec/reptile/ysh-demand-reptile/shiftOutRecycleStationBatch',
    method: 'post'
  })
}
export function details() {
  return request({
    url: baseUrl + '/ec/reptile/ysh-demand-reptile/{id}',
    method: 'get'
  })
}
export function demandPublish() {
  return request({
    url: baseUrl + '/ec/reptile/ysh-demand-reptile/publish',
    method: 'post'
  })
}

/**
 * 获取爬虫网站列表
 * @returns {*}
 */
export function getWebSites() {
  return request({
    url: baseUrl + '/ec/reptile/ysh-reptile-website/list',
    method: 'get'
  })
}

/**
 * 保存或新增爬虫网站
 * @returns {*}
 */
export function saveOrUpdate() {
  return request({
    url: baseUrl + '/ec/reptile/ysh-reptile-website/insertOrUpdate',
    method: 'post'
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
export function delBatch() {
  return request({
    url: baseUrl + '/ec/reptile/ysh-reptile-website/delBatch',
    method: 'delete'
  })
}
