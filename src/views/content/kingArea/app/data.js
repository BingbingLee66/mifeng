const formObj = {
  // 金刚区名称
  name: '',
  // 创建人
  creatorName: '',
  // 创建时间
  createdTime: []
}

const formItem = [
  {
    label: '金刚区名称',
    prop: 'name',
    type: 'input',
    placeholder: '关键词',
    clearable: true
  },
  {
    label: '创建人',
    prop: 'creatorName',
    type: 'input',
    placeholder: '关键词',
    clearable: true
  },
  {
    label: '创建时间',
    prop: 'createdTime',
    type: 'date-picker',
    startPlaceholder: '开始时间',
    endPlaceholder: '结束时间'
  }
]

const tableColumn = [
  {
    label: '金刚区名称',
    prop: 'name',
  },
  {
    label: '金刚区图片',
    prop: 'image',
    type: 'image',
    imgWidth: '80px',
    imgHeight: '80px',
    url: row => {
      return row.image
    },
    urlList: row => {
      return [row.image]
    },
  },
  {
    label: '创建信息',
    prop: 'creatorName',
    type: 'operator',
    operatorName: 'creatorName',
    operatorTime: 'createdTs',
  },
  {
    label: '更新信息',
    prop: 'operatorName',
    type: 'operator',
    operatorName: 'operatorName',
    operatorTime: 'updatedTs',
  },
  {
    label: '权重',
    prop: 'weight',
    lid: 'id',
    type: 'level',
  },
  {
    label: '操作',
    prop: 'operate',
    type: 'slot',
    slotName: 'operate',
    fixed: 'right'
  },
]

export default {
  formItem,
  formObj,
  tableColumn,
}
