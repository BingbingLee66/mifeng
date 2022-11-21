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
      // /ec/banner/list
      url: '/ec/bannerImg/getBannerImgList',
      method: 'get',
      params
    })
  }

  /** 新增/编辑banner图  */
  static async saveBanner(data) {
    return request({
      url: '/ec/banner',
      method: data.id ? 'put' : 'post',
      data
    })
  }

  /** 启用/冻结banner图  */
  static async changeBannerStatus(params) {
    return request({
      url: `/ec/banner/status/${params.bannerId}/${params.status}`,
      method: 'put'
    })
  }

  /** 删除banner图  */
  static async deleteBanner(data) {
    return request({
      url: '/ec/banner',
      method: 'delete',
      data
    })
  }

  /** 修改banner图顺序  */
  static async changeBannerOrder(data) {
    return request({
      url: `/ec/banner/location/${data.bannerId}/${data.num}`,
      method: 'put'
    })
  }

  /** 置顶banner图  */
  static async topBanner(bannerId) {
    return await request({
      url: `/ec/banner/top/${bannerId}`,
      method: 'put'
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
