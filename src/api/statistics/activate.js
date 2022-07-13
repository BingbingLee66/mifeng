import _request from '@/utils/request'

const request = ({ url, ...config }) => _request({
  url: process.env.VUE_APP_BASE_API_5 + url,
  ...config
})

// 获取平台激活活跃统计
export const getPlatformActiveData = params => request({
  url: '/ec/statActive/getPlatformActiveData',
  method: 'get',
  params
})

// 获取商协会激活活跃统计
export const getChamberActivateData = params => request({
  url: '/ec/statActive/getActiveDataByCkey',
  method: 'get',
  params
})
// 获取地区激活活跃统计
export const getAreaActivateData = params => request({
  url: '/ec/statActive/getActiveDataByArea',
  method: 'get',
  params
})

// 获取功能模块激活活跃统计
export const getFunctionModuleActivateData = params => request({
  url: '/ec/statActive/getActiveDataByFunction',
  method: 'get',
  params
})

// 获取功能模块列表
export const getFunctionModuleList = params => request({
  url: '/getAllFunctionModule',
  method: 'get',
  params
})

// 获取页面激活活跃统计
export const getPageActivateData = params => request({
  url: '/ec/statActive/getActiveDataByPage',
  method: 'get',
  params
})

// 发送激活活跃列表请求
export const sendActivateStat = params => request({
  url: '/ec/statActive/send',
  method: 'get',
  params
})

// 获取列表响应结果
export const getActivateStatResult = params => request({
  url: '/ec/statActive/getResult',
  method: 'get',
  params
})

