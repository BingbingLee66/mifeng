import request from '@/utils/request'

class Home {
  /** 获取领导风采列表 */
  static async getLeaderList(params) {
    return await request({
      url: '/ecservice/api/ec/leaderStyle/list',
      method: 'get',
      params
    })
  }

  /** 创建或编辑领导风采 */
  static async saveLeader(data) {
    return await request({
      url: '/ecservice/api/ec/leaderStyle/save',
      method: 'post',
      data
    })
  }

  /** 隐藏/展示领导风采 */
  static async changeLeaderStatus(data) {
    return await request({
      url: 'ecservice/api/ec/leaderStyle/leaderStyleShow',
      method: 'put',
      data
    })
  }

  /** 删除领导风采 */
  static async deleteLeader(id) {
    return await request({
      url: `/ecservice/api/ec/leaderStyle/delete/${id}`,
      method: 'delete',
      params: { id }
    })
  }

  /** 领导风采功能开关 */
  static async switchLeader(data) {
    return await request({
      url: '/ecservice/api/ec/leaderStyle/saveSwitch',
      method: 'post',
      data
    })
  }

  /** 领导风采功能开关 */
  static async getSwitchLeader(cKey) {
    return await request({
      url: `/ecservice/api/ec/leaderStyle/getSwitch/${cKey}`,
      method: 'get'
    })
  }

  /** 领导风采排序 */
  static async sortLeader(params) {
    return await request({
      url: '/ecservice/api/ec/leaderStyle/sort',
      method: 'put',
      params
    })
  }

  /** 领导风采权重 */
  static async updateWeight(params) {
    return await request({
      url: '/ecservice/api/ec/leaderStyle/updateSort',
      method: 'put',
      params
    })
  }
}

export default Home
