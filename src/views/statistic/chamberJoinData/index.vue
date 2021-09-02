<template>
  <div class="app-container">
    <div class="block">
      <div style="height:20px;margin-bottom: 10px;">
        <span style="font-weight: 600; font-size: 18px;float: left;">商会入驻数据</span>
        <span style="float: right;" class="text-btn-style" @click="showMeaning=true">数据定义</span>
      </div>
      <div class="data-card">
        <div class="c-card-box">
          <div class="card-box-3">
            <div class="card-value">{{ pfStatistics.monthlyChamberJoin }}</div>
            <div class="card-key">本月商会入驻</div>
          </div>
        </div>
        <div class="h-cut-line"></div>
        <div class="c-card-box">
          <div class="card-box-3">
            <div class="card-value">{{ pfStatistics.totalChambers }}</div>
            <div class="card-key">累计商会入驻</div>
          </div>
        </div>
        <div class="h-cut-line"></div>
        <div class="c-card-box">
          <div class="card-box-3">
            <div class="card-value">{{ pfStatistics.monthlyMemberJoin }}</div>
            <div class="card-key">本月会员入驻</div>
          </div>
        </div>
        <div class="h-cut-line"></div>
        <div class="c-card-box">
          <div class="card-box-3">
            <div class="card-value">{{ pfStatistics.totalMembers }}</div>
            <div class="card-key">累计会员入驻</div>
          </div>
        </div>
        <div class="h-cut-line"></div>
        <div class="c-card-box">
          <div class="card-box-3">
            <div class="card-value">{{ pfStatistics.loginMembers }}</div>
            <div class="card-key">累计授权登录人数</div>
          </div>
        </div>
      </div>
    </div>
    <div class="block">
      <span style="color: #bbb;margin-right: 20px;">时间</span>
      <el-radio-group v-model="query.days" size="mini" @change="initDatePicker">
        <el-radio-button :label="7">7天</el-radio-button>
        <el-radio-button :label="14">14天</el-radio-button>
        <el-radio-button :label="30">30天</el-radio-button>
      </el-radio-group>
      <el-date-picker
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        v-model="query.date"
        type="daterange"
        :clearable="false"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="fetchData"
        size="mini">
      </el-date-picker>
      <el-radio-group v-model="query.type" size="mini" @change="typeDatePicker">
        <el-radio-button :label="1">日</el-radio-button>
        <el-radio-button :label="2">周</el-radio-button>
        <el-radio-button :label="3">月</el-radio-button>
      </el-radio-group>
      <el-button type="primary" size="mini" style="float: right;" @click="exportExcel">导表</el-button>
    </div>
    <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" border fit highlight-current-row @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55px">
      </el-table-column>
      <el-table-column label="日期" width="120px">
        <template slot-scope="scope">
          {{ scope.row.date }}
        </template>
      </el-table-column>
      <el-table-column label="授权登录人数">
        <template slot-scope="scope">
          {{ scope.row.activeWxUserTotal > 0 ? scope.row.activeWxUserTotal : '--' }}
        </template>
      </el-table-column>
      <el-table-column label="入会总人数">
        <template slot-scope="scope">
          {{ scope.row.joinedTotal > 0 ? scope.row.joinedTotal : '--' }}
        </template>
      </el-table-column>
      <el-table-column label="商会邀请入会人数">
        <template slot-scope="scope">
          {{ scope.row.chamberInvitationTotal > 0 ? scope.row.chamberInvitationTotal : '--' }}
        </template>
      </el-table-column>
      <el-table-column label="自己申请入会人数">
        <template slot-scope="scope">
          {{ scope.row.myselfApplyTotal	> 0 ? scope.row.myselfApplyTotal : '--' }}
        </template>
      </el-table-column>
      <el-table-column label="会员邀请入会人数">
        <template slot-scope="scope">
          {{ scope.row.memberInvitationTotal > 0 ? scope.row.memberInvitationTotal : '--' }}
        </template>
      </el-table-column>
      <el-table-column label="商会后台添加入会人数">
        <template slot-scope="scope">
          {{ scope.row.chamberBackstageAddTotal > 0 ? scope.row.chamberBackstageAddTotal : '--' }}
        </template>
      </el-table-column>
      <el-table-column label="个人会员">
        <template slot-scope="scope">
          {{ scope.row.personMemberTotal > 0 ? scope.row.personMemberTotal : '--' }}
        </template>
      </el-table-column>
      <el-table-column label="企业/团体">
        <template slot-scope="scope">
          {{ scope.row.companyMemberTotal > 0 ? scope.row.companyMemberTotal : '--' }}
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

    <el-dialog title="数据定义" :visible.sync="showMeaning" width="450px">
      <div class="meaning-wrap">
        <div class="meaning-item">
          <div class="tit">授权登录人数</div>
          <div class="sub">在指定时间范围内，在小程序端<span style="color: #ff0000">首次</span>授权登录的人数。</div>
        </div>
        <div class="meaning-item">
          <div class="tit">入会总人数</div>
          <div class="sub">在指定时间范围内，从不同渠道加入商会的总人数。</div>
        </div>
        <div class="meaning-item">
          <div class="tit">商会邀请入会人数</div>
          <div class="sub">在指定时间范围内，通过商会邀请海报加入商会的人数。</div>
        </div>
        <div class="meaning-item">
          <div class="tit">自己申请入会人数</div>
          <div class="sub">在指定时间范围内，自己通过小程序前端申请入会的人数。</div>
        </div>
        <div class="meaning-item">
          <div class="tit">会员邀请入会人数</div>
          <div class="sub">在指定时间范围内，由老会员邀请入会的人数。</div>
        </div>
        <div class="meaning-item">
          <div class="tit">商会后台添加入会人数</div>
          <div class="sub">在指定时间范围内，由商会管理员在后台添加入会的人数。</div>
        </div>
        <div class="meaning-item">
          <div class="tit">个人会员</div>
          <div class="sub">在指定时间范围内，加入商会且入会类型为个人的会员。</div>
        </div>
        <div class="meaning-item">
          <div class="tit">企业/团体</div>
          <div class="sub">在指定时间范围内，加入商会且入会类型为企业/团体的会员。</div>
        </div>
      </div>
      <div style="text-align: center;">
        <el-button type="primary" @click="showMeaning=false">我知道了</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script src="./chamberJoinData.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/common.scss";
</style>
<style>
.data-card {
  width: 100%;
  height: 120px;
  border-radius: 2px;
  border: 1px solid #ccc;
}

.c-card-box {
  float: left;
  width: 19.5%;
  height: 100%;
  text-align: center;
  display: table;
}

.card-box-3 {
  width: 100%;
  display: table-cell;
  vertical-align: middle;
}

.card-key {
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
