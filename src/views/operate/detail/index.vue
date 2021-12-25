<template>
  <div class="app-container">
    <div>
      <el-form ref="form"  label-position="right" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item>
                活动详情
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div>
      <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row>
        <el-table-column label="邀请成功时间" >
          <template slot-scope="scope" >
            {{scope.row.createdTs | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="邀请者">
          <template slot-scope="scope">
            {{ scope.row.inviterName ? scope.row.inviterName : "--" }}
          </template>
        </el-table-column>
        <el-table-column label="邀请者-奖励金额" >
          <template slot-scope="scope">
            {{ scope.row.inviterAmount }}
          </template>
        </el-table-column>
        <el-table-column label="受邀者">
          <template slot-scope="scope">
            {{ scope.row.inviteeName ? scope.row.inviteeName  : "--" }}
          </template>
        </el-table-column>
        <el-table-column label="受邀者-所属商会">
          <template slot-scope="scope">
            <div v-for="(val) in scope.row.inviteeChamberNames">
              {{val}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="受邀者-奖励" >
          <template slot-scope="scope">
            {{ scope.row.inviteeAmount }}
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background layout="total, sizes, prev, pager, next, jumper" :page-sizes="pageSizes" :page-size="limit" :total="total" :current-page.sync="currentpage" :style="{'padding-top': '15px'}" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    </div>
  </div>
</template>

<script src="./detail.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/common.scss";
</style>

