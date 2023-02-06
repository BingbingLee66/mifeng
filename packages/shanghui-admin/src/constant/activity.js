export const ACTIVITY_TYPE_OPTION = [
  { label: '全部状态', value: -1 },
  { label: '未开始', value: 1 },
  { label: '进行中', value: 2 },
  { label: '已结束', value: 3 }
]

// export const APPLY_OBJECT_TYPE = {
//   ALL: 0,
//   CHAMBER: 1,
//   POSITION: 2,
//   DEPARTMENT: 3
// }

// export const APPLY_OBJECT_MAP = new Map([
//   [APPLY_OBJECT_TYPE.ALL, '不限'],
//   [APPLY_OBJECT_TYPE.CHAMBER, '限本商会成员'],
//   [APPLY_OBJECT_TYPE.POSITION, '限本商内指定职位'],
//   [APPLY_OBJECT_TYPE.DEPARTMENT, '限本商内指定部门']
// ])
export const APPLY_OBJECT_TYPE = {
  /** 不限 */
  ALL: 0,
  /** 限本商会成员 */
  MEMBER: 1,
  /** 限本商内指定职位 */
  POST: 2,
  /** 限本商内指定部门 */
  DEPARTMENT: 3
}
export const APPLY_OBJECT_MAP = new Map([
  [APPLY_OBJECT_TYPE.ALL, '不限'],
  [APPLY_OBJECT_TYPE.MEMBER, '限本商会成员'],
  [APPLY_OBJECT_TYPE.POST, '限本商内指定职位'],
  [APPLY_OBJECT_TYPE.DEPARTMENT, '限本商内指定部门']
])

export const PUBLISH_TYPE_MAP = new Map([
  ['published', 1],
  ['unpublish', 0]
])

export const QR_CODE_DESC = [
  '保存图片打印在活动海报、易拉宝等场合',
  '用户使用微信扫码即签到成功，并显示会场座位号。',
  '临时报名签到码用于临时到场会员，未报名无法签到情况，扫码后自动通过并签到。'
]
export const YES_OR_NO = {
  /** 否 */
  no: 0,
  /** 是 */
  yes: 1
}
export const SIGN_IN_MAP = new Map([
  [YES_OR_NO.no, ''],
  [YES_OR_NO.yes, '签到 ']
])
export const SIGN_OUT_MAP = new Map([
  [YES_OR_NO.no, ''],
  [YES_OR_NO.yes, '签退 ']
])
export const SEATING_MAP = new Map([
  [YES_OR_NO.no, ''],
  [YES_OR_NO.yes, '座位表 ']
])

export const statusList = [
  { id: -1, name: '全部' },
  { id: 0, name: '待签到' },
  { id: 1, name: '已签到' },
  { id: 2, name: '未签到' }
]
export const seatList = [
  { id: -1, name: '全部' },
  { id: 0, name: '未坐' },
  { id: 1, name: '已坐' },
  { id: 2, name: '空坐' }
]
export const SOURCE_TYPE = {
  /** 导入 */
  IMPORT: 1,
  /** 小程序报名 */
  MIN_PROGRAM: 2,
  /** 临时签到 */
  TEMPORARY: 3
}
export const SOURCE_TYPE_MAP = new Map([
  [SOURCE_TYPE.IMPORT, '导入'],
  [SOURCE_TYPE.MIN_PROGRAM, '小程序报名 '],
  [SOURCE_TYPE.TEMPORARY, '临时签到 ']
])
