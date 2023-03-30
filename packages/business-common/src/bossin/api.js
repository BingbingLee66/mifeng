import request from '@/utils/request'
const accessSecret =
  process.env.VUE_APP_ACCESS_SECRET && process.env.VUE_APP_ACCESS_SECRET === 'production'
    ? 'affb6fa2180648d7b584d3c46406e846'
    : '0ca78fd724ec45ae8d627998a5f252c0'
// 最近推荐的词条
export const recommendLexicalRecently = params =>
  request({
    url: '/ecservice/api/ec/bossin-content/recommendRecently',
    method: 'post',
    data: { ...params, accessSecret },
    hiddenError: true,
    hiddenSuccess: true
  })

// 商会相关词条
export const queryChamberLexical = params =>
  request({
    url: '/ecservice/api/ec/bossin-content/getChamberRelevantEntry',
    method: 'post',
    data: { ...params, accessSecret },
    hiddenError: true,
    hiddenSuccess: true
  })

// 词条名搜索
export const queryEntryList = params =>
  request({
    url: `/ecservice/api/ec/bossin-content/getEntryList?accessSecret=${accessSecret}&encyclopediaName=${params.encyclopediaName}&page=${params.page}&limit=${params.limit}`,
    method: 'post',
    hiddenError: true,
    hiddenSuccess: true
  })

// 绑定内容与词条关联
export const bindContentWithEntry = params =>
  request({
    url: '/ecservice/api/ec/bossin-content/bindContentWithEntry',
    method: 'post',
    data: { ...params, accessSecret },
    hiddenError: true,
    hiddenSuccess: true
  })

// 获取内容关联的词条
export const queryRelatedEntryList = params =>
  request({
    url: '/ecservice/api/ec/bossin-content/getRelatedEntryList',
    method: 'post',
    data: { ...params, accessSecret },
    hiddenError: true,
    hiddenSuccess: true
  })

// 获取内容关联的词条
export const queryMemberEntryEnable = () =>
  request({
    url: '/ecservice/api/ec/bossin-content/hasMemberEntry',
    method: 'get',
    params: { accessSecret },
    hiddenError: true,
    hiddenSuccess: true
  })

// 获取课程列表
export const queryCourseList = params =>
  request({
    url: '/ecservice/api/ec/bossin-course/queryCourseByTile',
    method: 'get',
    params: { accessSecret, ...params }
  })
