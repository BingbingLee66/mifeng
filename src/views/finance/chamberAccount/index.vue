<template>
  <div class="app-container">
    <div class="block">
      <div class="stat-card">
        <div class="left-box">
          <div class="card-box-1">
            <div class="card-key">商会累计交易额（元）</div>
            <div class="card-value">¥{{pfStatistics.cumulativeTransactionAmount}}</div>
          </div>
        </div>
        <div class="right-box">
          <div class="box-line">
            <div class="card-box-2">
              <div class="card-key">商城累计交易额（元）</div>
              <div class="card-value">¥{{pfStatistics.cumulativeShopPrice}}</div>
            </div>
            <div class="card-box-2">
              <div class="card-key">商城已提现（元）</div>
              <div class="card-value">¥{{pfStatistics.shopWithdraw == null ? 0 : pfStatistics.shopWithdraw}}</div>
            </div>
            <div class="card-box-2" style="border-right: 0;">
              <div class="card-key">商城待提现（元）</div>
              <div class="card-value" style="color: #FF0000;">¥{{pfStatistics.shopLave}}</div>
            </div>
          </div>
          <div class="box-line" style="border-bottom: 0;">
            <div class="card-box-2">
              <div class="card-key">会费累计交易额（元）</div>
              <div class="card-value">¥{{pfStatistics.cumulativeMemberPrice}}</div>
            </div>
            <div class="card-box-2">
              <div class="card-key">会费已提现（元）</div>
              <div class="card-value">¥{{pfStatistics.memberWithdraw == null ? 0 : pfStatistics.memberWithdraw}}</div>
            </div>
            <div class="card-box-2" style="border-right: 0;">
              <div class="card-key">会费待提现（元）</div>
              <div class="card-value" style="color: #FF0000;">¥{{pfStatistics.memberLave}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-tabs>
      <el-tab-pane label="交易数据"></el-tab-pane>
    </el-tabs>
    <div class="block">
      <span style="color: #bbb;margin-right: 20px;">时间</span>
      <el-radio-group v-model="query.days" size="mini" @change="initDatePicker">
        <el-radio-button :label="7" >7天</el-radio-button>
        <el-radio-button :label="14">14天</el-radio-button>
        <el-radio-button :label="30">30天</el-radio-button>
      </el-radio-group>
      <el-date-picker
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        v-model="query.date"
        type="daterange"
        :clearable="false"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="fetchData"
        size="mini">
      </el-date-picker>
      <el-button type="primary" size="mini" :actionid="getId('', '导表')" v-if="has('', '导表')" style="float: right;" @click="exportExcel($event)">导表</el-button>
    </div>
    <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" border fit highlight-current-row @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55px">
      </el-table-column>
      <!-- <el-table-column type="index" label="序号" width="60px">
      </el-table-column> --> 
      <el-table-column label="日期">
        <template slot-scope="scope">
          {{scope.row.rptDate | dateFormat2}}
        </template>
      </el-table-column>
      <el-table-column label="商城交易额(元）">
        <template slot-scope="scope">
          {{scope.row.shopPrice}}
        </template>
      </el-table-column>
      <el-table-column label="会费交易额（元）">
        <template slot-scope="scope">
          {{scope.row.memberPrice}}
        </template>
      </el-table-column>
      <el-table-column label="合计（元）">
        <template slot-scope="scope">
          {{Math.floor((scope.row.shopPrice + scope.row.memberPrice) * 100) / 100}}
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="total, sizes, prev, pager, next, jumper"
      :page-sizes="pageSizes"
      :page-size="limit"
      :total="total"
      :current-page.sync="currentpage"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :style="{'padding-top': '15px'}">
    </el-pagination>
  </div>
</template>

<script src="./chamberAccount.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/common.scss";
</style>
<style>
.stat-card {
  width: 100%;
  height: 120px;
  border-radius: 10px;
  border: 1px solid #ccc;
}
.left-box {
  float: left;
  width: 25%;
  height: 100%;
  text-align: center;
  display: table;
}
.right-box {
  /*float: left;*/
  width: 75%;
  height: 100%;
  text-align: center;
  display: table;
}
.card-box-1 {
  width: 100%;
  display: table-cell;
  vertical-align: middle;
  border-right: 1px solid #ccc;
}
.card-box-2 {
  width: 33%;
  display: table-cell;
  vertical-align: middle;
  border-right: 1px solid #ccc;
}
.box-line {
  width: 100%;
  height: 60px;
  display: table;
  border-bottom: 1px solid #ccc;
}
.card-key {
}
.card-value {
  margin-top: 10px;
  color: #008000;
  font-weight: 600;
}
</style>
