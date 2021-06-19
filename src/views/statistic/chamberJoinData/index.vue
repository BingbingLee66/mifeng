<template>
  <div class="app-container">
    <div class="block">
      <div style="font-weight: 600; font-size: 18px;margin-bottom: 10px;">
        商会入驻数据
      </div>
      <div class="data-card">
        <div class="c-card-box">
          <div class="card-box-3">
            <div class="card-key">本月商会入驻</div>
            <div class="card-value">{{pfStatistics.monthlyChamberJoin}}</div>
          </div>
        </div>
        <div class="h-cut-line"></div>
        <div class="c-card-box">
          <div class="card-box-3">
            <div class="card-key">累计商会入驻</div>
            <div class="card-value">{{pfStatistics.totalChambers}}</div>
          </div>
        </div>
        <div class="h-cut-line"></div>
        <div class="c-card-box">
          <div class="card-box-3">
            <div class="card-key">本月商会会员入驻</div>
            <div class="card-value">{{pfStatistics.monthlyMemberJoin}}</div>
          </div>
        </div>
        <div class="h-cut-line"></div>
        <div class="c-card-box">
          <div class="card-box-3">
            <div class="card-key">累计商会会员</div>
            <div class="card-value">{{pfStatistics.totalMembers}}</div>
          </div>
        </div>
        <div class="h-cut-line"></div>
        <div class="c-card-box">
          <div class="card-box-3">
            <div class="card-key">累计授权登录人数</div>
            <div class="card-value">{{pfStatistics.loginMembers}}</div>
          </div>
        </div>
      </div>
    </div>
    <el-tabs>
      <el-tab-pane label="会员入驻数据"></el-tab-pane>
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
      <el-button type="primary" size="mini" style="float: right;" @click="exportExcel">导表</el-button>
    </div>
    <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" border fit highlight-current-row @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55px">
      </el-table-column>
      <!-- <el-table-column type="index" label="序号" width="60px">
      </el-table-column> --> 
      <el-table-column label="日期">
        <template slot-scope="scope">
          {{scope.row.date}}
        </template>
      </el-table-column>
      <el-table-column label="授权登录人数">
        <template slot-scope="scope">
          {{scope.row.activeWxUserTotal}}
        </template>
      </el-table-column>
      <el-table-column label="商会会员入驻">
        <template slot-scope="scope">
          {{scope.row.joinedTotal}}
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
    <el-tabs>
      <el-tab-pane label="商会数据"></el-tab-pane>
    </el-tabs>
    <el-table :data="list2" v-loading="listLoading2" element-loading-text="Loading" border fit highlight-current-row>
      <!-- <el-table-column type="selection" width="55px">
      </el-table-column> -->
      <!-- <el-table-column type="index" label="序号" width="60px">
      </el-table-column> --> 
      <el-table-column label="商会">
        <template slot-scope="scope">
          {{scope.row.date}}
        </template>
      </el-table-column>
      <el-table-column label="累计商会会员">
        <template slot-scope="scope">
          {{scope.row.joinedTotal}}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script src="./chamberJoinData.js"></script>

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
.c-card-box {
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
.h-cut-line {
  float: left;
  width: 1px;
  height: 100%;
  border-left: 1px solid #ccc;
}
</style>
