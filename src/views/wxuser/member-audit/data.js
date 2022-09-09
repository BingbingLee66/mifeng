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
    callback: function(row, prop) {
      return row.type === 0 ? '个人' : '企业 / 团体入驻'
    }
  },
  {
    label: '申请来源',
    prop: 'applySource',
    type: 'function',
    callback: function(row, prop) {
      return row.type === 0
        ? '未知'
        : row.type === '1'
          ? '小程序会员入驻'
          : (row.type === '2'
            ? '小程序商会主页'
            : (row.type === '3' ? 'app会员入驻' : 'app商会主页'))
    }
  },
  {
    label: '申请时间',
    type: 'time',
    prop: 'joinTime'
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
    type: 'time'
  },
  {
    label: '审核人',
    prop: 'auditor'
  },
  {
    label: '审核状态',
    prop: 'status',
    type: 'function',
    callback: function(row, prop) {
      return row.status === 0 ? '未审核' : row.status === 2 ? '驳回' : '通过'
    }
  }
]

export default {
  formItem,
  formData,
  tableColumn
}
