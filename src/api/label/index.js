import request from '@/utils/request'

// 新增标签
export const addLabel = (params, data) => request({ url: '/ec/label/add', method: 'post', params, data })

// 获取标签列表
export const getLabelList = params => request({ url: '/ec/label/labelList', method: 'get', params })

// 编辑标签
export const updateLabel = params => request({ url: '/ec/label/redact', method: 'post', params })

// 删除标签
export const deleteLabel = id => request({ url: `/ec/label/delete/${id}`, method: 'delete' })

// 编辑标签权重
export const updateLabelWeight = params => request({ url: '/ec/label/updateWeight', method: 'post', params })

// 冻结标签
export const freezeLabel = params => request({ url: '/ec/label/freezeLabel', method: 'post', params })

// 解冻标签
export const unFreezeLabel = params => request({ url: '/ec/label/unFreezeLabel', method: 'post', params })

// 查询冻结原因
export const getFreezeReasons = id => request({ url: `/ec/label/getFrozenReasons/${id}`, method: 'get' })

// 查询自定义标签列表
export const getCustomLabelList = params => request({ url: '/ec/labelCustom/labelCustomList', method: 'get', params })

// 编辑自定义标签
export const updateCustomLabel = params => request({ url: '/ec/labelCustom/redact', method: 'post', params })

// 采集自定义标签
export const gatherCustomLabel = params => request({ url: '/ec/labelCustom/gatherLabel', method: 'post', params })

// 查询自定义标签使用人数
export const getCustomLabelUsers = id => request({ url: `/ec/labelCustom/getUserCount/${id}`, method: 'get' })