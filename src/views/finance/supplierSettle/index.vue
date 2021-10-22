<template>
  <div class="app-container">
    <div class="block">
      <el-form ref="query" label-position="right" :model="query">
        <el-row>
          <el-col :span="24">
            <el-form-item label-width="130px" label="结算单生成时间：">
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
        </el-row>
        <el-row>
          <el-col :span="5">
            <el-form-item label-width="130px" label="商品名称：">
              <el-input
                v-model="query.goodName"
                placeholder="请输入商品名称"
                maxlength="50"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item
              label-width="100px"
              label="供货商姓名："
              class="mar-left"
            >
              <el-input
                v-model="query.supplierName"
                placeholder="请输入供货商姓名"
                maxlength="50"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item
              label-width="110px"
              label="供货商手机号："
              class="mar-left"
            >
              <el-input
                v-model.trim="query.supplierPhone"
                placeholder="请输入供货商手机号"
                maxlength="11"
                clearable
                @input="checkNum"
              />
            </el-form-item>
          </el-col>
          <el-col :span="4" style="margin-left: 10px">
            <el-form-item label-width="60px" label="状态：">
              <el-select v-model="query.status" placeholder="请选择操作行为">
                <el-option label="全部" :value="-1"></el-option>
                <el-option
                  label="待商务确认"
                  :value="0"
                  v-if="ckey"
                ></el-option>
                <el-option label="待财务付款" :value="1"></el-option>
                <el-option label="财务已付款" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="block">
      <el-row>
        <el-col :span="24">
          <el-button type="primary" size="small" @click="fetchData($event)"
            >查询</el-button
          >
          <el-button
            type="text"
            icon="el-icon-download"
            @click.native="exportExcel($event)"
            >导出表格</el-button
          >
          <el-button type="text" @click="calculationRulesDia = true"
            >计算规则</el-button
          >
        </el-col>
      </el-row>
    </div>
    <el-table
      :data="list"
      v-loading="listLoading"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="商品&规格" width="180">
        <template slot-scope="scope">
          <div class="layout-box">
            <div>{{ scope.row.goodsName }}</div>
            <div>【规格】{{ scope.row.skuName || "--" }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="供货商" width="250">
        <template slot-scope="scope">
          <div class="layout-box">
            <div>【联系人姓名】{{ scope.row.supplierName }}</div>
            <div>【联系人手机号】{{ scope.row.supplierPhone || "--" }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="结算单生成时间/结算周期" width="220">
        <template slot-scope="scope">
          <div class="flex-box">
            <div>{{ scope.row.createdTs | dateFormat }}</div>
            <div>{{ scope.row.settlementPeriodStr }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="应付款金额（元）" width="140">
        <template slot-scope="scope">
          {{ scope.row.payable }}
        </template>
      </el-table-column>
      <el-table-column label="服务费（元）" width="180">
        <template slot-scope="scope">
          <div class="flex-box">
            <div>【商品服务费】{{ scope.row.serviceFee }}</div>
            <div>【微信手续费】{{ scope.row.wxServiceFee }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="买家实付金额（元）" width="150">
        <template slot-scope="scope">
          {{ scope.row.payment }}
        </template>
      </el-table-column>
      <el-table-column label="优惠（元）" width="180">
        <template slot-scope="scope">
          <div class="flex-box">
            <div>【立减优惠】{{ scope.row.discount }}</div>
            <div>【优惠劵】{{ scope.row.coupon }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作时间" width="290">
        <template slot-scope="scope">
          <div class="flex-box">
            <div>
              【运营申请时间】{{ scope.row.operateApplyTs | dateFormat }}
            </div>
            <div>【标记付款时间】{{ scope.row.paidTs | dateFormat }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="状态" min-width="120">
        <template slot-scope="scope">
          {{ scope.row.status | filterStatus }}
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" min-width="220">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="small"
            v-if="ckey && scope.row.status == 0"
            @click="judgeDiaShow(scope.row.id)"
            :loading="btnLoading"
            >申请财务付款</el-button
          >
          <el-button type="text" @click="detail(scope.row)">详情</el-button>
          <el-button
            type="primary"
            size="small"
            v-if="!ckey && scope.row.status == 1"
            @click="signPay(scope.row.id, 2)"
            >标记为已付款</el-button
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
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :style="{ 'padding-top': '15px' }"
    >
    </el-pagination>

    <!-- --------------------------计算规则弹窗-------------------------- -->
    <finance-rules
      :calculationRulesDia="calculationRulesDia"
      position="list"
      @closeDia="closeDia"
    ></finance-rules>

    <!-- ----------------------申请财务付款弹窗---------------------- -->
    <el-dialog title="申请财务付款" :visible.sync="paymentDia" width="25%" center>
      <span style="line-height: 24px" v-if="judgeCount != 0"
        >该操作无法撤销！请先确认结算单内的各款项明细，申请财务付款或者是财务付款之后，将无法再从结算单中添加/移除订单。</span
      >
      <div v-else style="width:100%;text-align: center;">该结算单内无订单，无法提交空的结算单。</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="paymentDia = false" v-if="judgeCount != 0">取 消</el-button>
        <el-button type="primary" @click="changeStatus(settlementId, 1)" v-if="judgeCount != 0">确 定</el-button>
        <el-button type="primary" @click="paymentDia = false" v-if="judgeCount == 0">我知道了</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script src="./supplierSettle.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/common.scss";
.mar-left {
  margin-left: 20px;
}
.layout-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: left;
}
</style>
