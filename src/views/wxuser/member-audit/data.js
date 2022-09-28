const formData = {
  // 商协会名称
  chamberName: '',
  // 入会名称
  name: '',
  // 申请来源
  applySource: -1,
  // 申请时间
  requestTime: '',
  // 联系人电话
  contactPhone: '',
  // 入会类型
  type: -1,
  // 审核状态
  status: -1
}

const formItem = [
  {
    label: '商协会名称',
    prop: 'chamberName',
    type: 'input'
  },
  {
    label: '入会名称',
    prop: 'name',
    type: 'input',
    clearable: true
  },
  {
    label: '申请来源',
    prop: 'applySource',
    type: 'select',
    options: [
      { label: '全部', value: -1 },
      { label: '未知', value: 0 },
      { label: '小程序会员入住', value: 1 },
      { label: '小程序商协会主页', value: 2 },
      { label: 'App会员入驻', value: 3 },
      { label: 'App商协会主页', value: 4 }
    ]
  },
  {
    label: '申请时间',
    prop: 'requestTime',
    type: 'date-picker',
    clearable: true
  },
  {
    label: '联系人电话',
    prop: 'contactPhone',
    type: 'input'
  },
  {
    label: '入会类型',
    prop: 'type',
    type: 'select',
    options: [
      { label: '全部', value: -1 },
      { label: '企业/团体入会', value: 1 },
      { label: '个人入会', value: 0 }
    ]
  },
  {
    label: '审核状态',
    prop: 'status',
    type: 'select',
    options: [
      { label: '全部', value: -1 },
      { label: '待审批', value: 0 },
      { label: '通过', value: 1 },
      { label: '驳回', value: 2 }
    ]
  }
]

const tableColumn = [
  {
    label: '商协会名称',
    prop: 'chamberName'
  },
  {
    label: '入会类型',
    prop: 'type',
    type: 'function',
    callback(row) {
      return row.type === 0 ? '个人' : '企业 / 团体入驻'
    }
  },
  {
    label: '申请来源',
    prop: 'applySource',
    type: 'function',
    callback(row) {
      return row.applySource === 0
        ? '未知'
        : row.applySource === 1
          ? '小程序会员入驻'
          : (row.applySource === 2
            ? '小程序商会主页'
            : (row.applySource === 3 ? 'app会员入驻' : 'app商会主页'))
    }
  },
  {
    label: '申请时间',
    prop: 'joinTime'
  },
  {
    label: '商会入驻状态',
    prop: 'flag',
    type: 'function',
    callback(row) {
      return row.flag === 1 ? '已入驻' : '未入驻'
    }
  },
  {
    label: '入会名称',
    prop: 'name'
  },
  {
    label: '会内职位',
    prop: 'postName'
  },
  {
    label: '个人姓名',
    prop: 'contactName'
  },
  {
    label: '联系人电话',
    prop: 'phone'
  },
  {
    label: '审核时间',
    prop: 'auditTime',
  },
  {
    label: '审核人',
    prop: 'auditor'
  },
  {
    label: '审核状态',
    prop: 'status',
    type: 'function',
    callback(row) {
      return row.status === 0 ? '未审核' : row.status === 2 ? '驳回' : '通过'
    }
  }
]
const identityFormData = {

  // 用户id
  userId: '',
  // 申请类型
  auditType: -1,
  // 申请来源
  source: -1,
  // 申请时间
  requestTime: '',
  // 机构类型
  type: -1,
  // 审核状态
  auditStatus: -1,
  // 审核时间
  approvalTime: ''
}
const identityFormItem = [
  {
    label: '用户ID',
    prop: 'userId',
    type: 'input'
  },
  {
    label: '申请类型',
    prop: 'auditType',
    type: 'select',
    options: [
      { label: '全部', value: -1 },
      { label: '未知', value: 0 },
      { label: '法人证人', value: 1 },
      { label: '企业微信认证', value: 2 },
      { label: '钉钉认证', value: 3 },
      { label: '工牌认证', value: 4 },
      { label: '邀请商协会认证', value: 5 }
    ],
    clearable: true
  },
  {
    label: '申请来源',
    prop: 'source',
    type: 'select',
    options: [
      { label: '全部', value: -1 },
      { label: '未知', value: 0 },
      { label: '微信小程序', value: 1 },
      { label: 'APP', value: 2 },
      { label: 'IOS', value: 3 },
    ]
  },
  {
    label: '申请时间',
    prop: 'requestTime',
    type: 'date-picker',
    clearable: true
  },
  {
    label: '机构类型',
    prop: 'type',
    type: 'select',
    options: [
      { label: '全部', value: -1 },
      { label: '商业机构', value: 1 },
      { label: '非商业机构', value: 2 },
    ]
  },
  {
    label: '审核状态',
    prop: 'auditStatus',
    type: 'select',
    options: [
      { label: '全部', value: -1 },
      { label: '待审核', value: 0 },
      { label: '通过', value: 1 },
      { label: '未通过', value: 2 }
    ]
  },
  {
    label: '审核时间',
    prop: 'approvalTime',
    type: 'date-picker',
    clearable: true
  }
]
const identityTableColumn = [
  {
    label: '用户ID',
    prop: 'userId'
  },
  {
    label: '用户名',
    prop: 'uname'
  },
  {
    label: '申请来源',
    prop: 'source',
    type: 'function',
    callback(row) {
      return row.source === 0
        ? '未知'
        : row.source === 1
          ? '微信小程序'
          : (row.source === 2
            ? '安卓APP'
            : (row.source === 3 ? '苹果APP' : 'PC端'))
    }
  },
  {
    label: '申请时间',
    prop: 'createdTs',
  },
  {
    label: '申请类型',
    prop: 'type',
    type: 'function',
    callback(row) {
      return row.type === 1
        ? '法人证人'
        : row.type === 2
          ? '企业微信认证'
          : (row.type === 3
            ? '钉钉认证'
            : (row.type === 4 ? '工牌认证' : '邀请商协会认证'))
    }
  },
  {
    label: '机构类型',
    prop: 'orgType',
    type: 'function',
    callback(row) {
      return row.orgType === 1 ? '商业机构' : '非商业机构'
    }
  },
  {
    label: '审核状态',
    prop: 'auditStatus',
    type: 'function',
    callback(row) {
      return row.auditStatus === 0 ? '待审核' : row.auditStatus === 1 ? '通过' : '未通过'
    }
  },
  {
    label: '审核时间',
    prop: 'auditTs',
  },
  {
    label: '审核人',
    prop: 'operator'
  },
  {
    label: '操作',
    prop: 'operate',
    type: 'slot',
    slotName: 'operate',
    width: '180px'
  }
]
const rejectOptions = [
  {
    value: '选2',
    label: '实名信息与营业执照信息不符'
  },
  {
    value: '选3',
    label: '提交的机构信息与营业执照信息不符'
  },
  {
    value: '选4',
    label: '工牌信息与实名信息不符'
  },
  {
    value: '选5',
    label: '工牌信息与提交的机构信息不符'
  },
  {
    value: '选6',
    label: '提交的身份信息与入会信息不符'
  },
]
export default {
  formItem,
  formData,
  tableColumn,
  identityFormData,
  identityFormItem,
  identityTableColumn,
  rejectOptions
}
