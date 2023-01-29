import request from '@/utils/request'

class Kingkong {
  // =========================================================== wechat ==========================================================

  /** 获取金刚区列表 */
  static async getKingkongListV1(params) {
    return await request({
      url: '/ec/king-kong/list',
      method: 'get',
      params
    })
  }

  /** 删除金刚区  */
  static async deleteKingkongV1(data) {
    return await request({
      url: '/ec/king-kong',
      method: 'delete',
      data
    })
  }

  /** 新增/编辑金刚区 */
  static async saveKingkongV1(data) {
    return await request({
      url: '/ec/king-kong',
      method: data.kingKongId ? 'put' : 'post',
      data
    })
  }

  /** 调整金刚区顺序 */
  static async changeKingkongOrder(kingkongId, num) {
    return await request({
      url: `/ec/king-kong/location/${kingkongId}/${num}`,
      method: 'put'
    })
  }

  /** 启用/冻结金刚区 */
  static async changeKingkongStatus(kingkongId, status) {
    return await request({
      url: `/ec/king-kong/status/${kingkongId}/${status}`,
      method: 'put'
    })
  }

  // =========================================================== app ==========================================================

  /** 获取金刚区列表 */
  static async getKingkongList(data) {
    return await request({
      url: '/ec/king-kong-area/list',
      method: 'post',
      data
    })
  }
  /** 启用/冻结金刚区 */
  static async updateKingkongStatus(id, status) {
    return await request({
      url: `/ec/king-kong-area/${id}/status?status=${status}`,
      method: 'put'
    })
  }
  /** 批量删除金刚区  */
  static async deleteKingkong(data) {
    return await request({
      url: '/ec/king-kong-area/delBatch',
      method: 'delete',
      data
    })
  }
  /** 新增/编辑金刚区 */
  static async saveKingkongN(data) {
    return await request({
      url: '/ec/king-kong-area/app/saveOrUpdate',
      method: 'post',
      data
    })
  }

  /** 保存金刚区 */
  static async saveKingkong(data) {
    return await request({
      url: '/ec/king-kong-area/saveOrUpdate',
      method: 'post',
      data
    })
  }

  /** 修改金刚区权重 */
  static async updateKingkongWeight(data) {
    return await request({
      method: 'put',
      url: `/ec/king-kong-area/weight/${data.id}/${data.value}`
    })
  }
}

export default Kingkong
