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

// 获取相册列表
export const getAlbumList = params => request({
  url: '/api/ec/ysh-stats-album/album-list',
  params
})

// 修改相册数据
export const modifyAlbumData = data => request({
  url: '/api/ec/ysh-stats-album/album-data-update',
  method: 'post',
  data
})
