import request from '@/utils/request'
import { errorCaptured } from '@/utils/utils'
/** 获取友情单位 */
class Friend {
  static async getFriendLinks(params) {
    return await errorCaptured(request({
      url: '/ec/ysh-friend-unit/list',
      method: 'get',
      params
    }))
  }
  /** 获取商会列表  */
  static async getChamberData(params) {
    return await errorCaptured(request({
      url: '/ec/ysh-friend-unit/chamberList',
      method: 'get',
      params
    }))
  }
  /** 新增友情单位 */
  static async addFriendLinks(data) {
    return await errorCaptured(request({
      url: '/ec/ysh-friend-unit/save',
      method: 'post',
      data
    }))
  }
  /** 移除友情单位 */
  static async delFriendLinks(id) {
    return await errorCaptured(request({
      url: `/ec/ysh-friend-unit/delete/${id}`,
      method: 'delete'
    }))
  }

  /** 修改友情单位权重 */
  static async editFriendLinksWeight(data) {
    return await errorCaptured(request({
      method: 'put',
      url: `/ec/ysh-friend-unit/updateWeight/${data.id}/${data.value}`,
    }))
  }
}

export default Friend;
