/** 责任申明 */
export const RULE_STRING =
  '申明：遵守国家的有关法规和行政规章制度。不发送任何非法的、骚扰性、中伤他人的、辱骂性的、恐吓性的、伤害性的、挑衅的、庸俗的、淫秽等内容的信息。不发送任何教唆他人构成犯罪的信息。不发送涉及国家安全、国家机密的信息。如违反引起的法律纠纷和责任由（用户）您独立承担，因此给广州凯迪云信息科技有限公司（简称“云商会”）造成损失的，应当予以赔偿'

/** 最多上传图片数 */
export const IMG_MAXLEN = 9

export const SEND_TYPE = {
  /** 立即发送 */
  NOW: 1,
  /** 定时发送 */
  TIMING: 2
}

/** 通知类型options */
export const SEND_TYPE_OPTIONS = [
  { label: '立即发送', value: 1 },
  { label: '定时发送', value: 2 }
]

export const SYNC_CHANNELS_ID = {
  /** 短信 */
  NOTE: 1,
  /** 微信订阅消息 */
  SUBSCRIBE: 2,
  /** APP通知 */
  APP: 3,
  /** 彩信 */
  MMS: 6
}
export const SYNC_CHANNELS_ID_MAP = new Map([
  [SYNC_CHANNELS_ID.NOTE, '短信'],
  [SYNC_CHANNELS_ID.SUBSCRIBE, '微信订阅消息'],
  [SYNC_CHANNELS_ID.APP, 'APP通知']
])
export const PUBLISH_STATUS = {
  /** 未发布 */
  yes: 1,
  /** 已发布 */
  no: 0
}
export const PUBLISH_STATUS_MAP = new Map([
  [PUBLISH_STATUS.yes, '已发布'],
  [PUBLISH_STATUS.no, '未发布']
])
export const MEMBER_TYPE = {
  /** 会员 */
  MEMBER: 1,
  /** 不限 */
  ALL: 0
}
export const MEMBER_TYPE_MAP = new Map([
  [MEMBER_TYPE.ALL, '不限'],
  [MEMBER_TYPE.MEMBER, '商会会员']
])
export const NOTIFICATION_TYPE = {
  /** 全部 */
  ALL: -1,
  /** 缴费通知 */
  PAYMENT: 1,
  /** 活动通知 */
  ACTIVITY: 2,
  /** 招商活动 */
  INVESTMENT: 3,
  /** 邀请入会 */
  INVITATION: 4,
  /** 自定义通知 */
  CUSTOM: 5,
  /** 课程通知 */
  CLASS: 6,
  /** 5G彩信通知 */
  FIVEG: 7,
  /** 节日海报 */
  POSTER: 8,
  /** 问卷调查 */
  QUESTIONNAIRE: 9
}
export const NOTIFICATION_TYPE_MAP = new Map([
  [NOTIFICATION_TYPE.ALL, '全部'],
  [NOTIFICATION_TYPE.PAYMENT, '缴费通知'],
  [NOTIFICATION_TYPE.ACTIVITY, '活动通知'],
  [NOTIFICATION_TYPE.CLASS, '课程通知'],
  [NOTIFICATION_TYPE.INVESTMENT, '招商活动'],
  [NOTIFICATION_TYPE.INVITATION, '邀请入会'],
  [NOTIFICATION_TYPE.CUSTOM, '自定义通知'],
  [NOTIFICATION_TYPE.FIVEG, '5G彩信通知'],
  [NOTIFICATION_TYPE.POSTER, '节日海报'],
  [NOTIFICATION_TYPE.QUESTIONNAIRE, '问卷调查']
])
// 创建群发通知类型  show显示规则代表1是总后台 2 是商会后台 3是共有
// 通知类型options
export const NOTICE_TYPE_OPTIONS = [
  { label: '全部', value: '', show: 2 },
  { label: '缴费通知', value: 1, show: 2 },
  { label: '活动通知', value: 2, show: 3 },
  { label: '课程通知', value: 6, show: 1 },
  { label: '节日海报', value: 8, show: 3 },
  { label: '招商活动', value: 3, show: 3 },
  { label: '邀请入会', value: 4, show: 2 },
  { label: '自定义通知', value: 5, show: 3 },
  { label: '5G彩信通知', value: 7, show: 3 },
  { label: '问卷调查', value: 9, show: 3 }
]

export const NOTICE_MIFENG_TYPE_OPTIONS = [...NOTICE_TYPE_OPTIONS.filter(item => item.show !== 1)]

// 通知类型options
export const NOTICE_ADMIN_TYPE_OPTIONS = [...NOTICE_TYPE_OPTIONS.filter(item => item.show !== 2)]

