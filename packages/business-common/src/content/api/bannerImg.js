import request from '@/utils/request'

export function editBannerLevel(params) {
  return request({
    url: '/ecservice/ec/bannerImg/editlevel',
    method: 'put',
    params
  })
}

export function saveBanner(params) {
  return request({
    url: '/ecservice/ec/bannerImg/save',
    method: 'post',
    data: params
  })
}

export function delBanner(params) {
  return request({
    url: '/ecservice/ec/bannerImg/delete',
    method: 'put',
    params
  })
}

export function getList(params) {
  return request({
    url: '/ecservice/ec/bannerImg/list',
    method: 'get',
    params
  })
}

export function upload(params) {
  return request({
    url: '/ecservice/ec/upload/banner-img',
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data: params
  })
}

export function checkUpperLimit(params) {
  return request({
    url: '/ecservice/ec/bannerImg/check-upperlimit',
    method: 'get',
    params
  })
}

export function getBannerImgList(params) {
  return request({
    url: '/ecservice/ec/bannerImg/getBannerImgList',
    method: 'get',
    params
  })
}

export function getArticleTitle(params) {
  return request({
    url: '/ecservice/ec/article/banner',
    method: 'get',
    params
  })
}

export const dragBannerImg = data => {
  return request({
    url: '/ecservice/ec/bannerImg/drag',
    method: 'put',
    data,
    hiddenSuccess: true
  })
}
