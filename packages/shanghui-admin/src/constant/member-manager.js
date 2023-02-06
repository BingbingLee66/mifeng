const TYPE = {
  /** 个人 */
  PERSON: 0,
  /** 企业/团队/ */
  TEAM: 1,
  // 社会组织
  ORGANIZATION: 2
}

const TYPE_MAP = new Map([
  [TYPE.PERSON, '个人'],
  [TYPE.TEAM, '企业'],
  [TYPE.ORGANIZATION, '社会组织']
])

const AUDIT_STATUS = {
  /** 全部 */
  ALL: -1,
  /** 待审核 */
  AUDIT: 0,
  /** 已通过 */
  PASS: 1,
  /** 已驳回 */
  REJECT: 2
}

const AUDIT_STATUS_MAP = new Map([
  [AUDIT_STATUS.ALL, '全部'],
  [AUDIT_STATUS.AUDIT, '待审核'],
  [AUDIT_STATUS.PASS, '已通过'],
  [AUDIT_STATUS.REJECT, '已驳回']
])

const REGISTER_TYPE = {
  /** 后台 */
  BACK: 0,
  /** 小程序 */
  WECHAT: 1,
  /** 商会邀请 */
  CHAMBER: 2,
  /** 会员邀请 */
  MEMBET: 3,
  /** 会员邀请 */
  MEMBET1: 4,
  /** app */
  APP: 10
}

const REGISTER_TYPE_MAP = new Map([
  [REGISTER_TYPE.BACK, '后台'],
  [REGISTER_TYPE.WECHAT, '小程序'],
  [REGISTER_TYPE.CHAMBER, '商会邀请'],
  [REGISTER_TYPE.MEMBET, '会员邀请'],
  [REGISTER_TYPE.MEMBET1, '会员邀请'],
  [REGISTER_TYPE.APP, 'app']
])

export default {
  TYPE,
  TYPE_MAP,
  AUDIT_STATUS,
  AUDIT_STATUS_MAP,
  REGISTER_TYPE,
  REGISTER_TYPE_MAP
}
