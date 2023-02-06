import request from '@/utils/request'
// 我的待办
export const getPendingItems = params => {
  return request({
    url: '/ecservice/api/ec/chamber/home-page/pending-items',
    params,
    method: 'get'
  })
}

// 会员统计
export const getChamberMembers = params => {
  return request({
    url: '/ecservice/api/ec/chamber/home-page/statistics/members',
    params,
    method: 'get'
  })
}
// 文章统计
export const getChamberArticles = params => {
  return request({
    url: '/ecservice/api/ec/chamber/home-page/statistics/articles',
    params,
    method: 'get'
  })
}
// 群发统计
export const getChamberNotices = params => {
  return request({
    url: '/ecservice/api/ec/chamber/home-page/statistics/notices',
    params,
    method: 'get'
  })
}
// 图片直播统计
export const getChamberAlbums = params => {
  return request({
    url: '/ecservice/api/ec/chamber/home-page/statistics/albums',
    params,
    method: 'get'
  })
}
// 我的待办
export const getPermission = () => {
  return request({
    url: '/ecservice/api/ec/chamber/home-page/statistics/permission',
    method: 'get'
  })
}
// 关注人数
export const getFollow = () => {
  return request({
    url: '/ecservice/api/ec/chamber/home-page/follow-number',
    method: 'get'
  })
}
// 获取关注列表数据
export const getFollowList = data => {
  return request({
    url: '/ecservice/ec/follow-chamber/follow-user',
    method: 'post',
    data
  })
}
