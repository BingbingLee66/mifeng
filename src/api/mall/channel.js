import request from '@/utils/request'

const baseUrl = process.env.VUE_APP_BASE_API_2
// 渠道推广数据统计
export function getChannelStatistical(params) {
  return request({
    url: baseUrl + '/ec/mall/channel/channel-statistical-list',
    method: 'get',
    params
  })
}
export function getChannelSummary(params) {
  return request({
    url: baseUrl + '/ec/mall/channel/channel-statistical-summary',
    method: 'get',
    params
  })
}


// 渠道推广数据列表
export function getChannelPromoteList(params) {
  return request({
    url: baseUrl + '/api/ec/mall/channel-goods/thChannelGoods-list',
    method: 'get',
    params
  })
}

// 删除配置
export function delChannelPromote(params) {
  return request({
    url: baseUrl + '/api/ec/mall/channel-goods/channel-delete',
    method: 'delete',
    data: params
  })
}

// 添加配置
export function addChannelPromote(params) {
  return request({
    url: baseUrl + '/api/ec/mall/channel-goods/channel-save',
    method: 'post',
    data: params
  })
}

// 生成渠道二维码
export function getChannelPromoteCode(params) {
  return request({
    url: baseUrl + '/api/ec/mall/channel-goods/get-channel-code',
    method: 'get',
    params
  })
}

// 生成渠道短链接
export function getChannelPromoteLink(params) {
  return request({
    url: baseUrl + '/api/ec/mall/channel-goods/get-channel-url',
    method: 'get',
    params
  })
}

// 渠道列表
export function getList(params) {
  return request({
    url: baseUrl + '/ec/mall/channel/thChannel-list',
    method: 'get',
    params
  })
}

export function delChannel(params) {
  return request({
    url: baseUrl + '/ec/mall/channel/channel-delete',
    method: 'delete',
    params
  })
}

export function save(params) {
  return request({
    url: baseUrl + '/ec/mall/channel/channel-save',
    method: 'post',
    data: params
  })
}

// 商会列表
export function getChamberOptions() {
  return request({
    url: baseUrl + '/ec/mall/get-chamber-options',
    method: 'get'
  })
}
