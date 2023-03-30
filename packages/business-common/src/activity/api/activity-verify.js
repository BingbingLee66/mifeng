import request from "@/utils/request";

// 活动报名审核列表
export function getActivityApplyList(params) {
  return request({
    url: "/ecservice/api/ec/activity-apply/list",
    method: "get",
    params,
  });
}

// 通过/驳回报名申请
export function aduitActivityApply(params) {
  return request({
    url: "/api/ec/activity-apply/audit",
    method: "post",
    data: params,
  });
}

// 下载签到表
export function downloadActivityApply(params) {
  return request({
    url: "/api/ec/activity-apply/download",
    method: "get",
    params,
  });
}

// 某活动报名列表
export function getActivityApply(params) {
  return request({
    url: "/api/ec/activity-apply/list-byId",
    method: "get",
    params,
  });
}

// 某活动某人驳回理由列表
export function getActivityRejectApply(params) {
  return request({
    url: "/api/ec/activity-apply/list-reject-reason",
    method: "get",
    params,
  });
}

// 签到
export function signActivityApply(params) {
  return request({
    url: "/api/ec/activity-apply/sign",
    method: "post",
    data: params,
  });
}

// 活动活动来源列表
export function getActivitySource(params) {
  return request({
    url: "/api/ec/activity-hot/chamber-list",
    method: "post",
    data: params,
  });
}

// 活动报名审核详情
export function getActivityApplyDetail(params) {
  return request({
    url: "/api/ec/activity-apply/detail",
    method: "get",
    params,
  });
}

// 获取商会活动详情
export const getChamberActivityInfoById = (activityId) =>
  request({
    url: `/ecservice/api/ec/activity-apply/chamberActivityInfo/${activityId}`,
    method: "get",
  });

// 上传座位表
export const uploadSeating = (data) =>
  request({
    url: "/ecservice/api/ec/singin/uploadSeating",
    method: "post",
    data,
  });

// 删除座位表
export const deleteSeating = (activityId) =>
  request({
    url: `/ecservice/api/ec/singin/Seat/clean/${activityId}`,
    method: "get",
  });

// 获取活动报名列表
export const getActivitySigninList = (id, params) =>
  request({
    url: `/ecservice/api/ec/singin/activity/${id}`,
    method: "get",
    params,
  });

// 名片详情查询接口
export const getCardDetail = (cardId) =>
  request({
    url: `/ecservice/ec/card/card-detail?cardId=${cardId}`,
    method: "get",
  });

// 导入活动报名数据
export const uploadSigninData = (data) =>
  request({
    url: "/ecservice/api/ec/singin",
    method: "post",
    data,
  });

// 导入excek
export const uploadSignin = (data) =>
  request({
    url: "/ecservice/api/ec/singin/import",
    method: "post",
    data,
  });

// 修改报名状态
export const modifySigninStatus = ({ status, id, activityId }, params) =>
  request({
    url: `/ecservice/api/ec/singin/apply/${status}/${id}/${activityId}`,
    method: "put",
    params,
  });

// 保存备注
export const saveRemark = (id, params) =>
  request({
    url: `/ecservice/api/ec/singin/remark/${id}`,
    params,
    method: "post",
  });

// 签到
export const handleSignin = ({ num, status, id }) =>
  request({
    url: `/ecservice/api/ec/activity-apply/signin/${num}/${status}/${id}`,
    method: "put",
  });

// 查询替补人员信息
export const querySubInfo = (phone) =>
  request({
    url: `/ecservice/api/ec/singin/distinguish/${phone}`,
    method: "get",
  });

// 设置替补人员
export const setSubUser = ({ id, phone }) =>
  request({
    url: `/ecservice/api/ec/singin/user-alert/${id}/${phone}`,
    method: "get",
  });

// 签退
export const handleSignOut = ({ id, status }) =>
  request({
    url: `/ecservice/api/ec/activity-apply/signout/${status}/${id}`,
    method: "put",
  });

// 获取各个状态审核总数量
export const getSigninStatusCount = (id) =>
  request({
    url: `/ecservice/api/ec/singin/status-count/${id}`,
    method: "get",
  });

// 设置座位号
export const resetSigninSeat = (activityApplyId, data) =>
  request({
    url: `/ecservice/api/ec/singin/seat/reset/${activityApplyId}`,
    method: "post",
    data,
  });

// 空座变为已就坐
export const modifySeatStatus = (activityApplyId, data) =>
  request({
    url: `/ecservice/api/ec/singin/seat/status/${activityApplyId}`,
    method: "post",
    data,
  });
// 获取活动excel
export const getActivityExcel = (id, params) =>
  request({
    url: `/ecservice/api/ec/singin/activity/${id}/excel`,
    method: "get",
    params,
    responseType: "blob",
    hiddenError: true,
  });

// 参与人员excel导出
export const getCardExcel = (id) =>
  request({
    url: `/ecservice/api/ec/singin/excel?activityId=${id}`,
    method: "get",
    responseType: "blob",
    hiddenError: true,
  });

// 参与人与卡片-列表查询
export const getIpCardList = (activityId, params) =>
  request({
    url: `/ecservice/api/ec/singin/activity/card/${activityId}`,
    method: "get",
    params,
  });

// 参与人与名片设置-名片排序设置
export const weightIpCardSort = (data) =>
  request({
    url: "/ecservice/api/ec/singin/activity/card-sort",
    method: "put",
    data,
  });

// 获取活动excel
export const getActivityWaitingExcel = (id, params) =>
  request({
    url: `/ecservice/api/ec/singin/activity/${id}/exportData`,
    method: "get",
    params,
    responseType: "blob",
    hiddenError: true,
  });
// 获取活动附件表单
export const getActivityForm = (activityId, params) =>
  request({
    url: `/ecservice/api/ec/activity-apply/${activityId}/sign-key/attachment`,
    method: "get",
    params,
  });

// 提交活动报名附件信息
export const submitApplyInfo = (data) =>
  request({
    url: "/ecservice/api/ec/activity-apply/sign-key/attachment",
    method: "put",
    data,
    hiddenSuccess: true,
  });
// 下载活动报名导入表
export const getApplyExcel = (activityId, params) =>
  request({
    url: `/ecservice/api/ec/activity-apply/${activityId}/import-template`,
    method: "get",
    params,
    responseType: "blob",
    hiddenError: true,
  });

// 导入活动报名表
export const importApplyExcel = (activityId, data) =>
  request({
    url: `/ecservice/api/ec/activity-apply/${activityId}/import`,
    method: "post",
    data,
    hiddenSuccess: true,
  });
