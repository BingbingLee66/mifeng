const tableColumn1 = [
  {
    label: '序号',
    prop: 'serialNum',
    width: '100px',
    align: 'center',
  },
  {
    label: 'ID',
    prop: 'id',
    align: 'center',
    width: '120px',
  },
  {
    label: '语言内容',
    prop: 'content',
    align: 'center',
    width: '360px',
  },
  {
    label: '使用场景',
    prop: 'usageSceneName',
    align: 'center',
    width: '160px',
  },
  {
    label: '一键打招呼',
    prop: 'oneClickGreet',
    type: 'slot',
    slotName: 'switch',
    align: 'center',
    width: '200px',
  },
  {
    label: '状态',
    prop: 'status',
    align: 'center',
    // width: '160px',
    type: 'function',
    callback: row => {
      const statusMap = {
        0: '冻结',
        1: '使用中',
        2: '已删除',
      }
      return statusMap[row.status]
    }
  },
  {
    label: '更新时间',
    prop: 'updatedTs',
    width: '250px',
    type: 'time',
    align: 'center'
  },
  {
    label: '操作人',
    prop: 'operatorName',
    align: 'center'
  },
  {
    label: '操作',
    prop: 'operate',
    width: '320px',
    type: 'slot',
    slotName: 'operate',
    fixed: 'right',
    align: 'center'
  }
]

const tableColumn2 = [
  {
    label: '序号',
    prop: 'serialNum',
    width: '100px',
    align: 'center',
  },
  {
    label: 'ID',
    prop: 'id',
    align: 'center',
    width: '120px',
  },
  {
    label: '语言内容',
    prop: 'content',
    align: 'center',
  },
  {
    label: '使用场景',
    prop: 'usageSceneName',
    align: 'center',
    width: '160px',
  },
  {
    label: '状态',
    prop: 'status',
    align: 'center',
    width: '160px',
    type: 'function',
    callback: row => {
      const statusMap = {
        0: '冻结',
        1: '使用中',
        2: '已删除',
      }
      return statusMap[row.status]
    }
  },
  {
    label: '更新时间',
    prop: 'updatedTs',
    width: '250px',
    type: 'time',
    align: 'center'
  },
  {
    label: '操作人',
    prop: 'operatorName',
    align: 'center'
  },
  {
    label: '操作',
    prop: 'operate',
    width: '350px',
    type: 'slot',
    slotName: 'operate',
    fixed: 'right',
    align: 'center'
  }
]

const tableColumn3 = [
  {
    label: '序号',
    prop: 'serialNum',
    width: '100px',
    align: 'center',
  },
  {
    label: 'ID',
    prop: 'id',
    align: 'center',
    width: '120px',
  },
  {
    label: '语言内容',
    prop: 'content',
    align: 'center',
  },
  {
    label: '权重',
    prop: 'level',
    align: 'center',
    width: '160px',
  },
  {
    label: '状态',
    prop: 'status',
    align: 'center',
    width: '160px',
    type: 'function',
    callback: row => {
      const statusMap = {
        0: '冻结',
        1: '使用中',
        2: '已删除',
      }
      return statusMap[row.status]
    }
  },
  {
    label: '更新时间',
    prop: 'updatedTs',
    width: '250px',
    type: 'time',
    align: 'center'
  },
  {
    label: '操作人',
    prop: 'operatorName',
    align: 'center',
    width: '160px'
  },
  {
    label: '操作',
    prop: 'operate',
    type: 'slot',
    slotName: 'operate',
    fixed: 'right',
    align: 'center'
  }
]

const tableColumn4 = [
  {
    label: '序号',
    prop: 'serialNum',
    width: '100px',
    align: 'center',
  },
  {
    label: 'ID',
    prop: 'id',
    align: 'center',
    width: '120px',
  },
  {
    label: '场景名称',
    prop: 'name',
    align: 'center',
  },
  {
    label: '状态',
    prop: 'status',
    align: 'center',
    width: '160px',
    type: 'function',
    callback: row => {
      const statusMap = {
        0: '未使用',
        1: '使用中',
        2: '已删除',
      }
      return statusMap[row.status]
    }
  },
  {
    label: '更新时间',
    prop: 'updatedTs',
    width: '250px',
    type: 'time',
    align: 'center'
  },
  {
    label: '操作人',
    prop: 'operatorName',
    align: 'center',
    width: '160px'
  },
  {
    label: '操作',
    prop: 'operate',
    type: 'slot',
    slotName: 'operate',
    fixed: 'right',
    align: 'center'
  }
]

export {
  tableColumn1,
  tableColumn2,
  tableColumn3,
  tableColumn4
}
