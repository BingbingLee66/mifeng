const tableColumn = [
  {
    label: '序号',
    prop: 'serialNumber',
    type: 'serialNumber'
  },
  {
    label: 'id',
    prop: 'bannerId',
    width: '100px',
    align: 'center'
  },
  {
    label: '标题',
    prop: 'title',
    align: 'center'
  },
  {
    label: '图片',
    prop: 'img',
    type: 'image',
    width: '160px',
    imgWidth: '120px',
    imgHeight: '80px',
    align: 'center',
    url: row => {
      return row.img
    },
    urlList: row => {
      return [row.img]
    }
  },
  {
    label: '关联内容',
    prop: 'content',
    align: 'center'
  },
  {
    label: '轮播顺序',
    prop: 'order',
    width: '100px',
    type: 'order',
    align: 'center'
  },
  {
    label: '切换频率',
    prop: 'switchFrequence',
    width: '100px',
    align: 'center',
    type: 'function',
    callback: row => {
      return row.switchFrequence ? row.switchFrequence + 'ms' : '不切换'
    }
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
        2: '冻结',
      }
      return row.status || row.status === 0 ? statusMap[row.status] : '- -'
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
    width: '250px',
    type: 'slot',
    slotName: 'operate',
    fixed: 'right',
    align: 'center'
  }
]

export {
  tableColumn
}
