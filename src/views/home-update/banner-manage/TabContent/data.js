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
    label: '标题',
    prop: 'title',
    align: 'center'
  },
  {
    label: '图片',
    prop: 'img',
    type: 'image',
    width: '150px',
    imgWidth: '120px',
    imgHeight: '60px',
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
    prop: 'type',
    align: 'center',
    type: 'function',
    callback: row => {
      const typeMap = {
        1: '文章',
        2: '商品',
        3: '邀请有礼',
      }
      return row.type ? typeMap[row.type] : '- -'
    }
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
        1: '正常',
        0: '冻结',
      }
      return row.status || row.status === 0 ? statusMap[row.status] : '- -'
    }
  },
  {
    label: '更新时间',
    prop: 'createdTs',
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

export {
  tableColumn
}
