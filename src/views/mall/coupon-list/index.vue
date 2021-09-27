<template>
  <div class="app-container">
    <div class="from-block">
      <el-form ref="query" label-position="right" :inline="true" size="mini" :model="query">
        <el-form-item label="优惠券ID">
          <el-input v-model="query.id" placeholder=""/>
        </el-form-item>
        <el-form-item label="优惠券名称">
          <el-input v-model="query.name" placeholder=""/>
        </el-form-item>
        <el-form-item label="是否礼包劵">
          <el-select v-model="query.status" placeholder="请选择">
            <el-option label="是" :value="-1"/>
            <el-option label="否" :value="1"/>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-button v-if="has('', '查询')" type="primary" :actionid="getId('', '查询')" @click="fetchData($event)">查询
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-button type="danger" size="small" @click="create">创建优惠券</el-button>
    </div>
    <div class="table-block">
      <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row>
        <el-table-column label="优惠券ID" width="100px">
          <template slot-scope="scope">
            <div class="blue-label" @click="goCouponDetail">{{ scope.row.id }}</div>
          </template>
        </el-table-column>
        <el-table-column label="优惠券名称" width="200px">
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column label="类型" width="100px">
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column label="有效期" width="130px">
          <template slot-scope="scope">
            {{ scope.row.createTime | dateFormat }}至
            {{ scope.row.createTime | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="发行量" width="100px">
          <template slot-scope="scope">
            <div class="blue-label" @click="showIssue">{{ scope.row.name }}</div>
          </template>
        </el-table-column>
        <el-table-column label="获取规则" width="150px">
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column label="使用规则" width="150px">
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column label="已发放/领取" width="100px">
          <template slot-scope="scope">
            <div class="blue-label" @click="goIssueList">{{ scope.row.name }}</div>
          </template>
        </el-table-column>
        <el-table-column label="已使用" width="100px">
          <template slot-scope="scope">
            <div class="blue-label" @click="goOrderList">{{ scope.row.name }}</div>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="160px">
          <template slot-scope="scope"> {{ scope.row.createTime | dateFormat }}</template>
        </el-table-column>
        <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click="stopSend(scope.row)">停发</el-button>
            <el-button type="text" @click="continueSend(scope.row)">继续发</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background layout="total, sizes, prev, pager, next, jumper" :page-sizes="pageSizes" :page-size="limit" :total="total" :current-page.sync="currentpage" :style="{'padding-top': '15px'}" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    </div>

    <!-- 编辑发行量 -->
    <el-dialog title="发行量" :visible.sync="showIssueDialog" width="30%">
      <div class="dialog-content">
        <el-input v-model="issue" placeholder=""/>
        <div class="red-label">提示：编辑发行量时，只能增加，不能减少。</div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showIssueDialog = false">提交</el-button>
        <el-button type="primary" @click="showIssueDialog = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script src="./coupon-list.js"></script>

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
