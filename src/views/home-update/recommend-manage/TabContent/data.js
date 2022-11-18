const tableColumn = [
  {
    label: 'ID',
    prop: 'id',
    align: 'center'
  },
  {
    label: '推荐位',
    prop: 'name',
    align: 'center'
  },
  {
    label: '可推荐内容类型',
    prop: 'type',
    align: 'center',

  },
  {
    label: '当前使用内容',
    prop: 'content',
    align: 'center',
    type: 'function',
    callback(row) {
      const contentMap = {
        1: '活动',
        2: '供需',
        3: '资讯'
      }
      return contentMap[row.content]
    }
  },
  {
    label: '状态',
    prop: 'status',
    align: 'center',
    type: 'function',
    callback(row) {
      const statusMap = {
        1: '使用中',
        2: '隐藏',
        3: '使用中'
      }
      return statusMap[row.status]
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
    prop: 'updateName',
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
