<template>
  <div class="app-container">
    <div class="top-block">
      <div class="title">已发放列表</div>
      <div class="red-label goods">【{{giftId}}】{{giftName}}</div>
      <div class="blue-label" @click="goSpreeDetail()">查看详情</div>
    </div>
    <div class="from-block">
      <el-form ref="query" label-position="right" :inline="true" size="mini" :model="query">
        <el-form-item label="用户名">
          <el-input v-model="query.uname" placeholder="关键词" />
        </el-form-item>
        <el-form-item label="注册手机号">
          <el-input v-model="query.phone" placeholder="关键词" />
        </el-form-item>
        <el-form-item label="用户属性">
          <el-select v-model="query.attribute" placeholder="请选择">
            <el-option label="商/协会成员" :value="1" />
            <el-option label="普通用户" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="所属商/协会">
          <el-select v-model="query.ckey" placeholder="请选择" clearable filterable>
            <el-option v-for="chamber in chamberOptions" :key="chamber.value" :label="chamber.label" :value="chamber.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-button v-if="has('', '查询')" type="primary" :actionid="getId('', '查询')" @click="fetchData($event)">查询
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-block">
      <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row>
        <el-table-column label="接收/领取时间">
          <template slot-scope="scope"> {{ scope.row.createTime | dateFormat }}</template>
        </el-table-column>
        <el-table-column label="接收方/领取方-用户名">
          <template slot-scope="scope">
            <div class="blue-label" @click="goMemberDetail(scope.row.userId)">{{ scope.row.userName }}</div>
          </template>
        </el-table-column>
        <el-table-column label="注册手机号" width="200px">
          <template slot-scope="scope">{{ scope.row.phone }}</template>
        </el-table-column>
        <el-table-column label="用户属性" width="150px">
          <template slot-scope="scope">
            <div v-if="scope.row.attribute===1">商/协会成员</div>
            <div v-if="scope.row.attribute===2">普通用户</div>
          </template>
        </el-table-column>
        <el-table-column label="所属商/协会">
          <template slot-scope="scope">{{ scope.row.orgId }}</template>
        </el-table-column>
        <el-table-column label="已接收/领取" width="200px">
          <template slot-scope="scope">{{ scope.row.receiveSize }}</template>
        </el-table-column>
      </el-table>
      <el-pagination background layout="total, sizes, prev, pager, next, jumper" :page-sizes="pageSizes" :page-size="limit" :total="total" :current-page.sync="currentpage" :style="{'padding-top': '15px'}" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script src="./spreed-issued.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import 'src/styles/common.scss';
.top-block {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  .title {
    font-size: 20px;
    color: #333333;
    font-weight: bolder;
    margin-right: 20px;
  }
  .goods {
    margin-right: 20px;
  }
}
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
  margin-top: 10px;
}

.table-dialog {
  .el-dialog {
    margin-top: 8vh !important;
  }
}
</style>
