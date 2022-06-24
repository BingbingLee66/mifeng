import request from '@/utils/request'
const baseUrl = process.env.VUE_APP_BASE_API_2
const baseUrl1 = process.env.VUE_APP_BASE_API

export function getListByRank(params) { // 总后台 操作指引 - 获取一级二级菜单
    return request({
      url: '/ec/menu/listByRank',
      method: 'get',
      params
    })
}

export function getlistLog(params) { // 总后台/商会后台 操作指引 - 浏览人数表格
    return request({
      url:'/ec/operation-guide/list-log',
      method: 'get',
      params
    })
}

export function getguideList(params) { // 总后台 操作指引表格
    return request({
      url:'/ec/operation-guide/list',
      method: 'get',
      params
    })
}
export function getguideDetail(params) { // 总后台/商会后台 操作指引表格 - 详情
  return request({
    url: '/ec/operation-guide/detail',
    method: 'get',
    params
  })
}
export function getguideSave(params) { // 总后台 创建操作指引 - 保存
  return request({
    url:'/ec/operation-guide/save',
    method: 'post',
    data: params
  })
}
export function getguideUpdate(params) { // 总后台 创建操作指引 - 更新指引状态
  return request({
    url:'/ec/operation-guide/update',
    method: 'post',
    data: params
  })
}
export function getexportLog(params) { // 总后台 操作指引表格 - 导出操作指引记录列表
  return request({
    url:'/ec/operation-guide/export-log',
    method: 'post',
    data: params
  })
}

export function getsaveLog(params) { // 商会后台 操作指引 - 保存访问操作指引记录
  return request({
    url:'/ec/operation-guide/save-log',
    method: 'post',
    data: params
  })
}