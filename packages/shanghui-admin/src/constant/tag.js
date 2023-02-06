// 采集状态
export const COLLECT_STATUS = {
  no: 0, // 未采集
  yes: 1 // 已采集
}

export const collectStatusMap = new Map([
  [COLLECT_STATUS.no, '未采集'],
  [COLLECT_STATUS.yes, '已采集']
])

// 来源
export const DATA_SOURCE = {
  admin: 0, // 后台创建
  chamber: 1 // 商会创建
}

export const dataSourceMap = new Map([
  [DATA_SOURCE.admin, '后台创建'],
  [DATA_SOURCE.chamber, '商会创建']
])

// 是否冻结
export const FREEZE = {
  no: 0, // 否
  yes: 1 // 是
}

export const freezeMap = new Map([
  [FREEZE.no, '否'],
  [FREEZE.yes, '是']
])

// 搜索类型
export const SELECT_TYPE = {
  platform: 1, // 平台推荐
  chamber: 2, // 商协会创建
  thisWill: 3 // 本会创建
}

export const selectTypeMap = new Map([
  [SELECT_TYPE.platform, '平台推荐'],
  [SELECT_TYPE.chamber, '商协会创建'],
  [SELECT_TYPE.thisWill, '本会创建']
])
