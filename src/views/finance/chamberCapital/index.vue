<template>
  <div class="app-container">
    <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" border fit highlight-current-row>
      <!-- <el-table-column type="selection" width="55px">
      </el-table-column> -->
      <!-- <el-table-column type="index" label="序号" width="60px">
      </el-table-column> -->
      <el-table-column label="商会名称">
        <template slot-scope="scope">
          {{chamberName(scope.row.ckey)}}
        </template>
      </el-table-column>
      <el-table-column label="商城交易金额(元)" width="180px">
        <template slot-scope="scope">
          {{scope.row.cumulativeShopPrice}}
        </template>
      </el-table-column>
      <el-table-column label="会费金额(元)" width="180px">
        <template slot-scope="scope">
          {{scope.row.cumulativeMemberPrice}}
        </template>
      </el-table-column>
      <el-table-column label="合计(元)" width="180px">
        <template slot-scope="scope">
          {{Math.floor((scope.row.cumulativeShopPrice + scope.row.cumulativeMemberPrice) * 100) / 100}}
        </template>
      </el-table-column>
      <el-table-column label="待提现(元)" width="180px">
        <template slot-scope="scope">
          {{Math.floor((scope.row.cumulativeMemberDeduction + scope.row.cumulativeShopDeduction) * 100) / 100}}
        </template>
      </el-table-column>
      <!-- <el-table-column label="操作人">
        <template slot-scope="scope">
          {{scope.row.operator}}
        </template>
      </el-table-column> -->
      <el-table-column label="操作" >
        <template slot-scope="scope">
          <el-button type="text" @click="detail($event, scope.row)" :actionid="getId('', '详情')" v-if="has('', '详情')">详情</el-button>
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

<script src="./chamberCapital.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/common.scss";
</style>
