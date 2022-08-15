import { getUserList, updateUserStatus } from "@/api/member/manager";
import { getChamberAllList } from "@/api/goods/goods";
import attachLabel from "@/components/Label/attach-label";
import moreLabel from "@/components/Label/more-label";
import Labels from "@/api/labels/labels";
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
      labelOptions: []
    };
  },
  computed: {
    labelProps() {
      return {
        multiple: true,
        lazy: true,
        lazyLoad: this.lazyLoad
      };
    }
  },
  created() {
    this.getAllChamberList();
    this.init();
  },
  methods: {
    // 选择会员选择标签
    handleLabelChange() {
      if (this.memberLabelIds.length === 0) {
        let eleLabel = this.$refs.eleLabel;
        eleLabel.panel.activePath = [];
        eleLabel.panel.loadCount = 0;
        eleLabel.panel.lazyLoad();
      }
    },
    async lazyLoad(node, resolve) {
      let level = node.level;
      let result;
      switch (level) {
        case 0:
          const res0 = await Labels.getLabelGroupLst({
            noPaging: true,
            sourceCkeyList: "",
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
          result = memberLabelList0.filter(
            item => !map.has(item.value) && map.set(item.value, 1)
          );
          break;
        case 1:
          const res1 = await Labels.getLabelGroupLst({
            noPaging: true,
            sourceCkeyList: node.data.value,
            freeze: 0,
            selectType: 2
          });
          result = res1.data.list.map(item => {
            return {
              value: item.id,
              label: item.name
            };
          });
          break;
        case 2:
          const res2 = await Labels.getLabelGroupLst({
            noPaging: true,
            groupId: node.data.value,
            freeze: 0,
            selectType: 2
          });
          result = res2.data.list.map(item => {
            return {
              value: item.id,
              label: item.name
            };
          });
          break;
        default:
          result = [];
          break;
      }
      resolve(result);
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
      console.log("memberLabelIdsmemberLabelIds", this.memberLabelIds);
      let params = {
        pageSize: this.limit,
        page: this.currentpage,
        userType: this.query.userType,
        status: this.query.status,
        chamberId: this.query.chamberId
      };
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
        this.list = response.data.data.list;
        this.total = response.data.data.totalRows;
        this.listLoading = false;
      });
    },
    detail(e, row) {
      window.localStorage.setItem(
        "actionId",
        e.currentTarget.getAttribute("actionid")
      );
      this.$router.push({ name: "用户详情", params: { userDetail: row } });
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
    },

    /* 打标签 */
    handleAttach() {
      if (this.multipleSelection.length === 0) {
        return this.$message.warning("请至少选择一位用户");
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
      moreData.labeList = rowData.platformTag.map(item => {
        return {
          id: item.tagId,
          name: item.tagName
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
