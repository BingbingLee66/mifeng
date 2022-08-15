const formData = {
  // 标签组名称
  labelGroupName: "",
  // 标签名称
  labelName: "",
  // 权重是否为0
  weightZero: "-1"
};

const formItem = [
  {
    label: "标签组",
    prop: "labelGroupName",
    type: "input",
    clearable: true,
  },
  {
    label: "标签",
    prop: "labelName",
    type: "input",
    clearable: true,
  },
  {
    label: "权重是否为0",
    prop: "weightZero",
    type: "select",
    options: [
      { label: "全部", value: "-1" },
      { label: "是", value: "1" },
      { label: "否", value: "0" }
    ]
  }
];

const tableColumn = [
  {
    label: "标签组",
    prop: "name",
  },
  {
    label: "标签",
    prop: "labels",
    type: "slot",
    slotName: "labels",
  },
  {
    label: "权重",
    prop: "weight",
    type: "level",
  },
  {
    label: "更新信息",
    prop: "updateInfo",
    type: "operator",
    operatorName: "operatorName",
    operatorTime: "updatedTs"
  },
  {
    label: "操作",
    prop: "operate",
    type: "slot",
    slotName: "operate",
  },
];

const formData1 = {
  // 标签组名称
  labelGroupName: "",
  // 标签名称
  labelName: "",
  // 所属商协会
  sourceCkeyList: -1,
  // 采集状态
  collectStatus: "-1"
};

const formItem1 = [
  {
    label: "标签组",
    prop: "labelGroupName",
    type: "input",
    clearable: true,
  },
  {
    label: "标签",
    prop: "labelName",
    type: "input",
    clearable: true,
  },
  {
    label: "所属商协会",
    prop: "sourceCkeyList",
    filterable: true,
    type: "select",
    options: []
  },
  {
    label: "采集状态",
    prop: "collectStatus",
    type: "select",
    options: [
      { label: "全部", value: "-1" },
      { label: "已采集", value: "1" },
      { label: "未采集", value: "0" }
    ]
  }
];

const tableColumn1 = [
  {
    label: "标签组",
    prop: "name",
  },
  {
    label: "标签",
    prop: "labels",
    type: "slot",
    slotName: "labels",
  },
  {
    label: "所属商协会",
    prop: "chamberName",
  },
  {
    label: "标签使用人数",
    prop: "useNum",
  },
  {
    label: "采集状态",
    prop: "collectStatus",
    type: "function",
    callback: (row) => {
      if (row.collectStatus == 0) {
        return "未采集"
      } else if (row.collectStatus == 1) {
        return "已采集"
      } else {
        return "--"
      }
    }
  },
  {
    label: "操作",
    prop: "operate",
    type: "slot",
    slotName: "operate",
  },
];

export default {
  formItem,
  formData,
  tableColumn,
  formItem1,
  formData1,
  tableColumn1,
};
