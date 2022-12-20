// ORIGIN_OPTION
export const ORIGIN_TYPE = {
  ALL: 0,
  ARTICLE: 1,
  ACTIVITY: 2,
  CHAMBER: 3
}
export const ORIGIN_MAP = [
  [ORIGIN_TYPE.ALL, '全部'],
  [ORIGIN_TYPE.ARTICLE, '文章'],
  [ORIGIN_TYPE.ACTIVITY, '活动'],
  [ORIGIN_TYPE.CHAMBER, '商会主页']
]
export const ORIGIN_OPTION = [

  { label: '全部', value: ORIGIN_TYPE.ALL },
  { label: '文章', value: ORIGIN_TYPE.ARTICLE },
  { label: '活动', value: ORIGIN_TYPE.ACTIVITY },
  { label: '商会主页', value: ORIGIN_TYPE.CHAMBER },

]
