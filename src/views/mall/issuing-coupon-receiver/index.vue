<template>
  <div class="app-container">
    <div class="top-block">
      <div class="title">已发放列表</div>
    </div>
    <div class="from-block">
      <el-form ref="query" label-position="right" :inline="true" size="mini" :model="query">
        <el-form-item label="用户名" @input="e=>handleSpace(e,'uname')">
          <el-input v-model="query.uname" placeholder="关键词" maxlength="20" />
        </el-form-item>
        <el-form-item label="注册手机号">
          <el-input v-model="query.phone" placeholder="关键词" maxlength="11" @input="handleNumber" />
        </el-form-item>
        <el-form-item label="用户属性">
          <el-select v-model="query.userType" placeholder="请选择">
            <el-option label="商/协会成员" :value="1" />
            <el-option label="普通用户" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="所属商/协会">
          <el-select v-model="query.chamberId" placeholder="请选择" clearable filterable>
            <el-option v-for="chamber in chamberOptions" :key="chamber.id" :label="chamber.name" :value="chamber.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="" style="margin-left: -30px;">
          <el-button type="primary" @click="fetchData($event)">查询
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-block">
      <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row>
        <el-table-column label="接收时间">
          <template slot-scope="scope"> {{ scope.row.receivedTime | dateFormat }}</template>
        </el-table-column>
        <el-table-column label="发放的券">
          <template slot-scope="scope">
            <div class="blue-label" @click="goCouponDetail(scope.row.couponId)">{{ scope.row.couponName }}</div>
          </template>
        </el-table-column>
        <el-table-column label="接收方-用户名">
          <template slot-scope="scope">
            <div class="blue-label" @click="goMemberDetail">{{ scope.row.uname }}</div>
          </template>
        </el-table-column>
        <el-table-column label="注册手机号" width="160px">
          <template slot-scope="scope">{{ scope.row.phone }}</template>
        </el-table-column>
        <el-table-column label="用户属性" width="150px">
          <template slot-scope="scope">
            <span v-if="scope.row.userType===1">商协会成员</span>
            <span v-if="scope.row.userType===2">普通用户</span>
          </template>
        </el-table-column>
        <el-table-column label="所属商/协会">
          <template slot-scope="scope">{{ scope.row.chamberName }}</template>
        </el-table-column>
        <el-table-column label="已接收" width="150px">
          <template slot-scope="scope">{{ scope.row.receivedCount }}</template>
        </el-table-column>
        <el-table-column label="已赠送" width="150px">
          <template slot-scope="scope">{{ scope.row.sendCount }}</template>
        </el-table-column>
        <el-table-column label="已使用" width="150px">
          <template slot-scope="scope">
            <div class="blue-label" @click="goOrderList">{{ scope.row.usedCount }}</div>
          </template>
        </el-table-column>
        <el-table-column label="已过期" width="150px">
          <template slot-scope="scope">{{ scope.row.expiredCount }}</template>
        </el-table-column>
      </el-table>
      <el-pagination background layout="total, sizes, prev, pager, next, jumper" :page-sizes="pageSizes" :page-size="limit" :total="total" :current-page.sync="currentpage" :style="{'padding-top': '15px'}" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script src="./issuing-coupon-receiver.js"></script>

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
