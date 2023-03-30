export const EXPLODE_GOODS_TYPE = {
  /** 全部商品 */
  ALL: 1,
  /** 正在抢购 */
  SNAPPING: 2,
  /** 即将开售 */
  SALE: 3
}
export const APPLY_OBJECT_MAP = new Map([
  [EXPLODE_GOODS_TYPE.ALL, '全部商品'],
  [EXPLODE_GOODS_TYPE.MEMBER, '正在抢购'],
  [EXPLODE_GOODS_TYPE.POST, '即将开售']
])

export const GOODS_LIST = [
  { value: -1, label: '所有' },
  { value: 1, label: '在售中' },
  { value: 6, label: '已下架' },
  { value: 2, label: '商会下架' },
  { value: 5, label: '已售罄' }
]

export const GOODS_STATUS_TYPE = {
  /** 在售中 */
  ONSALE1: 1,
  ONSALE2: 3,
  /** 下架 */
  TAKEDOWN: 5,
  /** 商会下架 */
  CHAMBER_DOWN1: 2,
  CHAMBER_DOWN2: 4
}
export const GOODS_STATUS_MAP = new Map([
  [GOODS_STATUS_TYPE.ONSALE1, '在售中'],
  [GOODS_STATUS_TYPE.ONSALE2, '在售中'],
  [GOODS_STATUS_TYPE.CHAMBER_DOWN1, '商会下架'],
  [GOODS_STATUS_TYPE.CHAMBER_DOWN2, '商会下架'],
  [GOODS_STATUS_TYPE.TAKEDOWN, '下架']
])

export const DEVICE_TYPE = {
  /** 小程序 */
  MINIPROGRAM: '1',
  /** APP */
  APP: '2'
}
export const CLIENT_TYPE = {
  /** 小程序 */
  MINIPROGRAM: 0,
  /** APP */
  APP: 1
}
export const TAB_STATUS_TYPE = {
  /** 隐藏 */
  HIDDEN: '0',
  /** 使用中 */
  USING: '1',
  /** 删除 */
  DELETE: '2'
}
export const TAB_STATUS_MAP = new Map([
  [TAB_STATUS_TYPE.HIDDEN, '隐藏'],
  [TAB_STATUS_TYPE.USING, '使用中'],
  [TAB_STATUS_TYPE.DELETE, '删除']
])

export const BANNER_STATUS_TYPE = {
  /** 删除 */
  DELETE: 0,
  /** 使用中 */
  USING: 1,
  /** 冻结 */
  FREEZE: 2
}
export const BANNER_STATUS_MAP = new Map([
  [BANNER_STATUS_TYPE.FREEZE, '冻结'],
  [BANNER_STATUS_TYPE.USING, '使用中'],
  [BANNER_STATUS_TYPE.DELETE, '删除']
])

export const POSITION_STATUS_TYPE = {
  /** 轮播推荐 */
  CAROUSEL: 1,
  /** 内容推荐 */
  CONTENT: 2,
  /** 内容推荐卡片 */
  CARD: 3
}
export const POSITION_STATUS_MAP = new Map([
  [POSITION_STATUS_TYPE.CAROUSEL, '轮播推荐'],
  [POSITION_STATUS_TYPE.CONTENT, '内容推荐'],
  [POSITION_STATUS_TYPE.CARD, '内容推荐卡片']
])

export const KINGKONG_STATUS_TYPE = {
  /** 删除 */
  DELETE: 0,
  /** 使用中 */
  USING: 1,
  /** 冻结 */
  FREEZE: 2
}
export const KINGKONG_STATUS_MAP = new Map([
  [KINGKONG_STATUS_TYPE.DELETE, '删除'],
  [KINGKONG_STATUS_TYPE.USING, '使用中'],
  [KINGKONG_STATUS_TYPE.FREEZE, '冻结']
])
