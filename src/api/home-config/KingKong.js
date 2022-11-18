import request from '@/utils/request'

class Kingkong {
  /** 获取金刚区列表 */
  static async getKingkongList(data) {
    return await request({
      url: '/ec/king-kong-area/list',
      method: 'post',
      data
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
      url: `/ec/king-kong-area/weight/${data.id}/${data.value}`,
    })
  }
}

export default Kingkong
