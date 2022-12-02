const tableColumn = [
  {
    label: '序号',
    prop: 'serialNumber',
    type: 'serialNumber'
  },
  {
    label: 'id',
    prop: 'kingKongId',
    width: '100px',
    align: 'center'
  },
  {
    label: '入口名称',
    prop: 'title',
    align: 'center'
  },
  {
    label: '入口icon',
    prop: 'icon',
    type: 'image',
    width: '130px',
    align: 'center',
    imgWidth: '76px',
    imgHeight: '76px',
    url: row => {
      return row.icon
    },
    urlList: row => {
      return [row.icon]
    }
  },
  {
    label: '关联内容',
    prop: 'content',
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
    prop: 'status',
    width: '100px',
    align: 'center',
    type: 'function',
    callback: row => {
      const statusMap = {
        0: '删除',
        1: '使用中',
        2: '冻结'
      }
      return row.status || row.status === 0 ? statusMap[row.status] : '--'
    }
  },
  {
    label: '更新时间',
    prop: 'updateTs',
    type: 'time',
    width: '160px',
    align: 'center'
  },
  {
    label: '操作人',
    prop: 'updaterName',
    width: '160px',
    align: 'center'
  },
  {
    label: '操作',
    prop: 'operate',
    width: '200px',
    type: 'slot',
    slotName: 'operate',
    fixed: 'right',
    align: 'center'
  }
]

export default {
  tableColumn
}
