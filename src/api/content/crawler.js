import request from '@/utils/request'

export function getCollectList(params) {
  return request({
    url: '/ec/crawlerArticle/collect-list',
    method: 'get',
    params
  })
}

export function getRecycleList(params) {
  return request({
    url: '/ec/crawlerArticle/recycle-list',
    method: 'get',
    params
  })
}

export function save(params) {
  return request({
    url: '/ec/crawlerArticle/save',
    method: 'post',
    data: params
  })
}

export function del(params) {
  return request({
    url: '/ec/crawlerArticle/delete',
    method: 'put',
    data: params
  })
}

export function getDetail(params) {
  return request({
    url: '/ec/crawlerArticle/detail',
    method: 'get',
    params
  })
}

export function publish(params) {
  return request({
    url: '/ec/crawlerArticle/publish',
    method: 'put',
    data: params
  })
}

export function toRecycleBin(params) {
  return request({
    url: '/ec/crawlerArticle/to-recycle-bin',
    method: 'put',
    data: params
  })
}

export function toCollectionResult(params) {
  return request({
    url: '/ec/crawlerArticle/to-collect',
    method: 'put',
    params
  })
}

export function getWebnameOptions() {
  return request({
    url: '/ec/crawlerArticle/webname-options',
    method: 'get'
  })
}

export function getChannelOptions() {
  return request({
    url: '/ec/crawlerArticle/channel-options',
    method: 'get'
  })
}
