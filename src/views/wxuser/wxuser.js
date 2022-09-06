import { getUserList, updateUserStatus } from "@/api/member/manager";
import { getChamberAllList } from "@/api/goods/goods";
import attachLabel from "@/components/Label/attach-label";
import moreLabel from "@/components/Label/more-label";
import Labels from "@/api/labels/labels";
import { getAvailableLabelList, getTradeLabelList } from "@/api/lable";
export default {
  components: {
    "attach-label": attachLabel,
    "more-label": moreLabel
  },
  data() {
    return {
      chamberOptions: [],
      listLoading: false,
      pageSizes: [10, 20, 50, 100, 500],
      total: 0,
      list: [],
      currentpage: 1,
      limit: 10,
      typeOptions: [],
      query: {
        uname: "",
        mulValue: "",
        userType: -1,
        chamberId: -1,
        status: -1,
        date: ""
      },
      multipleSelection: [],
      attachVisible: false,
      moreVisible: false,
      moreType: "",
      moreData: {},
      memberLabelIds: [],
      labelOptions: [],
      platformLabelIds: [],
      PlatformOptions: [],
      supplyIds: [],
      industryIds: [],
      SupplyformOptions: [],
      IndustryformOptions: []
    };
  },
  created() {
    this.getAllChamberList();
    this.getLabelOptions();
    this.getPlatformOptions();
    this.getSupplyformOptions();
    this.getIndustryformOptions();
    // this.init();
    this.fetchData(1);
  },
  methods: {
    async getLabelOptions() {
      const res0 = await Labels.getLabelGroupLst({
        noPaging: true,
        freeze: 0,
        selectType: 2
      });
      const memberLabelList0 = res0.data.list.map(item => {
        return {
          value: item.ckey,
          label: item.chamberName
        };
      });
      const map = new Map();
      const chamberList = memberLabelList0.filter(
        item => !map.has(item.value) && map.set(item.value, 1)
      );
      let _labelOptions = chamberList;
      let sourceCkeyList = chamberList.map(item => {
        return item.value;
      });
      sourceCkeyList = sourceCkeyList.join(",");
      const res = await Labels.getLabelGroupLst({
        noPaging: true,
        sourceCkeyList: sourceCkeyList,
        freeze: 0
      });
      let memberLabelList = res.data.list || [];
      _labelOptions.forEach(item => {
        item.children = [];
        memberLabelList.forEach(item1 => {
          if (item1.ckey === item.value) {
            item.children.push({
              value: item1.id,
              label: item1.name,
              children:
                item1.memberLabelVOList && item1.memberLabelVOList
                  ? item1.memberLabelVOList.map(item2 => {
                      return {
                        value: item2.id,
                        label: item2.name
                      };
                    })
                  : []
            });
          }
        });
      });
      this.labelOptions = _labelOptions;
    },
    async getPlatformOptions() {
      const res = await Labels.getLabelGroupLst({
        noPaging: true,
        dataSource: 0,
        freeze: 0
      });
      let memberLabelList = res.data.list || [];
      let _memberLabelList = memberLabelList.map(item => {
        let obj = {
          value: item.id,
          label: item.name,
          children: item.memberLabelVOList.map(item => {
            return {
              value: item.id,
              label: item.name
            };
          })
        };
        return obj;
      });
      this.PlatformOptions = _memberLabelList;
    },
    async getSupplyformOptions() {
      //供需
      const res = await getAvailableLabelList();
      console.log(res);
      if (res.state != 1) return this.$message.error("供需标签请求失败");
      this.SupplyformOptions = res.data;
    },
    async getIndustryformOptions() {
      const res = await getTradeLabelList();
      // 行业
      if (res.state != 1) return this.$message.error("行业标签请求失败");
      this.IndustryformOptions = res.data.map(item => {
        return {
          value: item.id,
          label: item.typeName,
          children: item.subList.map(item1 => {
            return {
              value: item1.id,
              label: item1.typeName
            };
          })
        };
      });
    },
    clickRouter() {
      this.$router.push({
        name: "新加的官方号"
      });
    },
    has(tabName, actionName) {
      return this.$store.getters.has({ tabName, actionName });
    },
    getId(tabName, actionName) {
      return this.$store.getters.getId({ tabName, actionName });
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.limit = val;
      this.currentpage = 1;
      this.fetchData();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentpage = val;
      this.fetchData();
    },
    init() {
      if (this.has("", "查询")) {
        this.fetchData();
      }
    },
    getAllChamberList() {
      getChamberAllList().then(res => {
        console.log("所有商会列表：", res);
        if (res.state === 1) {
          this.chamberOptions = res.data.data;
          this.chamberOptions.unshift(
            { name: "全部", id: -1 },
            { name: "未加入商会", id: -2 }
          );
          this.aLLChamberlist;
          this.listLoading = false;
        } else {
          console.log(res);
          this.listLoading = false;
        }
      });
    },
    fetchData(e) {
      if (e !== undefined) {
        if (e !== 1) {
          window.localStorage.setItem(
            "actionId",
            e.currentTarget.getAttribute("actionid")
          );
        }
        this.currentpage = 1;
      }
      this.listLoading = true;
      let _tagIds = "";
      if (this.memberLabelIds.length > 0) {
        let ids = this.memberLabelIds.map(item => {
          item = item.filter((id, idx) => {
            return idx === 2;
          });
          return item[0];
        });
        _tagIds = ids.join(",");
      }
      if (this.platformLabelIds.length > 0) {
        let ids = this.platformLabelIds.map(item => {
          item = item.filter((id, idx) => {
            return idx === 1;
          });
          return item[0];
        });
        _tagIds = _tagIds + "," + ids.join(",");
        _tagIds = _tagIds.replace(/^(\s|,)+|(\s|,)+$/g, "");
      }
      // 供需标签
      let supIds = "";
      if (this.supplyIds.length > 0) {
        supIds = this.supplyIds.join(",");
        console.log(supIds);
      }
      // 行业标签
      let indusIds = "";
      if (this.industryIds.length > 0) {
        indusIds = this.industryIds.map(item => item[1]).join(",");
        console.log(indusIds);
      }
      let params = {
        pageSize: this.limit,
        page: this.currentpage,
        userType: this.query.userType,
        status: this.query.status,
        chamberId: this.query.chamberId,
        tagIds: _tagIds,
        tradeLabelIds: indusIds,
        demandLabelIds: supIds
      };
      console.log(params, "行业标签");
      if (this.query.mulValue) {
        params["mulValue"] = this.query.mulValue;
      }
      if (this.query.chamberName) {
        params["chamberName"] = this.query.chamberName;
      }
      if (this.query.uname) {
        params["uname"] = this.query.uname;
      }
      if (this.query.date) {
        params["startTs"] = this.query.date[0];
        params["endTs"] = this.query.date[1];
      }
      getUserList(params).then(response => {
        console.log(response, "wuhuqifei");
        this.list = response.data.data.list || [];
        // console.log(this.list, "asdsadsadsadsadsadsa");
        this.total = response.data.data.totalRows;
        this.listLoading = false;
      });
    },
    detail(e, row) {
      window.localStorage.setItem(
        "actionId",
        e.currentTarget.getAttribute("actionid")
      );
      this.$router.push({
        name: "用户详情",
        query: { userId: row.id },
        params: { userDetail: row }
      });
    },
    updateStatus(e, row) {
      window.localStorage.setItem(
        "actionId",
        e.currentTarget.getAttribute("actionid")
      );
      let params = {
        userId: row.id,
        action: row.status === 0 ? "active" : "notactive"
      };
      updateUserStatus(params).then(response => {
        if (row.status === 0) {
          this.$message({
            message: "解冻成功",
            type: "success"
          });
        } else {
          this.$message({
            message: "冻结成功",
            type: "success"
          });
        }
        this.fetchData();
      });
    },

    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(this.multipleSelection);
    },

    /* 打标签 */
    handleAttach() {
      if (this.multipleSelection.length === 0) {
        return this.$message.error("请至少选择一位用户");
      }
      this.attachVisible = true;
      this.$refs.eleAttach.labelObj.selectType = "1";
      this.$refs.eleAttach.fetchData(1);
    },
    async handleConfirmAttach(labelIds) {
      if (labelIds.length === 0) {
        return this.$message.warning("请至少选择一个标签");
      }
      let wxUserIds = this.multipleSelection.map(item => {
        return item.id;
      });
      const res = await Labels.attachLabel({
        labelIds,
        wxUserIds
      });
      if (res.state !== 1) return this.$message.error(res.msg);
      this.$message.success(res.msg);
      this.attachVisible = false;
      this.fetchData(1);
    },
    handleCloseAttach() {
      this.attachVisible = false;
    },

    /** 查看更多标签 */
    handleMoreLabel(rowData) {
      this.moreType = "";
      let moreData = {
        labeList: []
      };
      moreData.labeList = rowData.map(item => {
        return {
          id: item.tagId,
          name: item.tagName
        };
      });
      this.moreData = moreData;
      this.moreVisible = true;
    },
    handleMorebridgeLabels(rowData) {
      this.moreType = "";
      let moreData = {
        labeList: []
      };
      moreData.labeList = rowData.bridgeLabels.map(item => {
        return {
          id: item.id,
          name: item.name
        };
      });
      this.moreData = moreData;
      this.moreVisible = true;
    },
    handleMoretradeBridges(rowData) {
      this.moreType = "";
      let moreData = {
        labeList: []
      };
      moreData.labeList = rowData.tradeBridges.map(item => {
        return {
          id: item.id,
          name: item.name
        };
      });
      this.moreData = moreData;
      this.moreVisible = true;
    },
    handleCloseMore() {
      this.moreVisible = false;
    },

    /** 移除标签 */
    handleRemoveLabel(rowData) {
      this.moreType = "delete";
      let moreData = {
        wxUserId: rowData.id,
        uname: rowData.uname,
        lableList: []
      };
      moreData.lableList = rowData.platformTag.map(item => {
        return {
          id: item.tagId,
          name: item.tagName
        };
      });
      this.moreData = moreData;
      this.moreVisible = true;
    },
    handleRemoveLabelConfirm() {
      this.moreVisible = false;
      this.fetchData(1);
    }
  }
};
