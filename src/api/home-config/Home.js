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
      url: '/ec/banner/list',
      method: 'get',
      params
    })
  }

  /** 新增/编辑banner图  */
  static async saveBanner(data) {
    return request({
      url: '/ec/banner',
      method: data.bannerId ? 'put' : 'post',
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
  static async changeBannerRate(params) {
    return await request({
      url: '/ec/banner/switch/frequency',
      method: 'put',
      params
    })
  }

  /** 获取推荐位配置列表  */
  static async getRecommendList(params) {
    return await request({
      url: '/ec/recommend-pos/page-recommend-pos',
      method: 'get',
      params
    })
  }

  /** 显示/隐藏推荐位  */
  static async changeRecommendStatus(data) {
    return await request({
      url: '/ec/recommend-pos/update-status',
      method: 'post',
      data
    })
  }

  /** 根据推荐内容类型获取内容列表  */
  static async getContentList(params) {
    return await request({
      url: '/ec/recommend-pos/get-content-select',
      method: 'get',
      params
    })
  }

  /** 获取推荐内容 */
  static async getRecommendContent(params) {
    return await request({
      url: '/ec/recommend-pos/get-content',
      method: 'get',
      params
    })
  }

  /** 编辑推荐内容 */
  static async updateRecommendContent(data) {
    return await request({
      url: '/ec/recommend-pos/edit-content',
      method: 'post',
      data
    })
  }

  /** 获取领导风采列表 */
  static async getLeaderList(params) {
    return await request({
      url: '/api/ec/leaderStyle/list',
      method: 'get',
      params
    })
  }

  /** 创建或编辑领导风采 */
  static async saveLeader(data) {
    return await request({
      url: '/api/ec/leaderStyle/save',
      method: 'post',
      data
    })
  }

  /** 隐藏/展示领导风采 */
  static async changeLeaderStatus(data) {
    return await request({
      url: 'api/ec/leaderStyle/leaderStyleShow',
      method: 'put',
      data
    })
  }

  /** 删除领导风采 */
  static async deleteLeader(id) {
    return await request({
      url: `/api/ec/leaderStyle/delete/${id}`,
      method: 'delete',
      params: { id }
    })
  }

  /** 领导风采功能开关 */
  static async switchLeader(data) {
    return await request({
      url: '/api/ec/leaderStyle/saveSwitch',
      method: 'post',
      data
    })
  }

  /** 领导风采功能开关 */
  static async getSwitchLeader(cKey) {
    return await request({
      url: `/api/ec/leaderStyle/getSwitch/${cKey}`,
      method: 'get'
    })
  }

  /** 领导风采排序 */
  static async sortLeader(params) {
    return await request({
      url: '/api/ec/leaderStyle/sort',
      method: 'put',
      params
    })
  }
}

export default Home
