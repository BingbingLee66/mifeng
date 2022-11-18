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
    prop: 'columnName',
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
    align: 'center',
    width: '160px',
    type: 'function',
    callback: row => {
      const statusMap = {
        1: '正常',
        0: '冻结'
      }
      return row.status || row.status === 0 ? statusMap[row.status] : ''
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
    prop: 'updater',
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
