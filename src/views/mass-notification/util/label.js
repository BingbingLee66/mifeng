// 创建群发通知类型  show显示规则代表1是总后台 2 是商会后台 3是共有
export const labelType = [
  { n: '缴费通知', type: 1, show: 2 },
  { n: '活动通知', type: 2, show: 3 },
  { n: '招商活动', type: 3, show: 3 },
  { n: '邀请入会', type: 4, show: 2 },
  { n: '自定义通知', type: 5, show: 3 },
  { n: '5G彩信通知', type: 7, show: 3 },
]
export const receiveType = [
  { n: '所有会员', type: -1, show: 1 },
  { n: '指定商会会员', type: 5, show: 1 },
  { n: '指定手机号', type: 6, show: 1 },
  { n: '秘书处后台', type: 7, show: 1 },
  { n: '秘书处前台', type: 8, show: 1 },
  { n: '本商会会员', type: 1, show: 2 },
  { n: '指定职位', type: 2, show: 2 },
  { n: '指定部门', type: 3, show: 2 },
  { n: '指定会员', type: 4, show: 2 },
]
// form表单通知类型
// 通知列表的通知类型
export const notificationType = [
  { id: -1, name: '全部' },
  { id: 2, name: '活动通知' },
  { id: 1, name: '缴费通知' },
  { id: 4, name: '邀请入会' },
]
// 群发管理的通知类型
export const massNotificationType = [
  { id: -1, name: '全部' },
  { id: 2, name: '活动通知' },
  { id: 1, name: '缴费通知' },
  { id: 5, name: '自定义通知' },
]
// 总后台群发管理的form
export const labelTypeForm = [
  { id: -1, name: '全部' },
  { name: '缴费通知', id: 1 },
  { name: '活动通知', id: 2 },
  { name: '招商活动', id: 3 },
  { name: '邀请入会', id: 4 },
  { name: '自定义通知', id: 5 },
  { name: '酷信通知', id: 7 },
]
// 所有会员的table config
export const memberTableConfig = [
  {
    prop: 'uname',
    label: '姓名',
    width: 180,
    type: 'general',
  },
  {
    prop: 'phone',
    label: '手机号',
    width: 180,
    type: 'general',
  },
  {
    prop: 'chamberNames',
    label: '所属商协会',
    type: 'general',
  },
]

// 指定商会会员的table
export const memberCountTableConfig = [
  { type: 'selection', reserveSelection: true },
  {
    prop: 'name',
    label: '商协会名称',
    type: 'general',
  },
  {
    prop: 'memberCount',
    label: '会员数（人）',
    type: 'general',
  },
]
// 指定商会会员 商会后台用
export const memberPageListConfig = [
  { type: 'selection', reserveSelection: true },
  // {
  //   prop: 'id',
  //   label: '企业/id',
  //   type: 'general',
  //   render(h, scope) {
  //     return (<el-input value={scope.row.id}>123</el-input>)
  //   }
  // },
  {
    prop: 'type',
    label: '入会类型',
    type: 'general',
    formatter: row => {
      return row.type === 0 ? '个人入会' : '企业入会'
    },
  },
  {
    prop: 'companyName',
    label: '企业/团体名称',
    type: 'general',
  },
  {
    prop: 'name',
    label: '联系人/会员姓名',
    type: 'general',
  },
  {
    prop: 'phone',
    label: '手机号',
    type: 'general',
    width: 110
  },
  {
    prop: 'joinedTs',
    label: '入会时间',
    type: 'general',
    width: 110
  },
  {
    prop: 'postName',
    label: '会内职位',
    type: 'general'
  },
  {
    prop: 'type',
    label: '所属部门',
    type: 'general',
    formatter: row => {
      let msg = ''
      row.memberDepartmentVOS && row.memberDepartmentVOS.forEach((item, index) => { if (index !== row.memberDepartmentVOS.length - 1) { msg += item.departmentName + '、' } else { msg += item.departmentName } })
      return msg
    }
  },
  {
    prop: 'status',
    label: '用户状态',
    type: 'general',
    formatter: row => {
      if (row.status) {
        return row.status === 1 ? '正常' : '删除'
      } else {
        return row.status === null ? '未激活' : '冻结'
      }
    }
  },
]

// 工具类数据channelType
export const channelTypeList = [
  {
    id: 1,
    n: '短信'
  },
  {
    id: 2,
    n: '订阅消息'
  },
  {
    id: 3,
    n: 'app通知'
  },
  {
    id: 4,
    n: '应用内通知'
  },
  {
    id: 5,
    n: '站内信'
  },
  {
    id: 6,
    n: '酷信'
  }
]
// 群发详情弹框用
export const sendDetailChannelType = [
  { name: '4', label: '应用内通知' },
  { name: '3', label: 'app通知' },
  { name: '2', label: '订阅消息' },
  { name: '1', label: '短信' },
  { name: '5', label: '站内信' },
  { name: '6', label: '酷信' }
]
export const sendStatusList = [
  { name: '1', label: '发送成功', field: 'succNum', num: '0' },
  { name: '2', label: '发送失败', field: 'failNum', num: '0' },
  { name: '3', label: '已读', field: 'readNum', num: '0' },
  { name: '4', label: '未读', field: 'unreadNum', num: '0' },
]
export const ruleString = '申明：遵守国家的有关法规和行政规章制度。不发送任何非法的、骚扰性、中伤他人的、辱骂性的、恐吓性的、伤害性的、挑衅的、庸俗的、淫秽等内容的信息。不发送任何教唆他人构成犯罪的信息。不发送涉及国家安全、国家机密的信息。如违反引起的法律纠纷和责任由（用户）您独立承担，因此给广州凯迪云信息科技有限公司（简称“云商会”）造成损失的，应当予以赔偿'

// 秘书处 前/后 台
export const secretariatConfig = [
  { type: 'selection', reserveSelection: true },
  {
    prop: 'uname',
    label: '用户名',
    type: 'general',
  },
  {
    prop: 'phone',
    label: '手机号',
    type: 'general',
  },
  {
    prop: 'userType',
    label: '用户属性',
    type: 'general',
    formatter: row => {
      return row.userType === 1 ? '会员用户' : '普通用户'
    },
  },
  {
    prop: 'post',
    label: '会内职位',
    type: 'general',
  },
  {
    prop: 'chamberName',
    label: '所属商会',
    type: 'general',
  },
  {
    prop: 'companysName',
    label: '企业名称',
    type: 'general',
    formatter: row => {
      return row.companysName && row.companysName.join()
    },
  },
  {
    prop: 'platformTag',
    label: '平台标记',
    type: 'general',
    formatter: row => {
      return row.platformTag && row.platformTag.map(v => v.tagName).join()
    },
  },
  {
    prop: 'chamberTag',
    label: '商协会标记',
    type: 'general',
    formatter: row => {
      return row.chamberTag && row.chamberTag.map(v => v.tagName).join()
    },
  },

]

// 审核状态
export const auditStatus = {
  0: '审核中',
  1: '已通过',
  2: '未通过',
  3: '已撤回'
}
