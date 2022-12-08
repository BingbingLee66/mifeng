import request from '@/utils/request'

// 添加标签
export const addTag = params => request({
  url: '/ec/user-guide-label/add',
  method: 'post',
  data: params
})

// 删除标签
export const deleteTag = labelId => request({
  url: `/ec/user-guide-label/del/${labelId}`,
  method: 'delete',
})

// 查询标签列表
export const getTag = () => request({
  url: '/ec/user-guide-label/list',
  method: 'get',
})

// 统计
export const statisticsTag = params => request({
  url: '/ec/user-guide-label/stat',
  method: 'get',
  params
})
