<template>
  <div class="app-container">
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
        @change="getStatistics"
        size="mini">
      </el-date-picker>
    </div>
    <div class="block">
      <div class="data-card">
        <div class="d-card-box">
          <div class="card-box-3">
            <div class="card-key">平台发布内容数</div>
            <div class="card-value">{{pfStatistics.platformContent}}</div>
          </div>
        </div>
        <div class="h-cut-line"></div>
        <div class="d-card-box">
          <div class="card-box-3">
            <div class="card-key">商会发布内容数</div>
            <div class="card-value">{{pfStatistics.chamberContent}}</div>
          </div>
        </div>
        <div class="h-cut-line"></div>
        <div class="d-card-box">
          <div class="card-box-3">
            <div class="card-key">会员企业动态数</div>
            <div class="card-value">{{pfStatistics.companyContent}}</div>
          </div>
        </div>
        <div class="h-cut-line"></div>
        <div class="d-card-box">
          <div class="card-box-3">
            <div class="card-key">累计阅读次数</div>
            <div class="card-value">{{pfStatistics.readTotal}}</div>
          </div>
        </div>
      </div>
    </div>
    <div style="font-weight: 600; font-size: 16px;margin: 20px 0;">
      内容数据
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
      <el-table-column label="商会发布内容数">
        <template slot-scope="scope">
          {{scope.row.chamberContentTotal}}
        </template>
      </el-table-column>
      <el-table-column label="平台发布内容数">
        <template slot-scope="scope">
          {{scope.row.platformContentTotal}}
        </template>
      </el-table-column>
      <el-table-column label="内容发布总数">
        <template slot-scope="scope">
          {{scope.row.contentTotal}}
        </template>
      </el-table-column>
      <el-table-column label="阅读次数">
        <template slot-scope="scope">
          {{scope.row.viewingCount}}
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

<script src="./contentData.js"></script>

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
.d-card-box {
  float: left;
  width: 24.5%;
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
