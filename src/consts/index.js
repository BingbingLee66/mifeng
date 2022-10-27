
// 活动类型枚举
const ACTIVE_MODE = {
  online: 0, // 线上活动
  offline: 1, // 线下活动
  onlineAndOffline: 2, // 线上线下活动
}

// 枚举映射
const activeModeMap = new Map([
  [ACTIVE_MODE.online, '线上活动'],
  [ACTIVE_MODE.offline, '线下活动'],
  [ACTIVE_MODE.onlineAndOffline, '线上线下活动'],
])

// 活动状态
const ACTIVE_STATUS = {
  goOnline: 0, // 待上线
  toBeStarted: 1, // 待开始
  started: 2, // 已开始
  registering: 3, // 报名中
  offline: 4, // 已下线
  over: 5, // 已结束
}

const activeStatusMap = new Map([
  [ACTIVE_STATUS.goOnline, '待上线'],
  [ACTIVE_STATUS.toBeStarted, '待开始'],
  [ACTIVE_STATUS.started, '已开始'],
  [ACTIVE_STATUS.registering, '报名中'],
  [ACTIVE_STATUS.offline, '已下线'],
  [ACTIVE_STATUS.over, '已结束'],
])

// 招商阶段
const STAGE = {
  normal: 1, // 筹备阶段
  land: 2, // 拟策阶段
  park: 3, // 招商阶段
  building: 4, // 招商阶段
}

const stageMap = new Map([
  [STAGE.normal, '默认类型'],
  [STAGE.land, '土地招商'],
  [STAGE.park, '园区招商'],
  [STAGE.building, '楼宇招商']
])

// 信息发布状态
const PUBLISH_STATUS = {
  goOnline: 0, // 待上线
  online: 1, // 已上线
  offline: 2, // 已下线
  over: 3, // 已结束
}

const publishStatusMap = new Map([
  [PUBLISH_STATUS.goOnline, '待上线'],
  [PUBLISH_STATUS.online, '已上线'],
  [PUBLISH_STATUS.offline, '已下线'],
  [PUBLISH_STATUS.over, '已结束'],
])

// 转成下拉框option
function getMapDict(mapArray) {
  return [...mapArray].map(([value, label]) => ({ label, value }))
}

export {
  ACTIVE_MODE,
  activeModeMap,

  ACTIVE_STATUS,
  activeStatusMap,

  STAGE,
  stageMap,

  PUBLISH_STATUS,
  publishStatusMap,

  getMapDict,
}
