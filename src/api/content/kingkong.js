import request from '@/utils/request'


//金刚区列表
export function kingKongAreaList(params) {
  return request({
    url: '/ec/king-kong-area/list',
    method: 'post',
    data:params
  })
}
//批量删除金刚区
export function deleteKingKongList(params) {
  return request({
    url: '/ec/king-kong-area/delBatch',
    method: 'delete',
    params
  })
}

//保存或新增金刚区
export function saveKingKong(params) {
  return request({
    url: '/ec/king-kong-area/saveOrUpdate',
    method: 'post',
    data:params
  })
}

//总后台-首页更新-修改金刚区权重
export function saveKingKongWeight(params) {
  return request({
    url: `/ec/king-kong-area/weight/${params.id}/${params.value}`,
  })
}