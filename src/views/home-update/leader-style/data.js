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
    prop: 'leaderName',
    align: 'center'
  },
  {
    label: '会内职务',
    prop: 'postName',
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
    prop: 'showStatus',
    align: 'center',
    type: 'function',
    callback: row => {
      const statusMap = {
        0: '隐藏',
        1: '展示',
      }
      return row.showStatus || row.showStatus === 0 ? statusMap[row.showStatus] : '- -'
    }
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
