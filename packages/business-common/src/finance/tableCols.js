import {
  WITHDRAWALS_TYPE_MAP,
  WITHDRAWALS_STATUS_MAP,
  WITHDRAWALS_BADGE_MAP,
} from "./constant";
import dayjs from "dayjs";
export const withdrawalCols = [
  {
    title: "提现日期",
    dataIndex: "createTime",
    customRender: ({ record }) => {
      return dayjs(record.createTime).format("YYYY-MM-DD");
    },
  },
  { title: "申请方", dataIndex: "chamberName" },
  {
    title: "提现类型",
    dataIndex: "type",
    customRender: ({ record }) => {
      return WITHDRAWALS_TYPE_MAP.get(record.type) || "---";
    },
  },
  { title: "申请提现金额", dataIndex: "applyPrice" },
  { title: "微信手续费", dataIndex: "wechatPrice" },
  { title: "打款金额", dataIndex: "realPrice" },
  {
    title: "状态",
    dataIndex: "status",
    customRender: ({ record }) => {
      return (
        <div>
          <a-badge status={WITHDRAWALS_BADGE_MAP.get(record.status)} />
          {WITHDRAWALS_STATUS_MAP.get(record.status)}
        </div>
      );
    },
  },
  { title: "操作", dataIndex: "operate" },
];
