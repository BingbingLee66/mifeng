<template>
  <div class="app-container verify-container">
    <div style="height:20px;margin-bottom: 20px;">
      <span style="font-weight: 600; font-size: 22px;float: left;">活动报名审核</span>
    </div>
    <div class="statistic-wrap">
      <div class="intro">
        <div>活动名称：{{ applyDetail.activityName }}</div>
        <div>活动来源：{{ applyDetail.chamberName === null ? '凯迪云商会' : applyDetail.chamberName }}</div>
        <div>活动时间：{{ applyDetail.activityStartTime }} - {{ applyDetail.activityEndTime }}</div>
        <div>
          参加人数：<span v-if="applyDetail.applyCount === null">不限</span><span v-if="applyDetail.applyCount !== null">限{{
            applyDetail.applyCount
          }}人</span>
        </div>
      </div>
      <div class="item-wrap">
        <div class="item-num">{{ applyDetail.appliedNum ? applyDetail.appliedNum : 0 }}</div>
        <div class="item-name">已报名人数</div>
      </div>
      <div class="item-wrap">
        <div class="item-num">{{ applyDetail.rejectedNum ? applyDetail.rejectedNum : '--' }}</div>
        <div class="item-name">审核驳回</div>
      </div>
      <div class="item-wrap">
        <div class="item-num">{{ applyDetail.approvedNum ? applyDetail.approvedNum : 0 }}</div>
        <div class="item-name">审核通过</div>
      </div>
      <div class="item-wrap">
        <div class="red-label">
          {{ applyDetail.applyCount === null ? '不限' : applyDetail.applyCount - applyDetail.approvedNum }}
        </div>
        <div class="item-name">剩余名额</div>
      </div>
      <div class="item-wrap">
        <div class="item-num">{{ applyDetail.auditNum ? applyDetail.auditNum : '--' }}</div>
        <div class="item-name">待审核</div>
      </div>
    </div>
    <div style="margin-top:30px;">
      <el-form ref="query" label-position="right" label-width="80px" :inline="true" size="mini" :model="query">
        <el-form-item label="审核状态" class="form-item">
          <el-select v-model="query.auditStatus" placeholder="请选择" clearable>
            <el-option label="全部" :value="-1"/>
            <el-option label="待审核" :value="0"/>
            <el-option label="已通过" :value="1"/>
            <el-option label="已驳回" :value="2"/>
          </el-select>
        </el-form-item>
        <el-form-item label="签到状态" class="form-item">
          <el-select v-model="query.signStatus" placeholder="请选择" clearable>
            <el-option label="全部" :value="-1"/>
            <el-option label="待签到" :value="0"/>
            <el-option label="已签到" :value="1"/>
            <el-option label="未签到" :value="2"/>
          </el-select>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="query.name" placeholder="关键词"/>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="query.phone" placeholder="关键词"/>
        </el-form-item>
        <el-form-item label="用户属性" class="form-item">
          <el-select v-model="query.userType" placeholder="请选择">
            <el-option label="全部" :value="-1"/>
            <el-option label="商协会成员" :value="0"/>
            <el-option label="普通用户" :value="1"/>
          </el-select>
        </el-form-item>
        <el-form-item label="所属商会">
          <el-select v-model="query.chamberId" placeholder="请选择">
            <el-option v-for="chamber in chamberOptions" :key="chamber.id" :label="chamber.name" :value="chamber.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" @click="fetchData($event)">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div style="margin:10px 0" v-if="chamberName">
      <el-button v-if="showMulBtn" size="small" type="success" @click="handleMulAudit(1)">通过</el-button>
      <el-button v-if="showMulBtn" size="small" type="warning" @click="handleMulAudit(2)">驳回</el-button>
      <el-button size="small" type="text" @click="downloadSignTable">下载签到表</el-button>
    </div>
    <div>
      <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55px"/>
        <el-table-column label="报名时间" width="180px">
          <template slot-scope="scope">
            {{ scope.row.createdTs }}
          </template>
        </el-table-column>
        <el-table-column label="报名信息" width="250px">
          <template slot-scope="scope">
            <div>【姓名】{{ scope.row.name }}</div>
            <div>【手机】{{ scope.row.phone }}</div>
            <div>【邮箱】{{ scope.row.email }}</div>
            <div>【微信】{{ scope.row.wechat }}</div>
          </template>
        </el-table-column>
        <el-table-column label="用户属性" width="120px">
          <template slot-scope="scope">
            <span v-if="scope.row.userType === null">云商会成员</span>
            <span v-if="scope.row.userType === 1">本商会成员</span>
            <span v-if="scope.row.userType === 0">普通用户</span>
          </template>
        </el-table-column>
        <el-table-column label="所属商会" width="250px">
          <template slot-scope="scope">
            {{ scope.row.chamberList }}
          </template>
        </el-table-column>
        <el-table-column label="审核状态" width="250px">
          <template slot-scope="scope">
            <span v-if="scope.row.auditStatus === 0">待审核</span>
            <span v-if="scope.row.auditStatus === 1">已通过</span>
            <span v-if="scope.row.auditStatus === 2">已驳回</span>
            <div v-if="scope.row.auditStatus === 2">驳回理由：{{ scope.row.auditReason }}</div>
            <div class="blue-label" @click="showDetail(scope.row)">审核详情</div>
          </template>
        </el-table-column>
        <el-table-column label="签到状态" width="100px">
          <template slot-scope="scope">
            <div v-if="scope.row.auditStatus === 1">
              <span v-if="scope.row.signStatus === 0">待签到</span>
              <span v-if="scope.row.signStatus === 1">已签到</span>
              <span v-if="scope.row.signStatus === 2">未签到</span>
            </div>
            <div v-else>--</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <div v-if="chamberName">
              <div v-if="scope.row.auditStatus === 0">
                <el-button size="mini" type="success" @click="handleAudit(scope.row,1)">通过</el-button>
                <el-button size="mini" type="warning" @click="handleAudit(scope.row,2)">驳回</el-button>
              </div>
              <div v-if="scope.row.auditStatus === 2">--</div>
              <div v-if="scope.row.signStatus === 0 && scope.row.auditStatus !== 2 && scope.row.auditStatus !== 0">
                <el-checkbox v-model="signed" @change="e=>handleSign(e,scope.row,1)">已签到</el-checkbox>
                <br/>
                <el-checkbox v-model="unsign" @change="e=>handleSign(e,scope.row,2)">未签到</el-checkbox>
              </div>
            </div>
            <div v-else>--</div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background layout="total, sizes, prev, pager, next, jumper" :page-sizes="pageSizes" :page-size="limit" :total="total" :current-page.sync="currentpage" :style="{'padding-top': '15px'}" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    </div>

    <!-- 驳回弹窗 -->
    <el-dialog title="驳回理由" :visible.sync="showRejectDialog" width="450px">
      <div class="reject-wrap">
        <el-input type="textarea" :rows="2" resize="none" v-model="rejectReason" placeholder="限30字内" maxlength="30" show-word-limit></el-input>
      </div>
      <div slot="footer" style="text-align: center;">
        <el-button @click="showRejectDialog = false">取 消</el-button>
        <el-button type="primary" @click="reject">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 审核详情弹窗 -->
    <el-dialog title="审核详情" :visible.sync="showDetailDialog" width="400px">
      <div style="line-height: 1.5;" v-for="item in applyDetailList" :key="item.id">
        <div>报名时间：{{ item.createdTs }}</div>
        <div v-if="item.auditStatus === 1">通过时间: {{ item.auditTs }}</div>
        <div v-if="item.auditStatus === 2">驳回时间: {{ item.auditTs }}</div>
        <div v-if="item.auditStatus === 2">驳回理由：<span class="red-label">{{ item.auditReason }}</span></div>
      </div>
      <div></div>
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
    color: #7f7f7f;
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

    .item-num {
      color: #67c23a;
    }

    .item-name {
      margin-top: 5px;
    }
  }
}
</style>

<style lang="scss">
.verify-container {
  .el-input__inner {
    width: 140px;
  }

  .el-select {
    .el-input__inner {
      width: 163px;
    }
  }

  .form-item {
    .el-select {
      .el-input__inner {
        width: 120px;
      }
    }
  }

  .reject-wrap {
    .el-input__inner {
      width: 300px;
    }
  }
}
</style>
