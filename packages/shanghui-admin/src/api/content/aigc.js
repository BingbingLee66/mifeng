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
