const tableColumn = [
  // {
  //   label: '序号',
  //   prop: 'serialNumber',
  //   type: 'serialNumber'
  // },
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
    imgWidth: '76px',
    imgHeight: '76px',
    url: row => {
      return row.image
    },
    urlList: row => {
      return [row.image]
    }
  },
  {
    label: '关联内容',
    prop: 'jsonContext',
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
    prop: 'operatorId',
    width: '100px',
    align: 'center',
    type: 'function',
    callback: row => {
      const statusMap = {
        0: '无效',
        1: '使用中',
        2: '冻结'
      }
      return row.status || row.status === 0 ? statusMap[row.status] : '--'
    }
  },
  {
    label: '更新时间',
    prop: 'updatedTs',
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
