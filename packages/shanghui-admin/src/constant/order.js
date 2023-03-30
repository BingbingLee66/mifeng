// 订单状态
export const ORDER_STATE = {
  CANCELORDER: 0,
  TOPAID: 1,
  TOSHIPPED: 2,
  WAITGROUP: 4,
  HASPAID: 5,
  HSASHIPPED: 6
}

export const ORDER_STATE_MAP = new Map([
  [ORDER_STATE.CANCELORDER, '取消订单'],
  [ORDER_STATE.TOPAID, '待支付'],
  [ORDER_STATE.TOSHIPPED, '待发货'],
  [ORDER_STATE.WAITGROUP, '待成团'],
  [ORDER_STATE.HASPAID, '已发货'],
  [ORDER_STATE.HSASHIPPED, '已完成']
])

export const ORDER_FIGHTSTATE_MAP = new Map([
  [0, '单独购买'],
  [1, '拼单'],
  [2, '机器拼单']
])
