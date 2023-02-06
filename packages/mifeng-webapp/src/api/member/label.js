import request from '@/utils/request'
// 灰内职位
export const getLabelGroupLst = params => {
  return request({
    url: '/ecservice/ec/member-label-group/list',
    params,
    method: 'get'
  })
}

export const addLabelGroup = data => {
  return request({
    url: '/ecservice/ec/member-label-group/insertMemberGroup',
    method: 'post',
    data
  })
}
// 编辑标签组
export const editLabelGroup = data => {
  return request({
    url: '/ecservice/ec/member-label-group/updateMemberGroup',
    method: 'put',
    data
  })
}
// 移除标签组
export const delLabelGroup = data => {
  return request({
    url: '/ecservice/ec/member-label-group/deleteBatch',
    method: 'delete',
    data
  })
}
