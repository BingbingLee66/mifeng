import request from '@/utils/request'

// 文章列表
export function officialAccountArticleList(params) {
  return request({
    url: '/ecservice/ec/officialArticleSync/articleList',
    method: 'get',
    params,
    hiddenError: true,
    hiddenSuccess: true
  })
}

// 查询授权列表
export function officialAccountList(params) {
  return request({
    url: '/ecservice/ec/officialAccount/list',
    method: 'get',
    params,
    hiddenError: true,
    hiddenSuccess: true
  })
}

// 生成公众号平台外部链接,用于授权第三方平台
export function officialAccountUrl(params) {
  return request({
    url: '/ecservice/ec/officialAccount/auth/url',
    method: 'get',
    params,
    hiddenError: true,
    hiddenSuccess: true
  })
}

// 查询授权信息
export function officialAccountAuthInfo(params) {
  return request({
    url: '/ecservice/ec/officialAccount/auth/info',
    method: 'get',
    params,
    hiddenError: true,
    hiddenSuccess: true
  })
}

// 查询商会是否授权公众号
export function officialAccountAuthStatus(params) {
  return request({
    url: '/ecservice/ec/officialAccount/authStatus',
    method: 'get',
    params,
    hiddenError: true,
    hiddenSuccess: true
  })
}

// 解绑
export function officialAccountUnbind(params) {
  return request({
    url: '/ecservice/ec/officialAccount/unbind',
    method: 'put',
    params
  })
}

// 文章分享二维码
export function getArticleQRCode(params) {
  return request({
    url: '/ecservice/ec/article/getArticleQRCode',
    method: 'get',
    params,
    hiddenError: true,
    hiddenSuccess: true
  })
}

// 公众号 - 文章发布记录
export function getArticleSyncRecord(params) {
  return request({
    url: '/ecservice/ec/article/getArticleSyncRecord',
    method: 'post',
    data: params,
    hiddenError: true,
    hiddenSuccess: true
  })
}
