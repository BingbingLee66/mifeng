<template>
  <div class="app-container">
    <div class="from-block">
      <el-form ref="query" label-position="right" :inline="true" size="mini" :model="query">
        <el-form-item label="优惠券ID">
          <el-input v-model="query.couponId" placeholder="" maxlength="12" @input="handleNumber"/>
        </el-form-item>
        <el-form-item label="优惠券名称">
          <el-input v-model="query.couponName" placeholder="" maxlength="12" @input="e=>handleSpace(e,'couponName')"/>
        </el-form-item>
        <el-form-item label="创建人">
          <el-input v-model="query.creator" placeholder="关键词" @input="e=>handleSpace(e,'creator')"/>
        </el-form-item>
        <el-form-item label="">
          <el-button style="margin-left: -20px;" v-if="has('', '查询')" type="primary" :actionid="getId('', '查询')" @click="fetchData($event)">
            查询
          </el-button>
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
            <div v-for="item in scope.row.couponList" :key="item.couponId">
              <div>【{{ item.total }}】
                <span class="blue-label" @click="goCouponDetail">{{ scope.row.couponName }}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="优惠券接收方" width="250px">
          <template slot-scope="scope">
            <div>{{ scope.row.receiver }}</div>
            <div class="blue-label" @click="goIssueList">{{ scope.row.receiverCount }}</div>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="200px">
          <template slot-scope="scope">
            <div>{{scope.row.creator}}</div>
            <div>{{ scope.row.createTime | dateFormat }}</div>
          </template>
        </el-table-column>
        <el-table-column label="发送状态" width="200px">
          <template slot-scope="scope">
            <div v-if="scope.row.sendStatus===0">未发送</div>
            <div v-if="scope.row.sendStatus===1">已发送</div>
          </template>
        </el-table-column>
        <el-table-column label="发送结果">
          <template slot-scope="scope">{{ scope.row.result }}</template>
        </el-table-column>
        <el-table-column label="操作" width="200px" fixed="right">
          <template slot-scope="scope">
            <div v-if="scope.row.sendStatus===0">
              <el-button type="text" @click="send(scope.row.id)">发送</el-button>
            </div>
            <div v-else>--</div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background layout="total, sizes, prev, pager, next, jumper" :page-sizes="pageSizes" :page-size="limit" :total="total" :current-page.sync="currentpage" :style="{'padding-top': '15px'}" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    </div>

    <!-- 提示 -->
    <el-dialog title="提示" :visible.sync="failTipVisible" width="400px">
      <div class="dialog-content">
        <div>以下手机号还未注册</div>
        <div v-for="i in 3" :key="i">
          i12323
        </div>
      </div>
      <div slot="footer" style="text-align: center;">
        <el-button type="primary" @click="failTipVisible = false">确认</el-button>
        <el-button @click="failTipVisible = false">取消</el-button>
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
