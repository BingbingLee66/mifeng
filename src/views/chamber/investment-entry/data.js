const tableColumn = [
  {
    label: '序号',
    prop: 'serialNumber',
    type: 'serialNumber',
    align: 'center'
  },
  {
    label: '姓名',
    prop: 'name',
    align: 'center',
    width: 150
  },
  {
    label: '手机号码',
    prop: 'phone',
    align: 'center',
    width: 120
  },
  {
    label: '公司名称',
    prop: 'company',
    align: 'center',
    width: 150
  },
  {
    label: '供货品类',
    prop: 'supplyCategory',
    align: 'center',
    width: 120
  },
  {
    label: '手填商协会',
    prop: 'fillChamberName',
    align: 'center',
    width: 150
  },
  {
    label: '所属商协会',
    prop: 'chamberNames',
    type: 'slot',
    slotName: 'chamber',
    align: 'center'
  },
  {
    label: '提交时间',
    prop: 'createdTs',
    align: 'center',
    type: 'time',
    width: 160
  }
]

export default {
  tableColumn
}
