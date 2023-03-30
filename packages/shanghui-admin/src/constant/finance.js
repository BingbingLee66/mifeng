export const STATUS_LIST = [
  { value: -1, label: '全部' },
  { value: 1, label: '待财务付款' },
  { value: 2, label: '财务已付款' }
]

export const STATUS_TYPE_MAP = new Map([
  [0, '待商务确认'],
  [1, '待财务付款'],
  [2, '合作商会'],
  [3, '财务已付款']
])
