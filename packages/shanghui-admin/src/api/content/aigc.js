import request from '@/utils/request'

// AIGC - 查询列表
export const queryAigcList = params => {
  return request({
    url: '/ecservice/ec/aigc/control/page',
    method: 'get',
    params
  })
}

// AIGC - 改变状态
export const switchStatus = params => {
  return request({
    url: '/ecservice/ec/aigc/control/setSwitch',
    method: 'post',
    data: params
  })
}

// AIGC - 查询次数限制
export const queryLimitListConfig = params => {
  return request({
    url: '/ecservice/ec/aigc/control/getLimit',
    method: 'get',
    params
  })
}

// AIGC - 设置次数限制
export const setLimitListConfig = params => {
  return request({
    url: '/ecservice/ec/aigc/control/setLimit',
    method: 'post',
    data: params
  })
}

// 添加话题
export const addAiTopic = params => {
  return request({
    url: '/ecservice/ec/aigc/topic/add',
    method: 'post',
    data: params
  })
}

// 更新话题
export const updateAiTopic = params => {
  return request({
    url: '/ecservice/ec/aigc/topic/update',
    method: 'post',
    data: params
  })
}

// 查询话题
export const queryTopic = params => {
  return request({
    url: '/ecservice/ec/aigc/topic/page',
    method: 'post',
    data: params,
    hiddenSuccess: true
  })
}

// 添加话题分类
export const addCategory = params => {
  return request({
    url: '/ecservice/ec/aigc/category/add',
    method: 'post',
    data: params
  })
}

// 更新话题分类
export const updateCategory = params => {
  return request({
    url: '/ecservice/ec/aigc/category/update',
    method: 'post',
    data: params
  })
}

// 查询话题分类
export const queryTopicCategory = params => {
  return request({
    url: '/ecservice/ec/aigc/category/page',
    method: 'post',
    data: params,
    hiddenSuccess: true
  })
}
