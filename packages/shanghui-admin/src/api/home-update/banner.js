import request from '@/utils/request'

/** 获取banner图列表  */
export function getBannerList(params) {
  return request({
    url: '/ecservice/ec/banner/list',
    method: 'get',
    params
  })
}

/** 新增/编辑banner图  */
export function saveBanner(data) {
  return request({
    url: '/ecservice/ec/banner',
    method: data.bannerId ? 'put' : 'post',
    data
  })
}

/** 启用/冻结banner图  */
export function changeBannerStatus(params) {
  return request({
    url: `/ecservice/ec/banner/status/${params.bannerId}/${params.status}`,
    method: 'put'
  })
}

/** 删除banner图  */
export function deleteBanner(data) {
  return request({
    url: '/ecservice/ec/banner',
    method: 'delete',
    data
  })
}

/** 修改banner图顺序  */
export function changeBannerOrder(data) {
  return request({
    url: `/ecservice/ec/banner/location/${data.bannerId}/${data.num}`,
    method: 'put'
  })
}

/** 置顶banner图  */
export function topBanner(bannerId) {
  return request({
    url: `/ecservice/ec/banner/top/${bannerId}`,
    method: 'put'
  })
}

/** banner图切换频率  */
export function changeBannerRate(params) {
  return request({
    url: '/ecservice/ec/banner/switch/frequency',
    method: 'put',
    params
  })
}
