import request from '@/utils/request'
/**
 * 标签相关请求api
 * get--params
 * post--data
 */

/** 标签组采集 */
export const labelGroupCollect = data => {
  return request({
    url: '/ecservice/ec/member-label-group/collect',
    method: 'post',
    data
  })
}

/** 标签组批量删除 */
export const delLabelGroup = data => {
  return request({
    url: '/ecservice/ec/member-label-group/deleteBatch',
    method: 'delete',
    data
  })
}

/** 标签组冻结 */
export const freezeLabelGroup = data => {
  return request({
    url: '/ecservice/ec/member-label-group/freeze',
    method: 'post',
    data
  })
}

/** 标签组解冻 */
export const unfreezeLabelGroup = data => {
  return request({
    url: '/ecservice/ec/member-label-group/unfreeze',
    method: 'post',
    data
  })
}

/** 标签组新增 */
export const addLabelGroup = data => {
  return request({
    url: '/ecservice/ec/member-label-group/insertMemberGroup',
    method: 'post',
    data
  })
}

/** 标签组列表 */
export const getLabelGroupLst = params => {
  return request({
    url: '/ecservice/ec/member-label-group/list',
    method: 'get',
    params
  })
}

/** 标签组编辑 */
export const editLabelGroup = data => {
  return request({
    url: '/ecservice/ec/member-label-group/updateMemberGroup',
    method: 'put',
    data
  })
}

/** 标签组更新权重 */
export const updateLabelGroupWeight = data => {
  return request({
    url: '/ecservice/ec/member-label-group/weight',
    method: 'put',
    data
  })
}

/** 打标签 */
export const attachLabel = data => {
  return request({
    url: '/ecservice/ec/member-label-bridge/attachALabel',
    method: 'post',
    data
  })
}

/** 移除标签 */
export const removeLabel = (wxUserId, tagIds) => {
  return request({
    url: `/ecservice/ec/member-label-bridge/deleteLabel/${wxUserId}?tagIds=${tagIds}`,
    method: 'delete'
  })
}

export const getFirstInterestLabel = params => {
  return request({
    url: `/ecservice/ec/label/usedList`,
    params,
    method: 'get'
  })
}

/** 用户行业标签 */
export const getTradeLabel = params => {
  return request({
    url: `/ecservice/ec/trade/usedList`,
    params,
    method: 'get'
  })
}

/** 查询符合标签的用户数量 */
export const getMatchLabelNum = params => {
  return request({
    url: '/ecservice/ec/member-label-bridge/matchMemberNum',
    method: 'get',
    params
  })
}

/** 用户详情-用户标签列表 */
export const getUserDetailLabelLst = (userId, type, params) => {
  return request({
    url: `/ecservice/ec/member-label-bridge/userInfoLabelList/${userId}/${type}`,
    method: 'get',
    params
  })
}
