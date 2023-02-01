import request from '@/utils/request'

// 快捷语配置列表
export function shortcutConfigList(params) {
  return request({
    url: '/ec/shortcut-config/list',
    method: 'get',
    params
  })
}

// 场景列表
export function shortcutSceneList(params) {
  return request({
    url: '/ec/shortcut-scene/list',
    method: 'get',
    params
  })
}

// 新增-编辑场景
export function sceneSaveOrUpdate(params) {
  return request({
    url: '/ec/shortcut-scene/saveOrUpdate',
    method: 'post',
    params
  })
}

// 删除场景
export function sceneDeleteById(params) {
  return request({
    url: '/ec/shortcut-scene/deleteById',
    method: 'delete',
    params
  })
}

// 删除 打招呼  快捷回复  常用语
export function configDeleteById(params) {
  return request({
    url: '/ec/shortcut-config/deleteById',
    method: 'delete',
    params
  })
}

// 使用场景下拉框
export function usageSceneList(params) {
  return request({
    url: '/ec/shortcut-scene/usageSceneList',
    method: 'get',
    params
  })
}

// 新增-编辑语言内容
export function configSaveOrUpdate(data) {
  return request({
    url: '/ec/shortcut-config/saveOrUpdate',
    method: 'post',
    data
  })
}

// 场景列表详情
export function sceneGetDetailById(params) {
  return request({
    url: '/ec/shortcut-scene/getDetailById',
    method: 'get',
    params
  })
}

// 打招呼/快捷回复/常用语 详情
export function configGetDetailById(params) {
  return request({
    url: '/ec/shortcut-config/getDetailById',
    method: 'get',
    params
  })
}

// 冻结-启用
export function freezeOrEnableById(params) {
  return request({
    url: '/ec/shortcut-config/freezeOrEnableById',
    method: 'put',
    params
  })
}

// 一键打招呼开关
export function oneClickGreet(params) {
  return request({
    url: '/ec/shortcut-config/one-click-greet',
    method: 'put',
    params
  })
}
