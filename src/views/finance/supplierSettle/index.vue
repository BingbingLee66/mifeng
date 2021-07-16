<template>
  <div class="app-container">
    <div class="block">
      <el-form ref="query" label-position="left" :model="query">
        <el-row>
          <el-col :span="5">
            <el-form-item label-width="110px" label="供货商名称：">
              <el-input v-model="query.supplier" placeholder="请输入商品名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="4" style="margin-left:10px;">
            <el-form-item label-width="60px" label="状态：">
              <el-select v-model="query.settlementStatus" placeholder="请选择操作行为">
                <el-option label="所有" :value="-1"></el-option>
                <el-option label="已结算" :value="1"></el-option>
                <el-option label="未结算" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="13" style="margin-left:10px;">
            <el-form-item label-width="110px" label="完成时间：" style="float: left;">
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
            <el-form-item label=" " style="float: left;margin-left:10px;">
              <el-button type="primary" :actionid="getId('', '查询')" v-if="has('', '查询')" @click="fetchData($event)">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="block">
      <el-row>
        <el-col :span="24">
          <el-button type="primary" size="small" :actionid="getId('', '确认结算')" v-if="has('', '确认结算')" @click.native="batchConfirm($event)">确认结算</el-button>
          <el-button type="primary" size="small" :actionid="getId('', '导表')" v-if="has('', '导表')" @click.native="exportExcel($event)">导表</el-button>
        </el-col>
      </el-row>
    </div>
    <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" border fit highlight-current-row @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55px">
      </el-table-column>
      <!-- <el-table-column type="index" label="序号" width="60px">
      </el-table-column> -->
      <el-table-column label="完成时间" width="120px">
        <template slot-scope="scope">
          {{scope.row.rptDateMin | dateFormat2}}至{{scope.row.rptDateMax | dateFormat2}}
        </template>
      </el-table-column>
      <el-table-column label="供货商" width="120px">
        <template slot-scope="scope">
          {{scope.row.supplierName}}
        </template>
      </el-table-column>
      <el-table-column label="商品名称" width="120px">
        <template slot-scope="scope">
          {{scope.row.goodsName}}
        </template>
      </el-table-column>
      <el-table-column label="规格" width="120px">
        <template slot-scope="scope">
          {{!scope.row.codeName ? '无' : scope.row.codeName}}
        </template>
      </el-table-column>
      <el-table-column label="供货价(元)" width="120px">
        <template slot-scope="scope">
          {{scope.row.supplyPrice}}
        </template>
      </el-table-column>
      <el-table-column label="销量(件)" width="120px">
        <template slot-scope="scope">
          {{scope.row.count}}
        </template>
      </el-table-column>
      <el-table-column label="待结算金额(元)" width="120px">
        <template slot-scope="scope">
          {{scope.row.unsettledSupplyPrice}}
        </template>
      </el-table-column>
      <el-table-column label="总金额(元)" width="120px">
        <template slot-scope="scope">
          {{scope.row.totalSupplyPrice}}
        </template>
      </el-table-column>
      <!-- <el-table-column label="操作人">
        <template slot-scope="scope">
          {{scope.row.operator}}
        </template>
      </el-table-column> -->
      <el-table-column label="状态" width="120px">
        <template slot-scope="scope">
          <div v-if="scope.row.settlementStatus == 2">未结算</div>
          <div v-if="scope.row.settlementStatus == 1">已结算</div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="confirm($event, scope.row)" :actionid="getId('', '确认结算')" v-if="has('', '确认结算')" :disabled="scope.row.settlementStatus == 1">确认结算</el-button>
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

<script src="./supplierSettle.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/common.scss";
</style>
