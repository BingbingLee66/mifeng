const tableColumn = [
  {
    label: '序号',
    prop: 'serialNumber',
    type: 'serialNumber'
  },
  {
    label: 'id',
    prop: 'id',
    width: '100px',
    align: 'center'
  },
  {
    label: '入口名称',
    prop: 'name',
    align: 'center'
  },
  {
    label: '入口icon',
    prop: 'image',
    type: 'image',
    width: '130px',
    align: 'center',
    url: row => {
      return row.image
    },
    urlList: row => {
      return [row.image]
    }
  },
  {
    label: '关联内容',
    prop: 'url',
    align: 'center'
  },
  {
    label: '顺序',
    prop: 'order',
    width: '100px',
    type: 'order',
    align: 'center'
  },
  {
    label: '状态',
    prop: 'labels',
    width: '100px',
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
