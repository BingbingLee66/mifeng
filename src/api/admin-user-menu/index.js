import request from '@/utils/request'

// 快捷工具栏保存
export function addToolBar(params) {
  return request({
    url: '/ec/admin-user-menu/add',
    method: 'post',
    data: params
  })
}

// 快捷工具栏编辑
export function editToolBar(params) {
  return request({
    url: '/ec/admin-user-menu/edit',
    method: 'post',
    data: params
  })
}

// 快捷工具栏查询
export function getMenuList(params) {
  return request({
    url: '/ec/admin-user-menu/list',
    method: 'get',
    params
  })
}

// 快捷工具栏未添加列表查询
export function getMenuNoList(params) {
  return request({
    url: '/ec/admin-user-menu/not-list',
    method: 'get',
    params
  })
}

// 快捷工具一二级栏删除
export function deleteMenuList(id) {
  return request({
    url: '/ec/admin-user-menu/delete',
    method: 'delete',
    params: { id }
  })
}

// 初始化添加接口
export function initAddToolBar(params) {
  return request({
    url: '/ec/admin-user-menu/init-add',
    method: 'post',
    data: params
  })
}
