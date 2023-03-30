import request from '@/utils/request'

/** 获取金刚区列表 */
export function getKingkongListV1(params) {
  return request({
    url: '/ecservice/ec/king-kong/list',
    method: 'get',
    params
  })
}

/** 删除金刚区  */
export function deleteKingkongV1(data) {
  return request({
    url: '/ecservice/ec/king-kong',
    method: 'delete',
    data
  })
}

/** 新增/编辑金刚区 */
export function saveKingkongV1(data) {
  return request({
    url: '/ecservice/ec/king-kong',
    method: data.kingKongId ? 'put' : 'post',
    data
  })
}

/** 调整金刚区顺序 */
export function changeKingkongOrder(kingkongId, num) {
  return request({
    url: `/ecservice/ec/king-kong/location/${kingkongId}/${num}`,
    method: 'put'
  })
}

/** 启用/冻结金刚区 */
export function changeKingkongStatus(kingkongId, status) {
  return request({
    url: `/ecservice/ec/king-kong/status/${kingkongId}/${status}`,
    method: 'put'
  })
}
