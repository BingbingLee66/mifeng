import request from '@/utils/request'

// 总后台-修改置顶权重
export function updateArticleTopLevel(params) {
  return request({
    url: '/ecservice/ec/article/updateArticleTopLevel',
    method: 'put',
    params
  })
}

// 修改权重
export function updateChamberContentSort(params) {
  return request({
    url: '/ecservice/ec/article/update-article-sort',
    method: 'put',
    params
  })
}

export function getChamberContentList(params) {
  return request({
    url: '/ecservice/ec/article/chamber-content-list',
    method: 'get',
    params
  })
}

export function getAboutChamberList(params) {
  return request({
    url: '/ecservice/ec/article/about-chamber-list',
    method: 'get',
    params
  })
}

export function getContactUs(params) {
  return request({
    // url: '/ecservice/ec/article/contact-us',
    url: '/ecservice/ec/article/chamberHonor',
    method: 'get',
    params
  })
}

export function getGlobalContentList(params) {
  return request({
    url: '/ecservice/ec/article/global-content-list',
    method: 'get',
    params
  })
}

export function getManagerList(params) {
  return request({
    url: '/ecservice/ec/article/manager-content-list',
    method: 'get',
    params
  })
}

export function getAuditList(params) {
  return request({
    url: '/ecservice/ec/article/audit-list',
    method: 'get',
    params
  })
}

export function getCompanyAuditList(params) {
  return request({
    url: '/ecservice/api/ec/companyAudit/companyAudit-list',
    method: 'get',
    params
  })
}

export function getArticleCommentList(params) {
  return request({
    url: '/ecservice/api/ec/articleComment/getArticleCommentList',
    method: 'post',
    params,
    hiddenSuccess: true
  })
}

export function updateCommentStatus(params) {
  return request({
    url: '/ecservice/api/ec/articleComment/updateStatus',
    method: 'put',
    params
  })
}

export function save(params) {
  return request({
    url: '/ecservice/ec/article/save',
    method: 'post',
    data: params
  })
}

export function updateStatus(params) {
  return request({
    url: '/ecservice/ec/article/update-status',
    method: 'put',
    params,
    hiddenSuccess: true
  })
}

export function updateStatusPlatform(params) {
  return request({
    url: '/ecservice/ec/article/update-status-platform',
    method: 'put',
    data: params
  })
}

export function del(params) {
  return request({
    url: '/ecservice/ec/article/delete',
    method: 'put',
    data: params
  })
}

export function getDetail(params) {
  return request({
    url: '/ecservice/ec/article/detail',
    method: 'get',
    params
  })
}

export function getCompanyDetail(params) {
  return request({
    url: '/ecservice/api/ec/companyAudit/companyAudit-one',
    method: 'get',
    params
  })
}

export function getUpdateDetail(params) {
  return request({
    url: '/ecservice/ec/article/update-detail',
    method: 'get',
    params
  })
}

export function uploadRichhtmlImg(params) {
  return request({
    url: '/ecservice/ec/upload/richhtml-img',
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data: params
  })
}

export function updateAudit(params) {
  return request({
    url: '/ecservice/ec/article/audit-status',
    method: 'put',
    data: params
  })
}

// 驳回企业官网资料修改
export function updateCompanyAudit(params) {
  return request({
    url: '/ecservice/api/ec/companyAudit/audit-status',
    method: 'put',
    data: params
  })
}

export function getTopList() {
  return request({
    url: '/ecservice/ec/article/top-list',
    method: 'get'
  })
}

export function countTop() {
  return request({
    url: '/ecservice/ec/article/count-top',
    method: 'get'
  })
}

export function setTop(params) {
  return request({
    url: '/ecservice/ec/article/set-top',
    method: 'put',
    params
  })
}

export function cancelTop(params) {
  return request({
    url: '/ecservice/ec/article/cancel-top',
    method: 'put',
    params
  })
}

export function uploadCoverImg(params) {
  return request({
    url: '/ecservice/ec/upload/article-cover-img',
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data: params
  })
}
// 栏目权重设置

