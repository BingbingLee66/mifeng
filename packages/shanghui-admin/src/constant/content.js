// 新闻爬虫
export const CRAWLER_TYPE = {
  COLLRCTION: 1,
  RECYCLE: 2
}

export const CRAWLER_CLOUMN = ['回收时间', '操作人']

export const CRAWLER_PUBLISH_STATUS = {
  IMMEDIATE: 1,
  TIMING: 4
}

// 内容审核
export const CONTENTAUDIT_TYPE = {
  ARTICLE: 1,
  SHARE: 2,
  COMPANDYNAMIC: 3,
  COMPANWEBSITE: 4,
  COMMENT: 5
}

export const COLUMND_TITLE_TYPE_MAP = new Map([
  [1, '企业简介'],
  [2, '发展历程'],
  [3, '荣誉资质'],
  [4, '联系我们']
])

export const COLUMND_DYNAMIC_TYPE_MAP = new Map([
  [1, '图文动态'],
  [2, '视频动态']
])

export const COLUMND_AUDIT_STATUS_MAP = new Map([
  [0, '待审核'],
  [1, '审核通过'],
  [2, '审核不通过']
])

export const REJECT_RADIO_TYPE = {
  CONTENTERROR: '内容违规',
  ADS: '广告',
  OTHER: '其他'
}

export const PASS_STATE_TYPE = {
  NOHASREAD: 0,
  PASS: 1,
  NOPASS: 2
}

// 总后台新增栏目
export const SETUP_TYPEURL_MAP = new Map([
  [1, '标签聚合页'],
  [2, '合作商会'],
  [3, '标签聚合页与合作商会'],
  [4, 'tab页']
])

export const SETUP_STSTUE_TYPEY = {
  FRIOEN: 0,
  NORMAL: 1
}

export const ARTICLE_STATUS_OPT = [
  { value: -1, label: '所有' },
  { value: 1, label: '已发布' },
  { value: 0, label: '已冻结(商会)' },
  { value: 3, label: '已冻结(平台)' },
  { value: 5, label: '审核不通过' },
  { value: 4, label: '定时发布' }
]

export const WORD_STATUS = [
  { value: '', label: '所有' },
  { value: 1, label: '已绑定' },
  { value: 0, label: '未绑定' }
]

export const TIME_STATUS = [
  { value: 0, label: '所有' },
  { value: 1, label: '24小时内' },
  { value: 2, label: '3天内' },
  { value: 3, label: '7天内' },
  { value: 4, label: '一个月内' }
]

// 文章编辑台
export const EDITOR_TYPE = {
  ARTICE: 1
}

export const EDITOR_STATUS_MAP = new Map([
  [0, '商会已冻结'],
  [1, '已发布'],
  [5, '审核不通过'],
  [3, '平台已冻结'],
  [4, '定时发布']
])

export const EDITOR_STATUS_COLOR_MAP = new Map([
  [0, 'warning'],
  [1, 'success'],
  [5, 'error'],
  [3, 'warning'],
  [4, 'success']
])

export const EDITOR_STATUS_TYPE = {
  COMFROZEN: 0,
  PUBLISHED: 1,
  PLAFROZEN: 3,
  TIMEING: 4,
  NOPASS: 5
}
export const StatusList = [
  {
    label: '全部',
    value: -1
  },
  {
    label: '已发布',
    value: 1
  },
  {
    label: '商会已冻结',
    value: 0
  },
  {
    label: '平台已冻结',
    value: 3
  },
  {
    label: '定时发布',
    value: 4
  },
  {
    label: '审核不通过',
    value: 5
  }
]

// 文章更新tab页
export const CHAMBER_TAB = {
  article: 5, // 商会文章
  about: 6, // 关于商会
  honor: 8 // 商会荣誉
}
// 文章不可编辑
export const DISABLE_Edit_ARTICLE = 1
// 文章状态
export const ARTICLE_STATUS = {
  freezeByChamber: 0,
  normal: 1,
  normalSetTime: 4, // 定时发布
  freezeByPlatform: 3
}
// 文章通过状态
export const ARTICLE_AUDITSTATYUS = {
  passedByChamber: 0,
  passedByPlatform: 1,
  noPassByChamber: 2,
  noPassedByPlatform: 3
}
// 文章编辑上传图片数量
export const YSH_COVERIMG_NUM = {
  none: 0,
  one: 1,
  three: 2
}
// 文章栏目状态
export const Column_STATUS = {
  freeze: 0,
  normal: 1,
  fixed: 3 // 固定栏目
}
