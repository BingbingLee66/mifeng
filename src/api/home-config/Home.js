import request from '@/utils/request'

class Home {
  /** 获取tab列表  */
  static async getTabList(params) {
    return await request({
      url: '/ec/tab',
      method: 'get',
      params
    })
  }

  /** 编辑tab  */
  static async updateTab(data) {
    return await request({
      url: '/ec/tab',
      method: 'put',
      data
    })
  }

  /** 默认选中tab  */
  static async defaultTab(params) {
    return await request({
      url: '/ec/tab/defaultChange',
      method: 'put',
      params
    })
  }

  /** 展示/隐藏tab  */
  static async showTab(params) {
    return await request({
      url: '/ec/tab/editStatus',
      method: 'put',
      params
    })
  }

  /** tab排序  */
  static async sortTab(params) {
    return await request({
      url: '/ec/tab/sort',
      method: 'put',
      params
    })
  }

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

  /** 获取推荐位配置列表  */
  static async getRecommendList(params) {
    return await request({
      url: '',
      method: 'get',
      params
    })
  }

  /** 显示/隐藏推荐位  */
  static async showRecommend(params) {
    return await request({
      url: '',
      method: 'put',
      params
    })
  }
}

export default Home
