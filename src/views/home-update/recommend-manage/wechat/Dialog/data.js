const tableColumn = [
  {
    label: '活动ID/名称',
    prop: 'label'
  },
  {
    label: '活动列表图',
    prop: 'contentImg',
    align: 'center',
    type: 'image',
    width: '156px',
    imgWidth: '130px',
    imgHeight: '60px',
    url: row => {
      return row.contentImg
    },
    urlList: row => {
      return [row.contentImg]
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

const tableColumn1 = [
  {
    label: '活动ID/名称',
    prop: 'label',
  },
  {
    label: '活动列表图',
    prop: 'contentImg',
    align: 'center',
    type: 'image',
    imgWidth: '130px',
    imgHeight: '60px',
    url: row => {
      return row.contentImg
    },
    urlList: row => {
      return [row.contentImg]
    }
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
    prop: 'contentTitle',
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
    prop: 'contentTitle',
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

const tableColumn4 = [
  {
    label: '文章ID',
    prop: 'id',
    align: 'center'
  },
  {
    label: '文章标题',
    prop: 'contentTitle',
    align: 'center',
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

const tableColumn5 = [
  {
    label: '文章ID',
    prop: 'id',
    align: 'center',
    width: '200px',
  },
  {
    label: '文章标题',
    prop: 'contentTitle',
    align: 'center',
  }
]

const tableColumn6 = [
  {
    label: '供需ID/文章ID',
    prop: 'id',
    align: 'center',
    width: '200px',
  },
  {
    label: '供需标题/文章标题',
    prop: 'contentTitle',
    align: 'center',
  }
]

export {
  tableColumn,
  tableColumn1,
  tableColumn2,
  tableColumn3,
  tableColumn4,
  tableColumn5,
  tableColumn6
}
