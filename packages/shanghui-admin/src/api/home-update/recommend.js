import request from '@/utils/request'

/** 获取推荐位配置列表  */
export function getRecommendList(params) {
  return request({
    url: '/ecservice/ec/recommend-pos/page-recommend-pos',
    method: 'get',
    params
  })
}

/** 显示/隐藏推荐位  */
export function changeRecommendStatus(data) {
  return request({
    url: '/ecservice/ec/recommend-pos/update-status',
    method: 'post',
    data
  })
}

/** 根据推荐内容类型获取内容列表  */
export function getContentList(params) {
  return request({
    url: '/ecservice/ec/recommend-pos/get-content-select',
    method: 'get',
    params
  })
}

/** 获取推荐内容 */
export function getRecommendContent(params) {
  return request({
    url: '/ecservice/ec/recommend-pos/get-content',
    method: 'get',
    params
  })
}

/** 编辑推荐内容 */
export function updateRecommendContent(data) {
  return request({
    url: '/ecservice/ec/recommend-pos/edit-content',
    method: 'post',
    data
  })
}
