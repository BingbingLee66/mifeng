import request from '@/utils/request'
const baseUrl = process.env.VUE_APP_BASE_API_3
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
