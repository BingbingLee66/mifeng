<template>
  <div class="app-container">
    <div class="block">
      <el-form ref="query" label-position="right" :model="query">
        <el-row>
          <el-col :span="7">
            <el-form-item label-width="90px" label="交易时间：">
              <el-date-picker
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                v-model="selectTime"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label-width="90px" label="订单编号：">
              <el-input v-model="query.orderSn" placeholder="请输入订单编号" />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item
              label-width="100px"
              label="微信订单号："
              class="mar-left"
              style="margin-left: 20px"
            >
              <el-input
                v-model="query.wechatOrderNum"
                placeholder="请输入微信订单号"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-button type="primary" size="small" style="margin-left: 20px"
              >查询</el-button
            >
            <el-button type="text" @click="handleAddOrder" v-if="ckey"
              >添加订单</el-button
            >
            <el-button type="text" icon="el-icon-download">导出表格</el-button>
            <el-button type="text" @click="calculationRulesDia = true"
              >计算规则</el-button
            >
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- --------------------------------信息-------------------------------- -->
    <div class="block settlement-msg">
      <div class="msg-block left">
        <p>生成结算单时间：{{ settlementMsg.createdTs | dateFormat }}</p>
        <p>状态：{{ settlementMsg.status | filterStatus }}</p>
        <p>申请财务打款时间：{{ settlementMsg.operateApplyTs | dateFormat }}</p>
        <p>财务标记“已打款”时间：{{ settlementMsg.paidTs | dateFormat }}</p>
      </div>
      <div class="msg-block center">
        <p>商品名称：{{ settlementMsg.goodsName }}</p>
        <p>规格：{{ settlementMsg.skuName }}</p>
        <p>应打款金额：{{ settlementMsg.payable }}</p>
        <p>
          供货商：{{ settlementMsg.supplierName }}&ensp;&ensp;{{
            settlementMsg.supplierPhone
          }}
        </p>
      </div>
      <div class="msg-block right">
        <p>账户名：{{ settlementMsg.companyName }}</p>
        <p>开户行：{{ settlementMsg.bankName }}</p>
        <p>银行卡号：{{ settlementMsg.bankCard }}</p>
      </div>
    </div>

    <!-- --------------------------------表格-------------------------------- -->
    <el-table
      :data="list"
      v-loading="listLoading"
      element-loading-text="Loading"
      border
    >
      <el-table-column label="交易时间">
        <template slot-scope="scope">{{
          scope.row.tradeTime | dateFormat
        }}</template>
      </el-table-column>
      <el-table-column label="订单编号" prop="orderSn"></el-table-column>
      <el-table-column
        label="微信订单号"
        prop="wechatOrderNum"
      ></el-table-column>
      <el-table-column
        label="应付款金额（元）"
        prop="payable"
      ></el-table-column>
      <el-table-column label="价格（元）">
        <template slot-scope="scope">
          <div class="layout-box">
            <div>【单买价】{{ scope.row.price }}</div>
            <div>【供货价】{{ scope.row.supplyPrice }}</div>
          </div></template
        >
      </el-table-column>
      <el-table-column
        label="买家实付金额（元）"
        prop="payment"
      ></el-table-column>
      <el-table-column label="服务费" width="280">
        <template slot-scope="scope">
          <div class="layout-box">
            <div>【商品服务费率】{{ scope.row.serviceFeeRatio }}</div>
            <div>【商品服务费】{{ scope.row.serviceFee }}</div>
            <div>【微信手续费率】{{ scope.row.wxServiceFeeRatio }}</div>
            <div>【微信手续费】{{ scope.row.wxServiceFee }}</div>
          </div></template
        >
      </el-table-column>
      <el-table-column label="优惠（元）">
        <template slot-scope="scope">
          <div class="layout-box">
            <div>【立减优惠】{{ scope.row.discount }}</div>
            <div>【优惠劵】{{ scope.row.coupon }}</div>
          </div></template
        >
      </el-table-column>
      <el-table-column label="购买数量（件）" prop="num"></el-table-column>
      <el-table-column label="购买人">
        <template slot-scope="scope">
          <div class="layout-box">
            <div>{{ scope.row.buyerName }}</div>
            <div>{{ scope.row.buyerPhone }}</div>
          </div></template
        >
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="150" v-if="ckey">
        <template slot-scope="scope">
          <el-button type="text" @click="handleRemove($event, scope.row)"
            >移除订单</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="total, sizes, prev, pager, next, jumper"
      :page-sizes="[10, 20, 50, 100, 500]"
      :page-size="query.pageSize"
      :total="total"
      :current-page.sync="query.page"
      @size-change="(val) => handleSizeChange(val, 'query')"
      @current-change="(val) => handleCurrentChange(val, 'query')"
      :style="{ 'padding-top': '15px' }"
    >
    </el-pagination>
    <!-- --------------------------计算规则弹窗-------------------------- -->
    <finance-rules
      :calculationRulesDia="calculationRulesDia"
      @closeDia="closeDia"
    ></finance-rules>

    <!-- --------------------------移除订单弹窗-------------------------- -->
    <el-dialog
      title="移除订单"
      :visible.sync="removeOrderDia"
      width="25%"
      center
    >
      <div class="remove-dia-msg">确定将该订单从此结算单中移除吗？</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="removeOrderDia = false">取 消</el-button>
        <el-button type="primary" @click="removeOrder">确 定</el-button>
      </div>
    </el-dialog>

    <!-- --------------------------添加订单弹窗-------------------------- -->
    <el-dialog title="添加订单" :visible.sync="addOrderDia" width="70%" center>
      <div class="dia-msg-box">
        <div class="tip-box">
          <span class="tip">商品名称：</span
          ><span>{{ settlementMsg.goodsName }}</span>
        </div>
        <div class="tip-box">
          <span class="tip">规格：</span
          ><span>{{ settlementMsg.skuName }}</span>
        </div>
        <div class="tip-box">
          <span class="tip">供货商：</span
          ><span
            >{{ settlementMsg.supplierName }}&ensp;&ensp;{{
              settlementMsg.supplierPhone
            }}</span
          >
        </div>
      </div>
      <div class="block">
        <el-form ref="orderQuery" label-position="left" :model="orderQuery">
          <el-row>
            <el-col :span="6">
              <el-form-item label-width="90px" label="订单编号：">
                <el-input
                  v-model="orderQuery.orderSn"
                  placeholder="请输入订单编号"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label-width="100px"
                label="微信订单号："
                class="mar-left"
              >
                <el-input
                  v-model="orderQuery.wechatOrderNum"
                  placeholder="请输入微信订单号"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item class="mar-left">
                <el-button type="primary" size="small" @click="getOrderList"
                  >查询</el-button
                >
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <el-table
        :data="orderList"
        v-loading="listLoading"
        element-loading-text="Loading"
        border
        @selection-change="handleSelectionChange"
        :header-cell-style="headerRowStyle"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column label="订单编号" prop="orderSn"></el-table-column>
        <el-table-column
          label="微信订单号"
          prop="wechatOrderNum"
        ></el-table-column>
        <el-table-column label="下单时间" prop="createdTs"></el-table-column>
        <el-table-column label="单价（元）" prop="price"></el-table-column>
        <el-table-column label="数量（件）" prop="num"></el-table-column>
        <el-table-column
          label="实付金额（元）"
          prop="payment"
        ></el-table-column>
        <el-table-column label="收货信息" width="280">
          <template slot-scope="scope">
            <div class="layout-box">
              <div>{{ scope.row.consignee }}</div>
              <div>{{ scope.row.mobile }}</div>
              <div>{{ scope.row.consigneeAddress }}</div>
            </div></template
          >
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :page-sizes="[10, 20, 50, 100, 500]"
        :page-size="orderQuery.pageSize"
        :total="orderTotal"
        :current-page.sync="orderQuery.page"
        @size-change="(val) => handleSizeChange(val, 'orderQuery')"
        @current-change="(val) => handleCurrentChange(val, 'orderQuery')"
        :style="{ 'padding-top': '15px' }"
      >
      </el-pagination>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addOrderDia = false">取 消</el-button>
        <el-button type="primary" @click="addOrder">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
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
    handleSelectionChange() {
      this.ids = [];
      val.forEach((item) => {
        this.ids.push({
          id: item.id,
          settlementId: this.settlementId,
        });
      });
    },
    // 查询结算单信息
    async getDetailMsg() {
      let res = await getSettlementOrderDetailMsg(this.settlementId);
      if (res.state !== 1) return this.$message.error(res.msg);
      this.settlementMsg = res.data;
    },
    // 查询结算单列表
    async getDetailList() {
      let params = { ...this.query };
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
      let params = { ...this.orderQuery };
      if (this.ckey) params.ckey = this.ckey;
      let res = await getOrderList(params);
      console.log("订单列表", res);
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
      console.log(this.removeId);
    },
    // 添加订单 addOrder
    addOrder() {
      if (this.ids.length === 0)
        return this.$message.error("没有选择记录，操作失败");
    },
    // 关闭计算规则弹窗
    closeDia() {
      this.calculationRulesDia = false;
    },
  },
};
</script>

<style rel="stylesheet/scss" scoped lang="scss">
@import "src/styles/common.scss";
// *******信息*******
.settlement-msg {
  display: flex;
  padding: 0 10px;
  width: 90%;
  .msg-block {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: left;
    p {
      margin-top: 0;
      font-size: 14px;
      color: #606266;
    }
  }
}
.layout-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: left;
}

// *******添加订单信息*******
.dia-msg-box {
  display: flex;
  margin-bottom: 20px;
  .tip-box {
    margin-right: 50px;
    .tip {
      font-size: 14px;
      color: #606266;
      font-weight: 700;
    }
  }
}
.mar-left {
  margin-left: 20px;
}

// **********移除弹窗**********
.remove-dia-msg {
  width: 100%;
  text-align: center;
  margin: 15px 0;
}
</style>
