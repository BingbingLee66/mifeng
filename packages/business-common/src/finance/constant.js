export const WITHDRAWALS_TYPE = {
  MALL: 1,
  MEMBER_FREE: 0,
};

export const WITHDRAWALS_TYPE_MAP = new Map([
  [WITHDRAWALS_TYPE.MALL, "商城"],
  [WITHDRAWALS_TYPE.MEMBER_FREE, "会费"],
]);

export const WITHDRAWALS_STATUS = {
  PROCESSING: 0,
  SUCCESS: 1,
  ERROR: 2,
};

export const WITHDRAWALS_STATUS_MAP = new Map([
  [WITHDRAWALS_STATUS.PROCESSING, "审核中"],
  [WITHDRAWALS_STATUS.SUCCESS, "提现成功"],
  [WITHDRAWALS_STATUS.ERROR, "提现失败"],
]);
export const WITHDRAWALS_BADGE_MAP = new Map([
  [WITHDRAWALS_STATUS.PROCESSING, "processing"],
  [WITHDRAWALS_STATUS.SUCCESS, "success"],
  [WITHDRAWALS_STATUS.ERROR, "error"],
]);

export const ECHAMBER_TABS = {
  TRADE: "12",
  WITHDRAWALS: "13",
};