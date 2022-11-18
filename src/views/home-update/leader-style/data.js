const tableColumn = [
  {
    label: '序号',
    prop: 'serialNumber',
    type: 'serialNumber'
  },
  {
    label: 'ID',
    prop: 'id',
    align: 'center'
  },
  {
    label: '领导名称',
    prop: 'name',
    align: 'center'
  },
  {
    label: '会内职务',
    prop: 'url',
    align: 'center'
  },
  {
    label: '顺序',
    prop: 'order',
    type: 'order',
    align: 'center'
  },
  {
    label: '状态',
    prop: 'labels',
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
