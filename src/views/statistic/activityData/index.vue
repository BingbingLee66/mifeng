<template>
  <div class="app-container">
    <div class="block">
      <div style="height:20px;margin-bottom: 10px;">
        <span style="font-weight: 600; font-size: 18px;float: left;">活动数据</span>
        <span style="float: right;" class="text-btn-style" @click="showMeaning=true">数据定义</span>
      </div>
      <div class="data-card">
        <div class="c-card-box">
          <div class="card-box-3">
            <div class="card-value">{{ pfStatistics.channelNums }}</div>
            <div class="card-key">累计举办活动</div>
          </div>
        </div>
        <div class="h-cut-line"></div>
        <div class="c-card-box">
          <div class="card-box-3">
            <div class="card-value">{{ pfStatistics.goodsNums }}</div>
            <div class="card-key">累计浏览人数</div>
          </div>
        </div>
        <div class="h-cut-line"></div>
        <div class="c-card-box">
          <div class="card-box-3">
            <div class="card-value" style="color: #FF0000;">{{ pfStatistics.userNums }}</div>
            <div class="card-key">累计分享人数</div>
          </div>
        </div>
        <div class="h-cut-line"></div>
        <div class="c-card-box">
          <div class="card-box-3">
            <div class="card-value">{{ pfStatistics.visitNums }}</div>
            <div class="card-key">累计报名人数</div>
          </div>
        </div>
        <div class="h-cut-line"></div>
        <div class="c-card-box">
          <div class="card-box-3">
            <div class="card-value">{{ pfStatistics.payUserNums }}</div>
            <div class="card-key">累计签到人数</div>
          </div>
        </div>
      </div>
    </div>
    <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" border fit highlight-current-row @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55px">
      </el-table-column>
      <el-table-column label="商/协会">
        <template slot-scope="scope">
          {{ scope.row.dayTimeStr }}
        </template>
      </el-table-column>
      <el-table-column label="累计举办活动">
        <template slot-scope="scope">
          {{ scope.row.channelNums > 0 ? scope.row.channelNums : '--' }}
        </template>
      </el-table-column>
      <el-table-column label="累计浏览人数">
        <template slot-scope="scope">
          {{ scope.row.goodsNums > 0 ? scope.row.goodsNums : '--' }}
        </template>
      </el-table-column>
      <el-table-column label="累计分享人数">
        <template slot-scope="scope">
          {{ scope.row.userNums > 0 ? scope.row.userNums : '--' }}
        </template>
      </el-table-column>
      <el-table-column label="累计报名人数">
        <template slot-scope="scope">
          {{ scope.row.visitNums > 0 ? scope.row.visitNums : '--' }}
        </template>
      </el-table-column>
      <el-table-column label="累计签到人数">
        <template slot-scope="scope">
          {{ scope.row.orderUserNums > 0 ? scope.row.orderUserNums : '--' }}
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

    <el-dialog title="数据定义" :visible.sync="showMeaning" width="480px">
      <div class="meaning-wrap">
        <div class="meaning-item">
          <div class="tit">累计举办活动</div>
          <div class="sub">在指定时间范围内，累计举办的活动数<span style="color:#FF0000;"> (有人报名 且审核通过 且已签到 才算)</span>。</div>
        </div>
        <div class="meaning-item">
          <div class="tit">累计浏览人数</div>
          <div class="sub">在指定时间范围内，累计浏览活动的人数 <span style="color:#FF0000;">(需去重)</span>。</div>
        </div>
        <div class="meaning-item">
          <div class="tit">累计分享人数</div>
          <div class="sub">在指定时间范围内，累计分享活动的人数 <span style="color:#FF0000;">(需去重)</span>。</div>
        </div>
        <div class="meaning-item">
          <div class="tit">累计报名人数</div>
          <div class="sub">在指定时间范围内，累计报名参加活动且审核通过的人数 <span style="color:#FF0000;">(需去重)</span>。</div>
        </div>
        <div class="meaning-item">
          <div class="tit">累计签到人数</div>
          <div class="sub">在指定时间范围内，提交过订单的总人数 <span style="color:#FF0000;">(需去重)</span>。</div>
        </div>
      </div>
      <div style="text-align: center;">
        <el-button type="primary" @click="showMeaning=false">我知道了</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script src="./activityData.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/common.scss";

.data-card {
  width: 100%;
  height: 120px;
  border-radius: 2px;
  border: 1px solid #ccc;
}

.c-card-box {
  float: left;
  width: 14%;
  height: 100%;
  text-align: center;
  display: table;
}

.card-box-3 {
  width: 100%;
  display: table-cell;
  vertical-align: middle;
}

.card-value {
  margin-bottom: 10px;
  color: #008000;
  font-weight: 600;
}

.h-cut-line {
  float: left;
  width: 1px;
  height: 100%;
  border-left: 1px solid #ccc;
}
</style>

<style lang="scss">
.query-wrap {
  display: flex;
  align-items: center;

  .el-input__inner {
    line-height: 1;
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none !important;
  }

  input[type="number"] {
    -moz-appearance: textfield;
  }
}
</style>

