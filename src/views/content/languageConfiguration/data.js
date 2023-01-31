const tableColumn1 = [
  {
    label: '序号',
    prop: 'serialNumber',
    type: 'serialNumber',
    width: '100px',
  },
  {
    label: 'ID',
    prop: 'id',
    align: 'center',
    width: '120px',
  },
  {
    label: '语言内容',
    prop: 'name',
    align: 'center',
  },
  {
    label: '使用场景',
    prop: 'scene',
    align: 'center',
    width: '160px',
    type: 'function',
    callback: row => {
      const statusMap = {
        0: '会内好友',
        1: '我的好友',
        2: '好友',
      }
      return row.scene ? statusMap[row.scene] : '- -'
    }
  },
  {
    label: '一键打招呼',
    prop: 'changeStatus',
    type: 'switch',
    align: 'center',
    width: '200px',
  },
  {
    label: '状态',
    prop: 'status',
    align: 'center',
    width: '160px',
    type: 'function',
    callback: row => {
      const statusMap = {
        0: '使用中',
        1: '冻结',
        2: '删除',
      }
      if (row.changeStatus) {
        return '默认选中'
      } else {
        return row.status ? statusMap[row.status] : '- -'
      }
    }
  },
  {
    label: '更新时间',
    prop: 'updatedTs',
    width: '250px',
    align: 'center'
  },
  {
    label: '操作人',
    prop: 'operator',
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
    prop: 'serialNumber',
    type: 'serialNumber',
    width: '100px',
  },
  {
    label: 'ID',
    prop: 'id',
    align: 'center',
    width: '120px',
  },
  {
    label: '语言内容',
    prop: 'name',
    align: 'center',
  },
  {
    label: '使用场景',
    prop: 'scene',
    align: 'center',
    width: '200px',
    type: 'function',
    callback: row => {
      const statusMap = {
        0: '会内好友',
        1: '我的好友',
        2: '好友',
      }
      return row.scene ? statusMap[row.scene] : '- -'
    }
  },
  {
    label: '状态',
    prop: 'status',
    align: 'center',
    width: '200px',
    type: 'function',
    callback: row => {
      const statusMap = {
        0: '使用中',
        1: '冻结',
        2: '删除',
      }
      if (row.changeStatus) {
        return '默认选中'
      } else {
        return row.status ? statusMap[row.status] : '- -'
      }
    }
  },
  {
    label: '更新时间',
    prop: 'updatedTs',
    width: '250px',
    align: 'center'
  },
  {
    label: '操作人',
    prop: 'operator',
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
    prop: 'serialNumber',
    type: 'serialNumber',
    width: '100px',
  },
  {
    label: 'ID',
    prop: 'id',
    align: 'center',
    width: '120px',
  },
  {
    label: '语言内容',
    prop: 'name',
    align: 'center',
  },
  {
    label: '权重',
    prop: 'weight',
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
        0: '使用中',
        1: '冻结',
        2: '删除',
      }
      if (row.changeStatus) {
        return '默认选中'
      } else {
        return row.status ? statusMap[row.status] : '- -'
      }
    }
  },
  {
    label: '更新时间',
    prop: 'updatedTs',
    width: '250px',
    align: 'center'
  },
  {
    label: '操作人',
    prop: 'operator',
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
    prop: 'serialNumber',
    type: 'serialNumber',
    width: '100px',
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
        0: '使用中',
        1: '冻结',
        2: '删除',
      }
      if (row.changeStatus) {
        return '默认选中'
      } else {
        return row.status ? statusMap[row.status] : '- -'
      }
    }
  },
  {
    label: '更新时间',
    prop: 'updatedTs',
    width: '250px',
    align: 'center'
  },
  {
    label: '操作人',
    prop: 'operator',
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
