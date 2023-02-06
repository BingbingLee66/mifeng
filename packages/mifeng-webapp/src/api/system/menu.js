import request from '@/utils/request'

export function getList() {
  return request({
    url: '/ecservice/menu/list',
    method: 'get'
  })
}

export function listForRouter(params) {
  return request({
    url: '/ecservice/ec/menu/listForRouter',
    method: 'get',
    params
  })
}

export function save(params) {
  return request({
    url: '/ecservice/menu',
    method: 'post',
    params
  })
}

export function delMenu(id) {
  return request({
    url: '/ecservice/menu',
    method: 'delete',
    params: {
      id
    }
  })
}
export function menuTreeListByRoleId(roleId) {
  return request({
    url: '/ecservice/menu/menuTreeListByRoleId',
    method: 'get',
    params: {
      roleId
    }
  })
}
