import request from '@/utils/request'

class Home {
  /** 获取banner图列表  */
  static async getBannerList(params) {
    return await request({
      url: '/ec/bannerImg/getBannerImgList',
      method: 'get',
      params
    })
  }

  /** 新增/编辑banner图  */
  static async saveBanner(params) {
    return request({
      url: '',
      method: '',
      data: params
    })
  }

  /** 启用banner图  */
  static async useBanner(params) {
    return request({
      url: '/',
      method: '',
      data: params
    })
  }

  /** 删除banner图  */
  static async deleteBanner(params) {
    return request({
      url: '',
      method: '',
      params
    })
  }

  /** 置顶banner图  */
  static async topBanner(params) {
    return await request({
      url: '/',
      method: '',
      params
    })
  }

  /** banner图切换频率  */
  static async changeRateBanner(params) {
    return await request({
      url: '',
      method: '',
      params
    })
  }

  /** 更新Tab状态 */
  static async updateStatus(params) {
    return await request({
      url: '/ec/contentColumn/update-status',
      method: 'put',
      params
    })
  }

  /** 默认选中Tab  */
  static async updateActive(params) {
    return await request({
      url: '/ec/contentColumn/update-status',
      method: 'put',
      params
    })
  }
}

export default Home