export const RECEIVER_TYPE = {
  ALL: -1,
  /** 本商会会员 */
  MEMBER_SELF: 1,
  /** 指定职位 */
  POSITION_SPECIFY: 2,
  /** 指定部门 */
  DEPARMENT_SPECIFY: 3,
  /** 指定会员 */
  MEMBER_SPECIFY: 4,
  /** 指定商会会员 */
  DESIGNATE_SELF: 5,
  /** 非本会会员 指定手机号 */
  PHONE_CUSTOM: 6,
  /** 秘书处后台 */
  CLERK_BACKGROUND: 7,
  /** 秘书处前台 */
  CLERK_FRONT: 8
}
export const RECEIVER_TYPE_MAP = new Map([
  [RECEIVER_TYPE.MEMBER_SELF, '本商会会员'],
  [RECEIVER_TYPE.POSITION_SPECIFY, '指定职位'],
  [RECEIVER_TYPE.DEPARMENT_SPECIFY, '指定部门'],
  [RECEIVER_TYPE.MEMBER_SPECIFY, '指定会员'],
  [RECEIVER_TYPE.PHONE_CUSTOM, '非本会会员']
])

// 通知类型options
const RECEIVE_TYPE_OPTIONS = [
  { label: '所有会员', value: -1, show: 1 },
  { label: '指定商会会员', value: 5, show: 1 },
  { label: '指定手机号', value: 6, show: 1 },
  { label: '秘书处后台', value: 7, show: 1 },
  { label: '秘书处前台', value: 8, show: 1 },
  { label: '本商会会员', value: 1, show: 2 },
  { label: '指定职位', value: 2, show: 2 },
  { label: '指定部门', value: 3, show: 2 },
  { label: '指定会员', value: 4, show: 2 }
]

export const RECEIVE_MIFENG_TYPE_OPTIONS = [...RECEIVE_TYPE_OPTIONS.filter(item => item.show === 2)]

// 通知类型options
export const RECEIVE_ADMIN_TYPE_OPTIONS = [...RECEIVE_TYPE_OPTIONS.filter(item => item.show === 1)]

export const SYNC_CHANNELS_TYPE = {
  /** 短信 */
  TEXT_MESSAGE: 1,
  /** 订阅消息 */
  SUBSCRIBE: 2,
  /** app通知 */
  APP: 3,
  /** 应用内通知 */
  IN_APP: 4,
  /** 站内信 */
  STATION: 5,
  /** 5g短信 */
  MESSAGE_5G: 6
}

// 订阅消息类型
export const SYNC_CHANNELS_MAP = new Map([
  [SYNC_CHANNELS_TYPE.TEXT_MESSAGE, '短信'],
  [SYNC_CHANNELS_TYPE.SUBSCRIBE, '订阅消息'],
  [SYNC_CHANNELS_TYPE.APP, 'app通知'],
  [SYNC_CHANNELS_TYPE.IN_APP, '应用内通知'],
  [SYNC_CHANNELS_TYPE.STATION, '站内信']
])

export const SEND_TYPE_MAP = new Map([
  [1, ''],
  [2, '定时发送']
])
export const READ_STATUS_OPTIONS = [
  { _key: 3, title: '已读', dataIndex: 'readNum' },
  { _key: 4, title: '未读', dataIndex: 'unreadNum' }
]
export const MESSAGE_5G_OPTIONS = [
  { _key: 1, title: '发送成功', dataIndex: 'succNum' },
  { _key: 2, title: '发送失败', dataIndex: 'failNum' }
]
export const TEXT_MESSAGE_OPTIONS = [...MESSAGE_5G_OPTIONS, ...READ_STATUS_OPTIONS]
export const READ_STATUS_MAP = new Map([
  [SYNC_CHANNELS_TYPE.TEXT_MESSAGE, TEXT_MESSAGE_OPTIONS],
  [SYNC_CHANNELS_TYPE.SUBSCRIBE, READ_STATUS_OPTIONS],
  [SYNC_CHANNELS_TYPE.APP, READ_STATUS_OPTIONS],
  [SYNC_CHANNELS_TYPE.IN_APP, READ_STATUS_OPTIONS],
  [SYNC_CHANNELS_TYPE.STATION, READ_STATUS_OPTIONS],
  [SYNC_CHANNELS_TYPE.MESSAGE_5G, MESSAGE_5G_OPTIONS]
])

