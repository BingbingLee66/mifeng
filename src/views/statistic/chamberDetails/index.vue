<template>
  <div class="app-container">
    <div class="chamber-statistics">
        <h3>数据详情</h3>
        <div class="text-btn-style">数据定义</div>
    </div>
    <div class="chamber-statistics">
        <div>
            <el-select v-model="query.ckey" placeholder="数据维度" filterable @change="change">
                <el-option v-for="item in chamberList" :key="item.id" :label="item.name" :value="item.ckey"></el-option>
            </el-select>
             <el-radio-group v-model="days" size="mini" @change="initDatePicker">
                <el-radio-button :label="7">7天</el-radio-button>
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
            <el-radio-group v-model="query.type" size="mini" @change="typeDatePicker">
                <el-radio-button :label="1">日</el-radio-button>
                <el-radio-button :label="2">周</el-radio-button>
                <el-radio-button :label="3">月</el-radio-button>
            </el-radio-group>
        </div>
        <div>
            <el-button type="primary" size="mini"  @click="exportExcel">导表</el-button>
        </div>
    </div>
    <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" border fit highlight-current-row @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55px"></el-table-column>
        <el-table-column label="日期" width="120px">
            <template slot-scope="scope">
            {{ scope.row.date }}
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

<script src="./chamberDetails.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/common.scss";
</style>
<style>
.statistics{
    display: flex;
    justify-content: space-between;
    
}
</style>

