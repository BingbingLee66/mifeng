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
            <div class="card-value">{{ sumData.totalActivity }}</div>
            <div class="card-key">累计举办活动</div>
          </div>
        </div>
        <div class="h-cut-line"></div>
        <div class="c-card-box">
          <div class="card-box-3">
            <div class="card-value">{{ sumData.totalUv }}</div>
            <div class="card-key">累计访问人数</div>
          </div>
        </div>
        <div class="h-cut-line"></div>
        <div class="c-card-box">
          <div class="card-box-3">
            <div class="card-value">{{ sumData.totalPv }}</div>
            <div class="card-key">累计访问次数</div>
          </div>
        </div>
        <div class="h-cut-line"></div>
        <div class="c-card-box">
          <div class="card-box-3">
            <div class="card-value" style="color: #FF0000;">{{ sumData.totalShare }}</div>
            <div class="card-key">累计分享人数</div>
          </div>
        </div>
        <div class="h-cut-line"></div>
        <div class="c-card-box">
          <div class="card-box-3">
            <div class="card-value">{{ sumData.totalJoin }}</div>
            <div class="card-key">累计参加人数</div>
          </div>
        </div>
        <div class="h-cut-line"></div>
        <div class="c-card-box">
          <div class="card-box-3">
            <div class="card-value">{{ sumData.totalSign }}</div>
            <div class="card-key">累计签到人数</div>
          </div>
        </div>
      </div>
    </div>
    <el-table :data="dataList" v-loading="listLoading" element-loading-text="Loading" border fit highlight-current-row @sort-change="handleSortChange">
      <el-table-column label="商/协会">
        <template slot-scope="scope">
          {{ scope.row.chamberName }}
        </template>
      </el-table-column>
      <el-table-column label="累计举办活动" sortable="custom">
        <template slot-scope="scope">
          {{ scope.row.totalActivity > 0 ? scope.row.totalActivity : '--' }}
        </template>
      </el-table-column>
      <el-table-column label="累计访问人数/uv" sortable="custom">
        <template slot-scope="scope">
          {{ scope.row.totalUv > 0 ? scope.row.totalUv : '--' }}
        </template>
      </el-table-column>
      <el-table-column label="累计访问次数/pv" sortable="custom">
        <template slot-scope="scope">
          {{ scope.row.totalPv > 0 ? scope.row.totalPv : '--' }}
        </template>
      </el-table-column>
      <el-table-column label="累计分享人数" sortable="custom">
        <template slot-scope="scope">
          {{ scope.row.totalShare > 0 ? scope.row.totalShare : '--' }}
        </template>
      </el-table-column>
      <el-table-column label="累计参加人数" sortable="custom">
        <template slot-scope="scope">
          {{ scope.row.totalJoin > 0 ? scope.row.totalJoin : '--' }}
        </template>
      </el-table-column>
      <el-table-column label="累计签到人数" sortable="custom">
        <template slot-scope="scope">
          {{ scope.row.totalSign > 0 ? scope.row.totalSign : '--' }}
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

    <el-dialog title="数据定义" :visible.sync="showMeaning" width="540px">
      <div class="meaning-wrap">
        <div class="meaning-item">
          <div class="tit">累计举办活动</div>
          <div class="sub">在指定时间范围内，累计举办的活动数<span style="color:#FF0000;"> (有人报名且审核通过且已签到才算)</span>。</div>
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
  width: 16%;
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