// 指定商会会员 商会后台用
export const CHAMBER_MEMBER_COLUMNS = [
  {
    dataIndex: 'type',
    title: '入会类型',
    customRender: ({ record: row }) => {
      return row.type === 0 ? '个人入会' : '企业入会'
    }
  },
  {
    dataIndex: 'companyName',
    title: '企业/团体名称'
  },
  {
    dataIndex: 'name',
    title: '联系人/会员姓名'
  },
  {
    dataIndex: 'phone',
    title: '手机号',
    width: 110
  },
  {
    dataIndex: 'joinedTs',
    title: '入会时间',
    width: 110
  },
  {
    dataIndex: 'postName',
    title: '会内职位'
  },
  {
    dataIndex: 'type',
    title: '所属部门',
    width: 200,
    customRender: ({ record: row }) => {
      let msg = ''
      row.memberDepartmentVOS &&
        row.memberDepartmentVOS.forEach((item, index) => {
          if (index !== row.memberDepartmentVOS.length - 1) {
            msg += item.departmentName + '、'
          } else {
            msg += item.departmentName
          }
        })
      return msg
    }
  },
  {
    dataIndex: 'status',
    title: '用户状态',
    customRender: ({ record: row }) => {
      if (row.status) {
        return row.status === 1 ? '正常' : '删除'
      } else {
        return row.status === null ? '未激活' : '冻结'
      }
    }
  }
]
export const CHAMBER_ADMIN_COLUMNS = [
  ...CHAMBER_MEMBER_COLUMNS,
  {
    dataIndex: 'id',
    title: 'ID'
  }
]

// 所有会员
export const CHAMBER_ALL_MEMBER_COLUMNS = [
  {
    dataIndex: 'uname',
    title: '姓名'
  },
  {
    dataIndex: 'phone',
    title: '手机号'
  },
  {
    dataIndex: 'chamberNames',
    title: '所属商会'
  }
]

// 指定商会会员
export const CHAMBER_ADMIN_MEMBER_COLUMNS = [
  {
    dataIndex: 'name',
    title: '商协会名称'
  },
  {
    dataIndex: 'memberCount',
    title: '会员数（人）'
  }
]

// 秘书处 前/后 台
export const CHAMBER_SECRE_MEMBER_COLUMNS = [
  {
    dataIndex: 'uname',
    title: '用户名'
  },
  {
    dataIndex: 'phone',
    title: '手机号'
  },
  {
    dataIndex: 'userType',
    title: '用户属性',
    customRender: ({ record }) => {
      return record.userType === 1 ? '会员用户' : '普通用户'
    }
  },
  {
    dataIndex: 'post',
    title: '会内职位'
  },
  {
    dataIndex: 'chamberName',
    title: '所属商会',
    width: 200
  },
  {
    dataIndex: 'companysName',
    title: '企业名称',
    customRender: ({ record }) => {
      return record.companysName && record.companysName.join()
    }
  },
  {
    dataIndex: 'platformTag',
    title: '平台标记',
    customRender: ({ record }) => {
      return record.platformTag && record.platformTag.map(v => v.tagName).join()
    }
  },
  {
    dataIndex: 'chamberTag',
    title: '商协会标记',
    customRender: ({ record }) => {
      return record.chamberTag && record.chamberTag.map(v => v.tagName).join()
    }
  }
]
export const READ_INFO_COLUMNS = [
  { dataIndex: 'id', title: 'ID', width: 180 },
  {
    dataIndex: 'uname',
    title: '姓名'
  },
  {
    dataIndex: 'phone',
    title: '手机号'
  },
  {
    dataIndex: 'chamberNames',
    title: '所属商协会'
  },
  {
    dataIndex: 'status',
    title: '状态',
    customRender: ({ record: row }) => {
      return row.readStatus === 1 ? '已读' : '未读'
    }
  }
]

export const READ_ADMIN_COLUMNS = [
  {
    dataIndex: 'remark',
    title: '姓名'
  },
  {
    dataIndex: 'username',
    title: '账号'
  },
  {
    dataIndex: 'chamberName',
    title: '商协会名称'
  },
  {
    dataIndex: 'roleName',
    title: '角色名称'
  },
  {
    dataIndex: 'status',
    title: '状态',
    customRender: row => {
      return row.readStatus === 1 ? '已读' : '未读'
    }
  }
]

export const UNREAD_SEND_STATUS = {
  ABLE: 1,
  DISABLE: 0
}

export const AUTH_STATUS = {
  ABLE: 1,
  DISABLE: 0
}

export const TEMPLATE_MAP = new Map([
  [SYNC_CHANNELS_ID.NOTE, '短信通知'],
  [SYNC_CHANNELS_ID.SUBSCRIBE, '订阅消息'],
  [SYNC_CHANNELS_ID.APP, 'APP通知']
])
