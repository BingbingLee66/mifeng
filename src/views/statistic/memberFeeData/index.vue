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
        :clearable="false"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="fetchData"
        size="mini">
      </el-date-picker>
    </div>
    <div style="font-weight: 600; font-size: 16px;margin: 20px 0;">
      会员缴费数据
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
      <el-table-column label="缴费人数">
        <template slot-scope="scope">
          {{scope.row.memberTotal}}
        </template>
      </el-table-column>
      <el-table-column label="缴费金额(元)">
        <template slot-scope="scope">
          {{scope.row.amountTotal}}
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
    <div style="font-weight: 600; font-size: 16px;margin: 20px 0;">
      商会会员缴费数据
      <!-- <el-button type="primary" size="mini" style="float: right;">导表</el-button> -->
    </div>
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
      <el-table-column label="缴费人数">
        <template slot-scope="scope">
          {{scope.row.memberTotal}}
        </template>
      </el-table-column>
      <el-table-column label="缴费金额(元)">
        <template slot-scope="scope">
          {{scope.row.amountTotal}}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script src="./memberFeeData.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/common.scss";
</style>
