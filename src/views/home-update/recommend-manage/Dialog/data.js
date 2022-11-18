const tableColumn = [
  {
    label: '活动ID/名称',
    prop: 'label',
    align: 'center'
  },
  {
    label: '活动列表图',
    prop: 'listImage',
    align: 'center',
    type: 'image',
    width: '156px',
    imgWidth: '130px',
    imgHeight: '60px',
    url: row => {
      return row.listImage
    },
    urlList: row => {
      return [row.listImage]
    }
  },
  {
    label: '顺序',
    prop: 'order',
    type: 'order',
    width: '100px',
    align: 'center'
  },
  {
    label: '操作',
    prop: 'operate',
    width: '100px',
    type: 'slot',
    slotName: 'operate',
    fixed: 'right',
    align: 'center'
  }
]

const tableColumn2 = [
  {
    label: '供需ID',
    prop: 'id',
    align: 'center'
  },
  {
    label: '供需标题',
    prop: 'title',
    align: 'center',
  },
  {
    label: '顺序',
    prop: 'order',
    type: 'order',
    width: '100px',
    align: 'center'
  },
  {
    label: '操作',
    prop: 'operate',
    width: '100px',
    type: 'slot',
    slotName: 'operate',
    fixed: 'right',
    align: 'center'
  }
]

const tableColumn3 = [
  {
    label: '文章ID',
    prop: 'id',
    align: 'center'
  },
  {
    label: '文章标题',
    prop: 'title',
    align: 'center',
  },
  {
    label: '顺序',
    prop: 'order',
    type: 'order',
    width: '100px',
    align: 'center'
  },
  {
    label: '操作',
    prop: 'operate',
    width: '100px',
    type: 'slot',
    slotName: 'operate',
    fixed: 'right',
    align: 'center'
  }
]

export {
  tableColumn,
  tableColumn2,
  tableColumn3
}
