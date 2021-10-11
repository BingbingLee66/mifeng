import {
  getSettlementOrderDetailMsg,
  getSettlementOrderDetailList,
  getOrderList,
  removeOrder,
  addOrder,
} from "@/api/finance/finance";
export default {
  components: {
    financeRules: () => import("@/components/common/FinanceRules.vue"),
  },
  data() {
    return {
      query: {
        pageSize: 10,
        page: 1,
        ckey: "",
        startTime: "",
        endTime: "",
        orderSn: "",
        wechatOrderNum: "",
      },
      orderQuery: {
        page: 1,
        pageSize: 10,
        skuId: 0,
        orderSn: "",
        wechatOrderNum: "",
      },
      total: 0,
      orderTotal: 0,
      selectTime: [],
      calculationRulesDia: false,
      settlementMsg: {}, // 结算单信息
      listLoading: false,
      list: [], // 结算单列表
      settlementId: 0, // 结算单id
      addOrderDia: false, // 添加订单弹窗
      removeOrderDia: false, // 移除订单弹窗
      orderList: [], // 订单列表
      ids: [], // 多选订单id
      removeId: 0, // 移除订单id
      addLoading: false,
    };
  },
  computed: {
    ckey() {
      return this.$store.getters.ckey;
    },
  },
  watch: {
    selectTime(newData) {
      if (!newData) {
        this.query.startTime = "";
        this.query.endTime = "";
      } else {
        this.query.startTime = newData[0];
        this.query.endTime = newData[1];
      }
    },
  },
  created() {
    this.settlementId = this.$route.query.settlementId;
    this.orderQuery.skuId = this.$route.query.skuId;
    this.getDetailMsg();
    this.getDetailList();
  },
  filters: {
    filterStatus(val) {
      switch (val) {
        case 0:
          return "待商务确认";
        case 1:
          return "待财务付款";
        case 2:
          return "财务已付款";
        default:
          return `状态出错${val}`;
      }
    },
  },
  mounted() {},
  methods: {
    headerRowStyle() {
      return "background:rgb(251 251 251);";
    },
    has(tabName, actionName) {
      return this.$store.getters.has({
        tabName,
        actionName,
      });
    },
    getId(tabName, actionName) {
      return this.$store.getters.getId({
        tabName,
        actionName,
      });
    },
    handleSizeChange(val, str) {
      this[str].pageSize = val;
      this[str].page = 1;
      console.log(this[str]);
    },
    handleCurrentChange(val) {
      this[str].page = val;
    },
    handleSelectionChange(val) {
      this.ids = [];
      val.forEach((item) => {
        this.ids.push({
          id: item.id,
          settlementId: this.settlementId * 1,
        });
      });
    },
    fetchData() {
      this.getDetailMsg();
      this.getDetailList();
    },
    // 查询结算单信息
    async getDetailMsg() {
      let res = await getSettlementOrderDetailMsg(this.settlementId);
      if (res.state !== 1) return this.$message.error(res.msg);
      this.settlementMsg = res.data;
    },
    // 查询结算单列表
    async getDetailList() {
      let params = {
        ...this.query
      };
      params.id = this.settlementId;
      if (this.ckey) params.ckey = this.ckey;
      let res = await getSettlementOrderDetailList(params);
      this.listLoading = true;
      try {
        this.listLoading = false;
        if (res.state !== 1) return this.$message.error(res.msg);
        this.list = res.data.list;
      } catch (e) {
        this.listLoading = false;
        console.log(e);
      }
    },
    // 查询订单列表
    async getOrderList() {
      let params = {
        ...this.orderQuery
      };
      if (this.ckey) params.ckey = this.ckey;
      let res = await getOrderList(params);
      this.listLoading = true;
      try {
        this.listLoading = false;
        if (res.state !== 1) return this.$message.error(res.msg);
        this.orderList = res.data.list;
      } catch (e) {
        this.listLoading = false;
        console.log(e);
      }
    },
    // 点击添加订单
    handleAddOrder() {
      // this.orderQuery.supplierId = this.settlementMsg.supplierId; // 供货商id
      this.getOrderList();
      this.addOrderDia = true;
    },
    // 点击移除订单
    handleRemove(e, row) {
      this.removeId = row.id;
      this.removeOrderDia = true;
    },
    // 移除订单 removeOrder
    removeOrder() {
      removeOrder(this.removeId).then(() => {
        this.removeOrderDia = false
        this.$message.success('移除成功')
        this.fetchData()
      })
    },
    // 添加订单 addOrder
    async addOrder() {
      if (this.ids.length === 0)
        return this.$message.error("没有选择记录，操作失败");
      this.addLoading = true
      let res = await addOrder(this.ids)
      console.log('添加订单res:', res);
      try {
        this.addLoading = false
        if (res.state !== 1) return this.$message.error(res.msg)
        this.addOrderDia = false
        this.$message.success('添加成功')
        this.fetchData()
      } catch (e) {
        this.addLoading = false
        console.log(e)
      }
    },
    // 关闭计算规则弹窗
    closeDia() {
      this.calculationRulesDia = false;
    },

    // 导出表格
    exportExcel() {
      let params = {
        ...this.query,
      };
      let paramString = `?startTime=${params.startTime}&endTime=${params.endTime}&wechatOrderNum=${params.wechatOrderNum}&orderSn=${params.orderSn}&id=${this.settlementId}`;
      if (this.ckey) paramString += `&ckey=${this.ckey}`;
      console.log('paramString', paramString);
      let a = document.createElement("a");
      a.download = "";
      a.href =
        process.env.VUE_APP_BASE_API_2 +
        "/ec/mall/settlement-order-download" +
        paramString;
      a.click();
    },
  },
};
