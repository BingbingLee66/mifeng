const formData = {
  // 标签组名称
  memberStatus: '-1',
  // 标签名称
  platformTag: []
}

const formItem = [
  {
    label: '用户属性',
    prop: 'memberStatus',
    type: 'select',
    options: [
      { label: '全部', value: '-1' },
      { label: '商会会员', value: '1' },
      { label: '普通用户', value: '0' }
    ]
  },
  {
    label: '平台标记',
    prop: 'platformTag',
    type: 'select',
    clearable: true,
    options: [],
    multiple: true,
    filterable: true,
    collapseTags: true,
    placeholder: '请选择'
  }
]

const tableColumn = [
  {
    label: '用户名',
    prop: 'uname'
  },
  {
    label: '手机号',
    prop: 'phone'
  },
  {
    label: '用户属性',
    prop: 'userType',
    type: 'function',
    callback: row => {
      if (row.userType === 0) {
        return '普通用户'
      } else if (row.userType === 1) {
        return '商会会员'
      } else {
        return '--'
      }
    }
  },
  {
    label: '所属商协会',
    prop: 'chamberNames',
    type: 'function',
    callback: row => {
      return row.chamberNames ? row.chamberNames.join(',') : '--'
    }
  },
  {
    label: '会内职位',
    prop: 'memberPostNames'
  },
  {
    label: '企业名称',
    prop: 'companyNames',
    type: 'function',
    callback: row => {
      return row.companyNames ? row.companyNames.join(',') : '--'
    }
  },
  {
    label: '平台标记',
    prop: 'platformTag',
    type: 'slot',
    slotName: 'platformTag',
    width: '200px'
  },
  {
    label: '阅读次数',
    prop: 'readNum',
    type: 'sort'
  },
  {
    label: '最后阅读时间',
    prop: 'lastTime',
    type: 'time',
    width: '155px'
  },
  {
    label: '是否交换名片',
    prop: 'cardExChangeStatus',
    type: 'slot',
    slotName: 'cardExChangeStatus'
  },
  {
    label: '分享次数',
    prop: 'shareNum',
    type: 'slot',
    slotName: 'shareNum'
  }
]

export default {
  formItem,
  formData,
  tableColumn
}
