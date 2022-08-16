import request from '@/utils/request'

// 分页查询招商办信息
export const getPageList = params => request({ url: '/ec/investment-info/page-list', method: 'get', params })
// 新增招商办
export const getInfoAdd = data => request({ url: '/ec/investment-info/add', method: 'post', data })
// 编辑招商办
export const getInfoEdit = data => request({ url: '/ec/investment-info/edit', method: 'post', data })
// 查询招商办详情
export const getInfoDetails = id => request({ url: `/ec/investment-info/details/${id}`, method: 'get' })
// 冻结招商办
export const getInfoFreeze = id => request({ url: `/ec/investment-info/freeze/${id}`, method: 'post' })
// 解冻招商办
export const getInfoUnFreeze = id => request({ url: `/ec/investment-info/unFreeze/${id}`, method: 'post' })
