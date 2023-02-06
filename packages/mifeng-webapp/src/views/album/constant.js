// 相册权限列表
export const ALBUM_AUDIT_LIST = [
  { label: '全部', value: '' },
  { label: '公开', value: '1' },
  { label: '隐藏', value: '0' },
  { label: '已冻结', value: '3' }
]

// 照片类型
export const PICTURE_TYPE_OPEN = 1
export const PICTURE_TYPE_FREEZE = 3
// 相册类型
export const ALBUM_TYPE_OPEN = 1
export const ALBUM_TYPE_FREEZE = 0

// 图片直播列表修改项
export const UPDATE_TYPE_OPTIONS = [
  { value: '0', label: '浏览量', realy: 'realBrowseNum', fake: 'browseNum' },
  { value: '1', label: '浏览人数', realy: 'realVisitorsNum', fake: 'visitorsNum' },
  { value: '2', label: '下载数', realy: 'realDownloadNum', fake: 'downloadNum' },
  { value: '3', label: '分享数', realy: 'realShareNum', fake: 'shareNum' }
]
// 相册状态列表
export const ALBUM_TYPES_LIST = [
  { label: '全部', value: '' },
  { label: '正常', value: '1' },
  { label: '冻结', value: '0' }
]
