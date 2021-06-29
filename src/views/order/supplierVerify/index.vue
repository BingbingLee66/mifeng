<template>
  <div class="app-container">
    <div class="block">
      <el-form ref="query" label-width="auto" label-position="left" :model="query">
        <el-row>
          <el-col :span="4">
            <el-form-item label="供货商家：">
              <el-input v-model="query.supplierName" placeholder="请输入供货商家"/>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item :span="12" label="状态：">
              <el-select v-model="query.status" placeholder="请选择状态">
                <el-option label="所有" :value="-1"></el-option>
                <el-option label="未发货" :value="0"></el-option>
                <el-option label="已发货" :value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" style="margin-left:20px;">
            <el-form-item label="下单时间：">
              <el-date-picker
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                v-model="query.date"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item label=" ">
              <el-button type="primary" :actionid="getId('', '查询')" v-if="has('', '查询')" @click="fetchData($event)">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="block">
      <el-row>
        <el-col :span="24">
          <el-button type="primary" size="small" :actionid="getId('', '导表')" v-if="has('', '导表')" @click.native="exportExcel($event)">导表</el-button>
        </el-col>
      </el-row>
    </div>
    <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" border fit highlight-current-row @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55px">
      </el-table-column>
      <!-- <el-table-column type="index" label="序号" width="60px">
      </el-table-column> --> 
      <el-table-column label="供货商家" width="150px">
        <template slot-scope="scope">
          {{scope.row.supplierName}}
        </template>
      </el-table-column>
      <el-table-column label="商品名称" width="200px">
        <template slot-scope="scope">
          {{scope.row.goodName}}
        </template>
      </el-table-column>
      <el-table-column label="商品规格" width="100px">
        <template slot-scope="scope">
          {{!scope.row.codeName ? '无' : scope.row.codeName}}
        </template>
      </el-table-column>
      <el-table-column label="供货价(元)" width="100px">
        <template slot-scope="scope">
          {{scope.row.supplyPrice}}
        </template>
      </el-table-column>
      <el-table-column label="下单数(件)" width="100px">
        <template slot-scope="scope">
          {{scope.row.totalOrderCount}}
        </template>
      </el-table-column>
      <el-table-column label="已发货(件)" width="100px">
        <template slot-scope="scope">
          {{scope.row.totalShipmentCount}}
        </template>
      </el-table-column>
      <el-table-column label="未发货(件)" width="100px">
        <template slot-scope="scope">
          {{scope.row.totalUnshippedCount}}
        </template>
      </el-table-column>
      <el-table-column label="实付金额(元)" width="120px">
        <template slot-scope="scope">
          {{scope.row.totalPrice}}
        </template>
      </el-table-column>
      <el-table-column label="下单时间">
        <template slot-scope="scope">
          {{scope.row.minTime | dateFormat}}~{{scope.row.maxTime | dateFormat}}
        </template>
      </el-table-column>
      <el-table-column label="状态" width="80px">
        <template slot-scope="scope">
          <div v-if="scope.row.totalOrderCount > scope.row.totalShipmentCount">未发货</div>
          <div v-if="scope.row.totalOrderCount == scope.row.totalShipmentCount">已发货</div>
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

<script src="./supplierVerify.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/common.scss";
</style>
