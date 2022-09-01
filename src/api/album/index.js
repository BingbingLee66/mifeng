import request from '@/utils/request'
import { uploadFile } from '../content/article'

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

// 相册冻结 | 解冻
export const changeAlbumFreezeStatus = data => request({
  url: '/api/ec/ysh-album/album-frozen',
  method: 'post',
  data
})

// 获取相册图片列表
export const getAlbumImgList = params => request({
  url: '/api/ec/ysh-album/get-album-image-list',
  params
})

// 删除相册图片
export const delAlbumImgs = data => request({
  url: '/api/ec/ysh-album/album-img-del',
  method: 'delete',
  data
})

// 隐藏 | 公开图片
export const changeAlbumImgStatus = data => request({
  url: '/api/ec/ysh-album/album-img-audit',
  method: 'put',
  data
})

// 查询相册信息
export const getAlbumInfo = params => request({
  url: '/api/ec/ysh-album/get-album-info',
  params
})

// 查询相册详情
export const getAlbumDetail = params => request({
  url: '/api/ec/ysh-album/get-album-detail',
  params
})

// 上传相册图片
export const uploadAlbumImg = data => uploadFile(data, 'album')

// 保存图片到相册
export const saveImgToAlbum = data => request({
  url: '/api/ec/ysh-album/album-img-save',
  method: 'post',
  data
})

// 设置相册封面
export const setAlbumCover = data => request({
  url: '/api/ec/ysh-album/album-img-set-cover',
  method: 'put',
  data
})
