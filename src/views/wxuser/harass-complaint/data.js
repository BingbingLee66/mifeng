const formData = {
  // 账号ID
  fromUserId: '',
  // 账号昵称
  fromUserName: '',
  // 被投诉账号昵称
  toUserId: '',
  // 被投诉账号ID
  toUserName: '',
  // 投诉时间
  date: '',
  // 处理状态
  auditStatus: -1
}

const formItem = [
  {
    label: '账号昵称',
    prop: 'fromUserName',
    type: 'input',
    placeholder: '请输入',
    width: '200px'
  },
  {
    label: '账号ID',
    prop: 'fromUserId',
    type: 'input',
    placeholder: '请输入',
    width: '200px'
  },
  {
    label: '被投诉账号昵称',
    prop: 'toUserName',
    type: 'input',
    placeholder: '请输入',
    width: '200px'
  },
  {
    label: '被投诉账号ID',
    prop: 'toUserId',
    type: 'input',
    placeholder: '请输入',
    width: '200px'
  },
  {
    label: '投诉时间',
    prop: 'date',
    type: 'date-picker',
    clearable: true
  },
  {
    label: '处理状态',
    prop: 'auditStatus',
    type: 'select',
    width: '200px',
    options: [
      { label: '全部', value: -1 },
      { label: '未处理', value: 0 },
      { label: '已处理', value: 1 }
    ]
  }
]

const tableColumn = [
  {
    label: '投诉ID',
    prop: 'id'
  },
  {
    label: '账号昵称',
    prop: 'fromUserName',
  },
  {
    label: '账号ID',
    prop: 'fromUserId'
  },
  {
    label: '投诉时间',
    prop: 'createdTs'
  },
  {
    label: '被投诉账号ID',
    prop: 'toUserId',
  },
  {
    label: '被投诉账号昵称',
    prop: 'toUserName',
  },
  {
    label: '投诉描述',
    prop: 'content',
  },
  {
    label: '处理状态',
    prop: 'auditStatus',
    type: 'function',
    callback(row) {
      return row.auditStatus === 0 ? '未处理' : '已处理'
    }

  },
  {
    label: '处理结果',
    prop: 'auditResult',
  },
  {
    label: '操作人',
    prop: 'updator'
  },
  {
    label: '操作时间',
    prop: 'updatedTs',
    type: 'time'
  },
  {
    label: '操作',
    prop: 'operate',
    type: 'slot',
    slotName: 'operate',
    width: '200px',
    fixed: 'right'
  }
]

export default {
  formItem,
  formData,
  tableColumn
}
