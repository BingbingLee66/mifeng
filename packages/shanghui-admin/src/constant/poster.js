/**
 * 海报状态
 * 状态 0-上架，1-下架，2-删除
 *  */
export const POSTER_STATUS = {
  ON: 0, // 上架
  OFF: 1, // 下架
  DELETE: 2 // 删除
}

export const POSTER_STATUS_TEXT_MAP = new Map([
  [POSTER_STATUS.ON, '已上架'],
  [POSTER_STATUS.OFF, '已下架'],
  [POSTER_STATUS.DELETE, '删除']
])
