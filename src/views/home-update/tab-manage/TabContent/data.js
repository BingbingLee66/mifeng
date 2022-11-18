const tableColumn = [
  {
    label: 'ID',
    prop: 'id',
    align: 'center'
  },
  {
    label: '栏目名称',
    prop: 'name',
    align: 'center'
  },
  {
    label: '顺序',
    prop: 'order',
    type: 'order',
    align: 'center'
  },
  {
    label: '默认选中',
    prop: 'switch',
    type: 'switch',
    align: 'center'
  },
  {
    label: '状态',
    prop: 'labels',
    align: 'center'
  },
  {
    label: '更新时间',
    prop: 'createdTs',
    type: 'time',
    width: '160px',
    align: 'center'
  },
  {
    label: '操作人',
    prop: 'creatorName',
    width: '160px',
    align: 'center'
  },
  {
    label: '操作',
    prop: 'operate',
    width: '250px',
    type: 'slot',
    slotName: 'operate',
    fixed: 'right',
    align: 'center'
  }
]

export default {
  tableColumn
}
