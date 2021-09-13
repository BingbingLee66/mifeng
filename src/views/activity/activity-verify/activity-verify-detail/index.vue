<template>
  <div class="app-container verify-container">
    <div style="height:20px;margin-bottom: 20px;">
      <span style="font-weight: 600; font-size: 22px;float: left;">活动报名审核</span>
    </div>
    <div class="statistic-wrap">
      <div class="intro">
        <div>活动名称：广东省江西商会2021年第二次对外招商大会</div>
        <div>活动来源：广东省江西商会</div>
        <div>活动时间：9月18日 10:00 - 9月18日 18:00</div>
        <div>参加人数：限50人</div>
      </div>
      <div class="item-wrap">
        <div class="item-num">80</div>
        <div class="item-name">已报名人数</div>
      </div>
      <div class="item-wrap">
        <div class="item-num">80</div>
        <div class="item-name">审核驳回</div>
      </div>
      <div class="item-wrap">
        <div class="item-num">80</div>
        <div class="item-name">审核通过</div>
      </div>
      <div class="item-wrap">
        <div class="item-num red-label">80</div>
        <div class="item-name">剩余名额</div>
      </div>
      <div class="item-wrap">
        <div class="item-num">80</div>
        <div class="item-name">待审核</div>
      </div>
    </div>
    <div style="margin-top:30px;">
      <el-form ref="query" label-position="right" label-width="90px" :inline="true" size="mini" :model="query">
        <el-form-item label="审核状态">
          <el-select v-model="query.source" placeholder="请选择" clearable>
            <el-option v-for="source in sourceOptions" :key="source.value" :label="source.label" :value="source.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="签到状态">
          <el-input v-model="query.activityId" placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="query.activityName" placeholder="关键词"/>
        </el-form-item>
        <el-form-item label="手机号">
          <el-select v-model="query.activityStatus" placeholder="请选择状态">
            <el-option label="全部状态" :value="-1"/>
            <el-option label="已发布" :value="1"/>
            <el-option label="未发布" :value="2"/>
          </el-select>
        </el-form-item>
        <el-form-item label="用户属性">
          <el-select v-model="query.activityStatus" placeholder="请选择状态">
            <el-option label="全部状态" :value="-1"/>
            <el-option label="已发布" :value="1"/>
            <el-option label="未发布" :value="2"/>
          </el-select>
        </el-form-item>
        <el-form-item label="所属商会">
          <el-select v-model="query.activityStatus" placeholder="请选择状态">
            <el-option label="全部状态" :value="-1"/>
            <el-option label="已发布" :value="1"/>
            <el-option label="未发布" :value="2"/>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" @click="fetchData($event)"> 查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div style="margin:10px 0">
      <el-button size="small" type="success">通过</el-button>
      <el-button size="small" type="warning">驳回</el-button>
      <el-button size="small" type="text">下载签到表</el-button>
    </div>
    <div>
      <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row>
        <el-table-column label="报名时间" width="250px">
          <template slot-scope="scope">
            <div class="red-label">{{ scope.row.activityId }}</div>
            <div> {{ scope.row.activityName }}</div>
          </template>
        </el-table-column>
        <el-table-column label="报名信息" width="200px">
          <template slot-scope="scope">
            <div>【姓名】{{ scope.row.createdTs }}</div>
            <div>【手机】{{ scope.row.createdTs }}</div>
            <div>【邮箱】{{ scope.row.createdTs }}</div>
            <div>【微信】{{ scope.row.createdTs }}</div>
          </template>
        </el-table-column>
        <el-table-column label="用户属性" width="200px">
          <template slot-scope="scope">
            {{ scope.row.activityStartTime }}
          </template>
        </el-table-column>
        <el-table-column label="所属商会" width="100px">
          <template slot-scope="scope">
            {{ scope.row.chamberName }}
          </template>
        </el-table-column>
        <el-table-column label="审核状态" width="100px">
          <template slot-scope="scope">
            {{ scope.row.applyObject === 0 ? '全部' : '限本商会会员' }}
          </template>
        </el-table-column>
        <el-table-column label="签到状态" width="100px">
          <template slot-scope="scope">
            限{{ scope.row.applyCount }}人
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" type="success" @click="goVerifyDetail(scope.row)">通过</el-button>
            <el-button size="mini" type="warning" @click="goVerifyDetail(scope.row)">驳回</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background layout="total, sizes, prev, pager, next, jumper" :page-sizes="pageSizes" :page-size="limit" :total="total" :current-page.sync="currentpage" :style="{'padding-top': '15px'}" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    </div>

    <!-- 驳回弹窗 -->
    <el-dialog title="驳回理由" :visible.sync="showRejectDialog" width="30%">
      <el-input v-model="rejectReason" placeholder="限30字内"></el-input>
      <div slot="footer" style="text-align: center;">
        <el-button @click="showRejectDialog = false">取 消</el-button>
        <el-button type="primary" @click="showRejectDialog = false">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 审核详情弹窗 -->
    <el-dialog title="审核详情" :visible.sync="showDetailDialog" width="400px">
      <div>报名时间：2021-09-15 10:12:25</div>
      <div slot="footer" style="text-align: center;">
        <el-button type="primary" @click="showDetailDialog = false">我知道了</el-button>
      </div>
    </el-dialog>

    <!-- 提示 -->
    <el-dialog title="提示" :visible.sync="showTipDialog" width="400px">
      <div>该活动仅限50人参加，名额仅剩 10 个，允许审核通过的人数，需控制在10个以内哦</div>
      <div slot="footer" style="text-align: center;">
        <el-button type="primary" @click="showDetailDialog = false">我知道了</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script src="./activity-verify-detail.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import 'src/styles/common.scss';

.statistic-wrap {
  display: flex;

  .intro {
    width: 60%;
    height: 100px;
    background: #f2f2f2;
    padding: 10px;
    color: #7F7F7F;
    line-height: 1.5;
    font-size: 14px;
  }

  .item-wrap {
    width: 20%;
    height: 100px;
    border-width: 1px;
    border-style: solid;
    border-color: rgba(215, 215, 215, 1);
    text-align: center;
    padding: 32px 0;
    margin: 0 10px;
  }
}
</style>

<style lang="scss">
.verify-container {
  .el-select {
    .el-input__inner {
      width: 163px;
    }
  }
}

</style>
