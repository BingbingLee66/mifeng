const formData = {
  // 标签组名称
  labelGroupName: "",
  // 标签名称
  labelName: "",
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



export default {
  formItem,
  formData,
  tableColumn,
};