export function updateColumnLevel(params) {
  return request({
    url: '/ecservice/ec/contentColumn/updateColumnLevelById?id=' + params.id + '&level=' + params.level,
    method: 'get'
  })
}
// 商会后台-置顶管理列表
export function chamberTopList(params) {
  return request({
    url: '/ecservice/ec/article/chamberTopListV2',
    method: 'get',
    params
  })
}
// 商会后台-置顶/取消置顶
export function updateChamberTop(params) {
  return request({
    url: '/ecservice/ec/article/updateChamberTopV2',
    method: 'put',
    params
  })
}
// 文章预览
export function previewArticle(params) {
  return request({
    url: '/ecservice/article/preview',
    method: 'post',
    data: params,
    hiddenError: true,
    hiddenSuccess: true
  })
}
// 抓取微信文章内容
export function getWechatContent(url) {
  return request({
    url: `/ecservice/ec/article/getWechatContent?url=${url}`,
    method: 'get'
  })
}
// 会员分享-查询可冻结列表
export function freezeList(id) {
  return request({
    url: `/ecservice/ec/article/get-can-freeze-list?id=${id}`,
    method: 'get'
  })
}
// 会员分享-查询可解冻列表
export function unFreezeList(id) {
  return request({
    url: `/ecservice/ec/article/get-can-un-freeze-list?id=${id}`,
    method: 'get'
  })
}
// 会员分享-冻结
export function freeze(id, params) {
  return request({
    url: `/ecservice/ec/article/freeze/${id}`,
    method: 'post',
    data: params
  })
}
// 会员分享-解冻
export function unFreeze(id, params) {
  return request({
    url: `/ecservice/ec/article/unFreeze/${id}`,
    method: 'post',
    data: params
  })
}
// 分页查询动态列表
export function dynamicPagedList(params) {
  return request({
    url: `/ecservice/ec/dynamic-record/pc-dynamic-paged-list`,
    method: 'get',
    params
  })
}
// 校验文件
export function checkFile(params) {
  return request({
    url: `/ecservice/ec/dynamic-record/check-file`,
    method: 'post',
    data: params,
    hiddenError: true,
    hiddenSuccess: true
  })
}
// 上传文件到对应目录
export function uploadFile(params, query) {
  return request({
    url: `/ecservice/ec/upload/file?folder=${query}`,
    method: 'post',
    data: params,
    hiddenError: true,
    hiddenSuccess: true
  })
}
// 新增或更新动态
export function editDynamic(params) {
  return request({
    url: `/ecservice/ec/dynamic-record/api/wechatAuth/dynamic`,
    method: 'post',
    data: params
  })
}
// 查询可同步的商会
export function getChamberList(wxUserId) {
  return request({
    url: `/ecservice/ec/dynamic-record/get-can-synchronize-list?wxUserId=${wxUserId}`,
    method: 'get'
  })
}
// 查询可同步的商会
export function getDynamicDetail(id) {
  return request({
    url: `/ecservice/ec/dynamic-record/detail/${id}`,
    method: 'get'
  })
}
// 上传视频
export function uploadVideo(params, id = 0, source = 1) {
  return request({
    url: `/ecservice/ec/dynamic-record/vod/upload/video/${id}/${source}`,
    method: 'post',
    data: params
  })
}
// 轮询查视频动态
export function queryVideo(vid) {
  return request({
    url: `/ecservice/ec/dynamic-record/vod/info/${vid}`,
    method: 'get'
  })
}
// 批量删除动态
export function deleteDynamicByID(articleIds) {
  return request({
    url: `/ecservice/ec/dynamic-record/delete`,
    method: 'put',
    data: articleIds
  })
}

// 修改置顶时间
export function updateTopActiveTime(params) {
  return request({
    url: `/ecservice/ec/article/setChamberTopActiveTime`,
    method: 'put',
    params
  })
}

// 修改置顶排序
export function updateTopSort(data) {
  return request({
    url: `/ecservice/ec/article/updateChamberTopSort`,
    method: 'put',
    data
  })
}

/**
 * 上传富文本文件到对应目录
 * @param params
 * @returns {*}
 */
export function uploadFileRichImg(params, handleProgress) {
  return request({
    url: '/ecservice/upload/richhtml-custom-img-upload',
    /* headers: { "Content-Type": "multipart/form-data" }, */
    method: 'post',
    onUploadProgress: handleProgress,
    data: params
  })
}
// 上传文件到对应目录
export function uploadFileRandomName(params, query) {
  return request({
    url: `/ecservice/ec/upload/random/file?folder=${query}`,
    method: 'post',
    data: params,
    hiddenError: true,
    hiddenSuccess: true
  })
}
