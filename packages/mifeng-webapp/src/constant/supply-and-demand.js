// 来源
export const SOURCE = {
  all: -1,
  platform: 1,
  admin: 2,
  app: 3,
  collect: 4
}

export const sourceMap = new Map([
  [SOURCE.all, '全部'],
  [SOURCE.platform, '平台'],
  [SOURCE.admin, '商会后台'],
  [SOURCE.app, '小程序'],
  [SOURCE.collect, '采集']
])

// 状态
export const STATUS = {
  all: -1,
  lived: 1,
  closedExpired: 2,
  closedsuc: 3,
  closedStop: 4
}

export const statusMap = new Map([
  [STATUS.all, '全部'],
  [STATUS.lived, '生效中'],
  [STATUS.closedExpired, '已关闭（过期关闭）'],
  [STATUS.closedsuc, '已关闭（成功合作）'],
  [STATUS.closedStop, '已关闭（终止对接）']
])

export const statusPointMap = new Map([
  [STATUS.all, 'default'],
  [STATUS.lived, 'processing'],
  [STATUS.closedExpired, 'error'],
  [STATUS.closedsuc, 'success'],
  [STATUS.closedStop, 'error']
])

// 冻结
export const FREEZE = {
  all: -1,
  normal: 1,
  freezePlatform: 2,
  freezeChamber: 3
}

export const freezeMap = new Map([
  [FREEZE.all, '全部'],
  [FREEZE.normal, '正常'],
  [FREEZE.freezePlatform, '平台冻结'],
  [FREEZE.freezeChamber, '商会冻结']
])

// 举报
export const REPORT = {
  all: -1,
  normal: 1,
  reported: 2
}

export const reportMap = new Map([
  [REPORT.all, '全部'],
  [REPORT.normal, '正常'],
  [REPORT.reported, '被举报']
])

export const reportStatusMap = new Map([
  [REPORT.all, 'default'],
  [REPORT.normal, 'success'],
  [REPORT.reported, 'error'],
  [FREEZE.freezeChamber, 'error']
])
