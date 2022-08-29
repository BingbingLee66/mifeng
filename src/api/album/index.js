import request from '@/utils/request'

// 创建相册
export const saveAlbum = data => request({
  url: '/api/ec/ysh-album/album-save',
  method: 'post',
  data
})

// 查询活动列表
export const getActivityList = () => request({
  url: '/api/ec/activity/get-activity-list'
})
