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
          <el-col :span="5" class="number-input">
            <el-form-item label-width="90px" label="订单编号：">
              <el-input
                v-model.trim="query.orderSn"
                oninput="if(value.length>50)value=value.slice(0,50)"
                type="number"
                clearable
                data-id="orderSn"
                @mousewheel.native.prevent
                placeholder="请输入订单编号"
              />
            </el-form-item>
          </el-col>
          <el-col :span="5" class="number-input">
            <el-form-item
              label-width="100px"
              label="微信订单号："
              class="mar-left"
            >
              <el-input
                v-model.trim="query.wechatOrderNum"
                oninput="if(value.length>50)value=value.slice(0,50)"
                type="number"
                clearable
                data-id="wechatOrderNum"
                @mousewheel.native.prevent
                placeholder="请输入微信订单号"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-button
              type="primary"
              size="small"
              style="margin-left: 20px"
              @click="fetchData"
              >查询</el-button
            >
            <el-button
              type="text"
              @click="handleAddOrder"
              v-if="ckey && settlementMsg.status == 0"
              >添加订单</el-button
            >
            <el-button type="text" icon="el-icon-download" @click="exportExcel"
              >导出表格</el-button
            >
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
        <p>规格：{{ settlementMsg.skuName || "--" }}</p>
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
            <div>【商品服务费率】{{ scope.row.serviceFeeRatio }} %</div>
            <div>【商品服务费】{{ scope.row.serviceFee }}</div>
            <div>【微信手续费率】{{ scope.row.wxServiceFeeRatio }} %</div>
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
      <el-table-column
        label="操作"
        fixed="right"
        width="150"
        v-if="ckey && settlementMsg.status == 0"
      >
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
      position="detail"
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
          ><span>{{ settlementMsg.skuName || "--"}}</span>
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
            <el-col :span="6" class="number-input">
              <el-form-item label-width="90px" label="订单编号：">
                <el-input
                  v-model="orderQuery.orderSn"
                  oninput="if(value.length>50)value=value.slice(0,50)"
                  type="number"
                  clearable
                  data-id="addOrderSn"
                  @mousewheel.native.prevent
                  placeholder="请输入订单编号"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6" class="number-input">
              <el-form-item
                label-width="100px"
                label="微信订单号："
                class="mar-left"
              >
                <el-input
                  v-model="orderQuery.wechatOrderNum"
                  oninput="if(value.length>50)value=value.slice(0,50)"
                  type="number"
                  clearable
                  data-id="addWechatOrderNum"
                  @mousewheel.native.prevent
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
        v-loading="addLoading"
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

<script src="./settlementDetail.js"></script>

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


<style lang="scss">
.number-input {
  .el-input__inner {
    line-height: 1;
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none !important;
  }

  input[type="number"] {
    -moz-appearance: textfield;
  }
}
</style>