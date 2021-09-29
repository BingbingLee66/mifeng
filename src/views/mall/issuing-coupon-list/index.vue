<template>
  <div class="app-container">
    <div class="from-block">
      <el-form ref="query" label-position="right" :inline="true" size="mini" :model="query">
        <el-form-item label="优惠券ID">
          <el-input v-model="query.id" placeholder="" maxlength="12" @input="handleNumber" />
        </el-form-item>
        <el-form-item label="优惠券名称">
          <el-input v-model="query.name" placeholder="" maxlength="12" @input="handleSpace" />
        </el-form-item>
        <el-form-item label="创建人">
          <el-input v-model="query.create" placeholder="关键词" @input="handleSpace" />
        </el-form-item>
        <el-form-item label="">
          <el-button style="margin-left: -20px;" v-if="has('', '查询')" type="primary" :actionid="getId('', '查询')" @click="fetchData($event)">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-button type="danger" size="small" @click="create">发放优惠券</el-button>
    </div>
    <div class="table-block">
      <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row>
        <el-table-column label="包含优惠券">
          <template slot-scope="scope">
            <div class="blue-label" @click="goCouponDetail">{{ scope.row.id }}</div>
          </template>
        </el-table-column>
        <el-table-column label="优惠券接收方" width="250px">
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column label="创建时间" width="200px">
          <template slot-scope="scope"> {{ scope.row.createTime | dateFormat }}</template>
        </el-table-column>
        <el-table-column label="发送状态" width="200px">
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column label="发送结果">
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column label="操作" width="200px" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click="send(scope.row.id)">发送</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background layout="total, sizes, prev, pager, next, jumper" :page-sizes="pageSizes" :page-size="limit" :total="total" :current-page.sync="currentpage" :style="{'padding-top': '15px'}" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>

    <!-- 编辑发行量 -->
    <el-dialog title="发行量" :visible.sync="showIssueDialog" width="30%">
      <div class="dialog-content">
        <el-input v-model="issue" placeholder="" />
        <div class="red-label">提示：编辑发行量时，只能增加，不能减少。</div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showIssueDialog = false">提交</el-button>
        <el-button type="primary" @click="showIssueDialog = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script src="./issuing-coupon-list.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import 'src/styles/common.scss';
</style>
<style lang="scss">
.from-block {
  margin: 10px 0;

  .el-form-item {
    margin-right: 40px;

    .el-select {
      .el-input__inner {
        width: 163px;
      }
    }
  }
}

.table-block {
  margin-top: 20px;
}

.table-dialog {
  .el-dialog {
    margin-top: 8vh !important;
  }
}
</style>
