<template>
  <div class="app-container">
    <div class="block">
      <div class="stat-card">
        <div class="card-box">
          <div class="card-box-3">
            <div class="card-key">本月交易额（元）</div>
            <div class="card-value">¥{{pfMonthStatistics.sumShopPrice}}</div>
          </div>
        </div>
        <div class="cut-line"></div>
        <div class="card-box">
          <div class="card-box-3">
            <div class="card-key">累计交易额（元）</div>
            <div class="card-value">¥{{pfStatistics.cumulativeShopPrice}}</div>
          </div>
        </div>
        <div class="cut-line"></div>
        <div class="card-box">
          <div class="card-box-3">
            <div class="card-key">累计收益（商会分成）</div>
            <div class="card-value">¥{{pfStatistics.cumulativeShopPrice - pfStatistics.cumulativePlatfromDeduction}}</div>
          </div>
        </div>
        <div class="cut-line"></div>
        <div class="card-box">
          <div class="card-box-3">
            <div class="card-key">可提现金额（元）</div>
            <div class="card-value" style="color: #FF0000;">¥{{pfStatistics.shopLave}}</div>
          </div>
        </div>
        <div class="card-box">
          <div class="card-box-3">
            <el-button type="danger" :actionid="getId('', '前往结算提现')" v-if="has('', '前往结算提现')" @click="goSettle">前往结算提现</el-button>
          </div>
        </div>
      </div>
    </div>
    <el-tabs>
      <el-tab-pane label="收益数据"></el-tab-pane>
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
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="fetchData"
        size="mini">
      </el-date-picker>
      <el-button type="primary" size="mini" :actionid="getId('', '导表')" v-if="has('', '导表')" style="float: right;" @click="exportExcel($event)">导表</el-button>
    </div>
    <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" border fit highlight-current-row @selection-change="handleSelectionChange">
      <!-- <el-table-column type="selection" width="55px">
      </el-table-column> -->
      <!-- <el-table-column type="index" label="序号" width="60px">
      </el-table-column> --> 
      <el-table-column label="日期">
        <template slot-scope="scope">
          {{scope.row.rptDate | dateFormat2}}
        </template>
      </el-table-column>
      <el-table-column label="交易额（元）">
        <template slot-scope="scope">
          {{scope.row.shopPrice}}
        </template>
      </el-table-column>
      <el-table-column label="商会分成（元）">
        <template slot-scope="scope">
          <span style="color: #FF0000;">{{scope.row.shopDeduction}}</span>
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
      @current-change="handleCurrentChange">
    </el-pagination>
  </div>
</template>

<script src="./mallTrade.js"></script>

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
.card-box {
  float: left;
  width: 19.5%;
  height: 100%;
  text-align: center;
  display: table;
}
.card-box-3 {
  width: 100%;
  display: table-cell;
  vertical-align: middle;
}
.card-key {
}
.card-value {
  margin-top: 10px;
  color: #008000;
  font-weight: 600;
}
.cut-line {
  float: left;
  margin-top: 42px;
  width: 1px;
  height: 36px;
  border-left: 1px solid #ccc;
}
</style>
