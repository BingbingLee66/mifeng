import request from '@/utils/request'
const accessSecret = 'affb6fa2180648d7b584d3c46406e846'
console.log(process.env.VUE_APP_ACCESS_SECRET)
// 最近推荐的词条
export const recommendLexicalRecently = params => request({
  url: '/api/ec/bossin-content/recommendRecently',
  method: 'post',
  data: { ...params, accessSecret }
})

// 商会相关词条
export const queryChamberLexical = params => request({
  url: '/api/ec/bossin-content/getChamberRelevantEntry',
  method: 'post',
  data: { ...params, accessSecret }
})

// 词条名搜索
export const queryEntryList = params => request({
  url: `/api/ec/bossin-content/getEntryList?accessSecret=${accessSecret}&encyclopediaName=${params.encyclopediaName}&page=${params.page}&limit=${params.limit}`,
  method: 'post'
})

// 绑定内容与词条关联
export const bindContentWithEntry = params => request({
  url: '/api/ec/bossin-content/bindContentWithEntry',
  method: 'post',
  data: { ...params, accessSecret }
})

// 获取内容关联的词条
export const queryRelatedEntryList = params => request({
  url: '/api/ec/bossin-content/getRelatedEntryList',
  method: 'post',
  data: { ...params, accessSecret }
})
