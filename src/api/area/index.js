import request from '@/utils/request'

// 获取省市区树形结构
export const getAreaTree = params => request({ url: '/ec/ysh-area-code/tree', method: 'get', params })

// 获取省市区数组列表
export const getAreaList = params => request({ url: '/ec/ysh-area-code/list', method: 'get', params })
