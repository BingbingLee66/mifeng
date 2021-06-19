<template>
  <div class="app-container">
    <div class="block">
      <div style="font-weight: 600; font-size: 18px;margin-bottom: 10px;">
        概览
      </div>
      <div class="data-card">
        <div class="m-card-box">
          <div class="card-box-3">
            <div class="card-key">在售商品数</div>
            <div class="card-value">{{pfStatistics.activeGoodsTotal}}</div>
          </div>
        </div>
        <div class="h-cut-line"></div>
        <div class="m-card-box">
          <div class="card-box-3">
            <div class="card-key">累计上架商品数</div>
            <div class="card-value">{{pfStatistics.goodsTotal}}</div>
          </div>
        </div>
        <div class="h-cut-line"></div>
        <div class="m-card-box">
          <div class="card-box-3">
            <div class="card-key">累计收益（商会分成）</div>
            <div class="card-value">{{pfStatistics.incomeTotal}}</div>
          </div>
        </div>
        <div class="h-cut-line"></div>
        <div class="m-card-box">
          <div class="card-box-3">
            <div class="card-key">累计成交金额</div>
            <div class="card-value">{{pfStatistics.tradingTotal}}</div>
          </div>
        </div>
        <div class="h-cut-line"></div>
        <div class="m-card-box">
          <div class="card-box-3">
            <div class="card-key">累计订单数</div>
            <div class="card-value">{{pfStatistics.goodsOrderTotal}}</div>
          </div>
        </div>
        <div class="h-cut-line"></div>
        <div class="m-card-box">
          <div class="card-box-3">
            <div class="card-key">累计访问人数</div>
            <div class="card-value" style="color: #FF0000;">{{pfStatistics.accessTotal}}</div>
          </div>
        </div>
      </div>
    </div>
    <el-tabs>
      <el-tab-pane label="交易数据"></el-tab-pane>
    </el-tabs>
    <div class="block">
      <span style="color: #bbb;margin-right: 20px;">时间</span>
      <el-radio-group v-model="query1.days" size="mini" @change="initDatePicker1">
        <el-radio-button :label="7" >7天</el-radio-button>
        <el-radio-button :label="14">14天</el-radio-button>
        <el-radio-button :label="30">30天</el-radio-button>
      </el-radio-group>
      <el-date-picker
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        v-model="query1.date"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="fetchData1"
        size="mini">
      </el-date-picker>
      <el-button type="primary" size="mini" style="float: right;">导表</el-button>
    </div>
    <el-table :data="list1" v-loading="listLoading1" element-loading-text="Loading" border fit highlight-current-row @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55px">
      </el-table-column>
      <!-- <el-table-column type="index" label="序号" width="60px">
      </el-table-column> --> 
      <el-table-column label="日期">
        <template slot-scope="scope">
          {{scope.row.date}}
        </template>
      </el-table-column>
      <el-table-column label="订单总数">
        <template slot-scope="scope">
          {{scope.row.orderTotal}}
        </template>
      </el-table-column>
      <el-table-column label="成交总额(元)">
        <template slot-scope="scope">
          {{scope.row.realPrice}}
        </template>
      </el-table-column>
      <el-table-column label="商会分成(元)">
        <template slot-scope="scope">
          {{scope.row.platformDeduction}}
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="total, sizes, prev, pager, next, jumper"
      :page-sizes="pageSizes1"
      :page-size="limit1"
      :total="total1"
      :current-page.sync="currentpage1"
      @size-change="handleSizeChange1"
      @current-change="handleCurrentChange1">
    </el-pagination>
    <el-tabs>
      <el-tab-pane label="商品排行榜"></el-tab-pane>
    </el-tabs>
    <div class="block">
      <span style="color: #bbb;margin-right: 20px;">时间</span>
      <el-radio-group v-model="query2.days" size="mini" @change="initDatePicker2">
        <el-radio-button :label="7" >7天</el-radio-button>
        <el-radio-button :label="14">14天</el-radio-button>
        <el-radio-button :label="30">30天</el-radio-button>
      </el-radio-group>
      <el-date-picker
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        v-model="query2.date"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="fetchData2"
        size="mini">
      </el-date-picker>
      <!-- <el-button type="primary" size="mini" style="float: right;">导表</el-button> -->
    </div>
    <el-table :data="list2" v-loading="listLoading2" element-loading-text="Loading" border fit highlight-current-row>
      <!-- <el-table-column type="selection" width="55px">
      </el-table-column> -->
      <!-- <el-table-column type="index" label="序号" width="60px">
      </el-table-column> --> 
      <el-table-column label="商品名称">
        <template slot-scope="scope">
          {{scope.row.goodsName}}
        </template>
      </el-table-column>
      <el-table-column label="上架时间">
        <template slot-scope="scope">
          {{scope.row.createTime | dateFormat}}
        </template>
      </el-table-column>
      <el-table-column label="访客数">
        <template slot-scope="scope">
          {{scope.row.visitorsCount}}
        </template>
      </el-table-column>
      <el-table-column label="浏览量">
        <template slot-scope="scope">
          {{scope.row.viewingCount}}
        </template>
      </el-table-column>
      <el-table-column label="下单数">
        <template slot-scope="scope">
          {{scope.row.goodsOrderTotal}}
        </template>
      </el-table-column>
      <el-table-column label="成交额(元)">
        <template slot-scope="scope">
          {{scope.row.tradingTotal}}
        </template>
      </el-table-column>
      <el-table-column label="付款人数">
        <template slot-scope="scope">
          {{scope.row.paidMembers}}
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <div v-if="(scope.row.isOnSale == 1 || scope.row.isOnSale == 3) && scope.row.sumStock > 0">在售</div>
          <div v-if="scope.row.isOnSale == 2 || scope.row.isOnSale == 4">下架</div>
          <div v-if="(scope.row.isOnSale == 1 || scope.row.isOnSale == 3) && scope.row.sumStock == 0">售罄</div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="total, sizes, prev, pager, next, jumper"
      :page-sizes="pageSizes2"
      :page-size="limit2"
      :total="total2"
      :current-page.sync="currentpage2"
      @size-change="handleSizeChange2"
      @current-change="handleCurrentChange2">
    </el-pagination>
  </div>
</template>

<script src="./mallData.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/common.scss";
</style>
<style>
.data-card {
  width: 100%;
  height: 120px;
  border-radius: 2px;
  border: 1px solid #ccc;
}
.m-card-box {
  float: left;
  width: 16.6%;
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
.h-cut-line {
  float: left;
  width: 1px;
  height: 100%;
  border-left: 1px solid #ccc;
}
</style>