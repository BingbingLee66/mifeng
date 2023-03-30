export const CHAMBER_CLUE_MAP = new Map([
  // 快速入驻线索
  ['rapidentry', 1],
  // 转介绍线索
  ['introduce', 2]
])

// 商会审核状态
export const statusList = [
  { id: '', name: '所有' },
  { id: 0, name: '待审核' },
  { id: 1, name: '通过' },
  { id: 2, name: '驳回' }
]
export const STATUS_LIST_MAP = new Map([
  [0, '待审核'],
  [1, '通过'],
  [2, '驳回']
])
export const statusSource = [
  { id: '', name: '全部' },
  { id: 1, name: '小程序' },
  { id: 2, name: '后台录入' },
  { id: 3, name: '小程序名录' },
  { id: 4, name: 'APP' },
  { id: 5, name: 'APP名录' }
]
export const STATUS_SOURCE_MAP = new Map([
  [1, '小程序'],
  [2, '后台录入'],
  [3, '小程序名录'],
  [4, 'APP'],
  [5, 'APP名录'],
  [6, '--']
])

function conversionObj(data) {
  const obj = {}
  if (Array.isArray(data)) {
    data.forEach(item => {
      if (item.value !== undefined || item.value !== null) {
        obj[item.value] = item.label
      }
    })
  }
  return obj
}
// 入驻来源
export const inSource = [
  { label: '全部', value: '' },
  { label: '小程序', value: 1 },
  { label: '后台录入', value: 2 },
  { label: '小程序名录', value: 3 },
  { label: 'app', value: 4 },
  { label: 'APP名录', value: 5 },
  { label: '邀请码注册', value: 6 }
]
export const inSourceObj = conversionObj(inSource)
// 入驻状态
export const inState = [
  { label: '全部', value: '' },
  { label: '待入驻', value: -1 },
  { label: '待审核', value: 0 },
  { label: '已认证', value: 1 },
  { label: '驳回', value: 2 }
]
export const stateMap = new Map([
  [-1, '待入驻'],
  [0, '待审核'],
  [1, '已认证'],
  [2, '驳回']
])
export const inStateObj = conversionObj(inState)
// 数据来源
export const dataSource = [
  { label: '全部', value: '' },
  { label: '页面录入', value: 1 },
  { label: '导入', value: 2 },
  { label: '抓取', value: 3 },
  { label: '邀请码注册', value: 4 }
]
export const dataSourceObj = conversionObj(dataSource)
// 组织状态
export const organizationState = [
  { label: '全部', value: '' },
  { label: '正常', value: 1 },
  { label: '注销', value: 4 },
  { label: '撤销', value: 5 }
]
export const orgStateObj = conversionObj(organizationState)

export const ORG_STATE_MAP = new Map([
  [0, '不可用'],
  [1, '正常'],
  [2, '删除'],
  [3, '撤销'],
  [4, '注销']
])
// 	组织类型
export const organizationType = [
  { label: '社会团体', value: 1 },
  { label: '民办非企业单位', value: 2 },
  { label: '基金会', value: 3 }
]
export const orgTypeObj = conversionObj(organizationType)
// 组织标识
export const organizationMarker = [
  { label: '行业协会商会', value: 1 },
  { label: '志愿服务组织', value: 2 },
  { label: '慈善组织', value: 3 },
  { label: '公开募捐资格', value: 4 }
]
export const orgMarkerObj = conversionObj(organizationMarker)
// 信用状态
export const codestatusOptions = [
  { label: '全部', value: -1 },
  { label: '正常', value: 0 },
  { label: '活动异常', value: 1 },
  { label: '严重违法失信', value: 2 }
]
export const orgStatusOptions = conversionObj(codestatusOptions)

// 签约状态
export const SignStatusOptions = [
  { label: '未签约', value: 0 },
  { label: '已签约', value: 1 }
]

// 商会状态
export const CHAMBER_STATUS_OPTION = [
  { id: '', name: '全部' },
  { id: 1, name: '正常' },
  { id: 2, name: '已冻结' }
]
// 直播权限
export const LIVE_STATUS_OPTIONS = [
  { id: '', name: '全部' },
  { id: 1, name: '有权限' },
  { id: 0, name: '无权限' }
]
// 是否已过试用
export const PROBATION_STATUS_OPTIONS = [
  { id: '', name: '全部' },
  { id: 1, name: '过期' },
  { id: 0, name: '未过期' }
]
// 商会状态
export const CHAMBER_FREEZE_OPTION = [
  { id: '', name: '全部' },
  { id: 1, name: '正常' },
  { id: 0, name: '已冻结' }
]
