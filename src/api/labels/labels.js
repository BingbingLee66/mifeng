import request from "@/utils/request";
/**
 * 标签相关请求api
 * get--params
 * post--data
 */
class Labels {
  /** 标签组采集 */
  static async labelGroupCollect(data) {
    return request({
      url: "/ec/member-label-group/collect",
      method: "post",
      data,
    });
  }

  /** 标签组批量删除 */
  static async delLabelGroup(data) {
    return request({
      url: "/ec/member-label-group/deleteBatch",
      method: "delete",
      data,
    });
  }

  /** 标签组详情 */
  static async getLabelGroupDetail(params) {
    return request({
      url: "/ec/member-label-group/detail/" + id,
      method: "get",
      params,
    });
  }

  /** 标签组冻结 */
  static async freezeLabelGroup(data) {
    return request({
      url: "/ec/member-label-group/freeze",
      method: "post",
      data,
    });
  }

  /** 标签组解冻 */
  static async unfreezeLabelGroup(data) {
    return request({
      url: "/ec/member-label-group/unfreeze",
      method: "post",
      data,
    });
  }

  /** 标签组新增 */
  static async addLabelGroup(data) {
    return request({
      url: "/ec/member-label-group/insertMemberGroup",
      method: "post",
      data,
    });
  }

  /** 标签组列表 */
  static async getLabelGroupLst(params) {
    return request({
      url: "/ec/member-label-group/list",
      method: "get",
      params,
    });
  }

  /** 标签组编辑 */
  static async editLabelGroup(data) {
    return request({
      url: "/ec/member-label-group/updateMemberGroup",
      method: "put",
      data,
    });
  }

  /** 标签组更新权重 */
  static async updateLabelGroupWeight(data) {
    return request({
      url: "/ec/member-label-group/weight",
      method: "put",
      data,
    });
  }

  /** 打标签 */
  static async attachLabel(data) {
    return request({
      url: "/ec/member-label-bridge/attachALabel",
      method: "post",
      data,
    });
  }

  /** 移除标签 */
  static async removeLabel(wxUserId, tagIds) {
    return request({
      url: `/ec/member-label-bridge/deleteLabel/${wxUserId}?tagIds=${tagIds}`,
      method: "delete"
    });
  }

  /** 用户第一次选择的感兴趣的供需标签 */
  static async getFirstInterestLabel(userId) {
    return request({
      url: "/ec/member-label-bridge/firstInterestDemandLabels/" + userId,
      method: "get",
    });
  }

  /** 查询符合标签的用户数量 */
  static async getMatchLabelNum(params) {
    return request({
      url: "/ec/member-label-bridge/matchMemberNum",
      method: "get",
      params,
    });
  }

  /** 用户详情-用户标签列表 */
  static async getUserDetailLabelLst(userId, type, params) {
    return request({
      url: `/ec/member-label-bridge/userInfoLabelList/${userId}/${type}`,
      method: "get",
      params
    });
  }
}

export default Labels;
