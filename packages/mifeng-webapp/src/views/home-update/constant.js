// 热门供需的供需状态
export const HOT_DEMAND_STATUS_LIST = [
  { label: '全部', value: 0 },
  { label: '生效中', value: 1 },
  { label: '已关闭(过期关闭)', value: 2 },
  { label: '已关闭(成功合作)', value: 3 },
  { label: '已关闭(终止对接)', value: 4 }
]
export const HOT_DEMAND_STATUS_MAP = new Map([
  [1, 'processing'],
  [2, 'error'],
  [3, 'success'],
  [4, 'error']
])
// 热门供需的冻结状态
export const HOT_DEMAND_FREEZE_STATUS_LIST = [
  { label: '全部', value: 0 },
  { label: '正常', value: 1 },
  { label: '平台冻结', value: 2 },
  { label: '商会冻结', value: 3 }
]

// 热门供需的发布时间
export const HOT_DEMAND_PUBLISH_TIME = [
  { label: '全部', value: 0 },
  { label: '24小时', value: 1 },
  { label: '3天', value: 2 },
  { label: '7天', value: 3 },
  { label: '一个月内', value: 4 }
]
