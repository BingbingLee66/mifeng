const tableColumn = [
  {
    label: 'ID',
    prop: 'id',
    align: 'center'
  },
  {
    label: '推荐位',
    prop: 'position',
    align: 'center',
    type: 'function',
    callback(row) {
      const positionMap = {
        1: '轮播推荐',
        2: '内容推荐',
        3: '内容推荐卡片'
      }
      return positionMap[row.position]
    }
  },
  {
    label: '可推荐内容类型',
    prop: 'optionalType',
    align: 'center'
  },
  {
    label: '当前使用内容',
    prop: 'contentStr',
    align: 'center'
  },
  {
    label: '状态',
    prop: 'status',
    align: 'center',
    type: 'function',
    callback(row) {
      const statusMap = {
        0: '隐藏',
        1: '使用中',
        2: '冻结'
      }
      return row.status || row.status === 0 ? statusMap[row.status] : '- -'
    }
  },
  {
    label: '更新时间',
    prop: 'updateTs',
    width: '160px',
    align: 'center'
  },
  {
    label: '操作人',
    prop: 'operatorStr',
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
