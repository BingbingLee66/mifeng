/** 发布状态 */
export const PUBLISH_STATUS = {
  /** 全部状态 */
  ALL: -1,
  /** 已发布 */
  YES: 1,
  /** 未发布 */
  NO: 0,
};
export const PUBLISH_STATUS_MAP = new Map([
  [PUBLISH_STATUS.ALL, "全部状态"],
  [PUBLISH_STATUS.YES, "已发布"],
  [PUBLISH_STATUS.NO, "未发布"],
]);
/** 热门活动状态 */
export const HOT_ACTIVITY_STATUS = {
  /** 全部状态 */
  ALL: -1,
  /** 未进行 */
  NOTSTART: 1,
  /** 进行中 */
  STARTING: 2,
  /** 已结束 */
  END: 3,
};
export const HOT_ACTIVITY_STATUS_MAP = new Map([
  [HOT_ACTIVITY_STATUS.ALL, "全部状态"],
  [HOT_ACTIVITY_STATUS.NOTSTART, "未进行"],
  [HOT_ACTIVITY_STATUS.STARTING, "进行中"],
  [HOT_ACTIVITY_STATUS.END, "已结束"],
]);

/** 活动状态 */
export const ACTIVITY_STATUS = {
  /** 全部状态 */
  ALL: 0,
  /** 待开始 */
  NOTSTART: 1,
  /** 进行中 */
  STARTING: 2,
  /** 已结束 */
  END: 3,
  /** 报名中 */
  SIGNUPING: 4,
};
export const ACTIVITY_STATUS_MAP = new Map([
  [ACTIVITY_STATUS.ALL, "全部状态"],
  [ACTIVITY_STATUS.NOTSTART, "待开始"],
  [ACTIVITY_STATUS.STARTING, "进行中"],
  [ACTIVITY_STATUS.END, "已结束"],
  [ACTIVITY_STATUS.SIGNUPING, "报名中"],
]);
/** 状态对应图标 */
export const ACTIVITY_STATUS_BRIDGE = new Map([
  [ACTIVITY_STATUS.NOTSTART, "default"],
  [ACTIVITY_STATUS.STARTING, "processing"],
  [ACTIVITY_STATUS.END, "error"],
  [ACTIVITY_STATUS.SIGNUPING, "processing"],
]);

export const APPLY_OBJECT_TYPE = {
  /** 不限 */
  ALL: 0,
  /** 限本商会成员 */
  MEMBER: 1,
  /** 限本商内指定职位 */
  POST: 2,
  /** 限本商内指定部门 */
  DEPARTMENT: 3,
};
export const APPLY_OBJECT_MAP = new Map([
  [APPLY_OBJECT_TYPE.ALL, "不限"],
  [APPLY_OBJECT_TYPE.MEMBER, "限本商会成员"],
  [APPLY_OBJECT_TYPE.POST, "限本商内指定职位"],
  [APPLY_OBJECT_TYPE.DEPARTMENT, "限本商内指定部门"],
]);
export const PUBLISH_TYPE = {
  UN_PUBLISH: 0,
  PUBLISHED: 1,
};

export const PUBLISH_TYPE_MAP = new Map([
  [PUBLISH_TYPE.PUBLISHED, "已发布"],
  [PUBLISH_TYPE.UN_PUBLISH, "未发布"],
]);

// 采集状态
export const COLLECT_STATUS = {
  no: 0, // 未采集
  yes: 1, // 已采集
};

export const collectStatusMap = new Map([
  [COLLECT_STATUS.no, "未采集"],
  [COLLECT_STATUS.yes, "已采集"],
]);

// 来源
export const DATA_SOURCE = {
  admin: 0, // 后台创建
  chamber: 1, // 商会创建
};

export const dataSourceMap = new Map([
  [DATA_SOURCE.admin, "后台创建"],
  [DATA_SOURCE.chamber, "商会创建"],
]);

// 是否冻结
export const FREEZE = {
  no: 0, // 否
  yes: 1, // 是
};

export const freezeMap = new Map([
  [FREEZE.no, "否"],
  [FREEZE.yes, "是"],
]);

// 搜索类型
export const SELECT_TYPE = {
  platform: 1, // 平台推荐
  chamber: 2, // 商协会创建
  thisWill: 3, // 本会创建
};

export const selectTypeMap = new Map([
  [SELECT_TYPE.platform, "平台推荐"],
  [SELECT_TYPE.chamber, "商协会创建"],
  [SELECT_TYPE.thisWill, "本会创建"],
]);

export const QR_CODE_DESC = [
  "保存图片打印在活动海报、易拉宝等场合",
  "用户使用微信扫码即签到成功，并显示会场座位号。",
  "临时报名签到码用于临时到场会员，未报名无法签到情况，扫码后自动通过并签到。",
];
export const YES_OR_NO = {
  /** 否 */
  no: 0,
  /** 是 */
  yes: 1,
};
export const SIGN_IN_MAP = new Map([
  [YES_OR_NO.no, ""],
  [YES_OR_NO.yes, "签到 "],
]);
export const SIGN_OUT_MAP = new Map([
  [YES_OR_NO.no, ""],
  [YES_OR_NO.yes, "签退 "],
]);
export const SEATING_MAP = new Map([
  [YES_OR_NO.no, ""],
  [YES_OR_NO.yes, "座位表 "],
]);

export const statusList = [
  { id: -1, name: "全部" },
  { id: 0, name: "待签到" },
  { id: 1, name: "已签到" },
  { id: 2, name: "未签到" },
];
export const seatList = [
  { id: -1, name: "全部" },
  { id: 0, name: "未坐" },
  { id: 1, name: "已坐" },
  { id: 2, name: "空坐" },
];
export const SOURCE_TYPE = {
  /** 导入 */
  IMPORT: 1,
  /** 小程序报名 */
  MIN_PROGRAM: 2,
  /** 临时签到 */
  TEMPORARY: 3,
};
export const SOURCE_TYPE_MAP = new Map([
  [SOURCE_TYPE.IMPORT, "导入"],
  [SOURCE_TYPE.MIN_PROGRAM, "小程序报名 "],
  [SOURCE_TYPE.TEMPORARY, "临时签到 "],
]);

export const FILE_ACCEPT_TYPE = [
  "docx",
  "doc",
  "xls",
  "xlsx",
  "pdf",
  "PPT",
  "ppt",
  "pptx",
];

export const MEMBER_TYPR = {
  /** - */
  NONE: -1,
  /** 个人 */
  SELF: 0,
  /** 企业 */
  COMPANY: 1,
};
export const MEMBER_TYPE_MAP = new Map([
  [MEMBER_TYPR.NONE, "-"],
  [MEMBER_TYPR.SELF, "个人"],
  [MEMBER_TYPR.COMPANY, "企业"],
]);
