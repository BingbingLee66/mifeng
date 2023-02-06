import request from '@/utils/request'
// 关注人数
export const getFollow = () => {
  return request({
    url: '/api/ec/chamber/home-page/follow-number',
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
