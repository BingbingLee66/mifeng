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
