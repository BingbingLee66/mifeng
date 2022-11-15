import request from '@/utils/request'
// 我的待办
export const getPendingItems = params => {
  console.log(params)
  return request({
    url: '/api/ec/chamber/home-page/pending-items',
    params,
    method: 'get'
  })
}

// 会员统计
export const getChamberMembers = params => {
  return request({
    url: '/api/ec/chamber/home-page/statistics/members',
    params,
    method: 'get'
  })
}
// 文章统计
export const getChamberArticles = params => {
  return request({
    url: '/api/ec/chamber/home-page/statistics/articles',
    params,
    method: 'get'
  })
}
// 群发统计
export const getChamberNotices = params => {
  return request({
    url: '/api/ec/chamber/home-page/statistics/notices',
    params,
    method: 'get'
  })
}
// 图片直播统计
export const getChamberAlbums = params => {
  return request({
    url: '/api/ec/chamber/home-page/statistics/albums',
    params,
    method: 'get'
  })
}
// 我的待办
export const getPermission = params => {
  return request({
    url: '/home-page/statistics/permission',
    params,
    method: 'get'
  })
}
