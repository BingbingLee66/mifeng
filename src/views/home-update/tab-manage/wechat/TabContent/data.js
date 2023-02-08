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
    prop: 'changeStatus',
    type: 'switch',
    align: 'center'
  },
  {
    label: '状态',
    prop: 'status',
    align: 'center',
    width: '160px',
    type: 'function',
    callback: row => {
      const statusMap = {
        0: '隐藏',
        1: '使用中',
        2: '删除'
      }
      if (row.changeStatus) {
        return '默认选中'
      } else {
        return row.status ? statusMap[row.status] : '- -'
      }
    }
  },
  {
    label: '更新时间',
    prop: 'updatedTs',
    width: '160px',
    align: 'center'
  },
  {
    label: '操作人',
    prop: 'operator',
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
