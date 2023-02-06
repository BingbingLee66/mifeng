import request from '@/utils/request'
/** 获取友情单位 */
export function getFriendLinks(params) {
  return request({
    url: '/ecservice/ec/ysh-friend-unit/list',
    method: 'get',
    params
  })
}
/** 获取商会列表  */
export function getChamberData(params) {
  return request({
    url: '/ecservice/ec/ysh-friend-unit/chamberList',
    method: 'get',
    params
  })
}
/** 新增友情单位 */
export function addFriendLinks(data) {
  return request({
    url: '/ecservice/ec/ysh-friend-unit/save',
    method: 'post',
    data
  })
}
/** 移除友情单位 */
export function delFriendLinks(id) {
  return request({
    url: `/ecservice/ec/ysh-friend-unit/delete/${id}`,
    method: 'delete'
  })
}

/** 修改友情单位权重 */
export function editFriendLinksWeight(data) {
  return request({
    method: 'put',
    url: `/ecservice/ec/ysh-friend-unit/updateWeight/${data.id}/${data.value}`
  })
}
