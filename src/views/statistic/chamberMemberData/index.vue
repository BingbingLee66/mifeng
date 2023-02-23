<template>
  <div class="app-container">
    <div class="block">
      <div style="height:20px;margin-bottom: 10px;">
        <span style="font-weight: 600; font-size: 18px;float: left;">商会会员统计</span>
        <span style="float: right;" class="text-btn-style" @click="showMeaning=true">数据定义</span>
      </div>
    </div>
    <el-table v-loading="listLoading" :data="chamberMemberList" element-loading-text="Loading" border fit highlight-current-row @sort-change="handleSortChange">
      <el-table-column label="商/协会">
        <template slot-scope="scope">
          {{ scope.row.date ? scope.row.date : '--' }}
        </template>
      </el-table-column>
      <el-table-column label="入会总人数" prop="joinedTotal" sortable="custom">
        <template slot-scope="scope">
          {{ scope.row.joinedTotal > 0 ? scope.row.joinedTotal : '--' }}
        </template>
      </el-table-column>
      <el-table-column label="商会邀请入会人数" prop="chamberInvitationTotal" sortable="custom">
        <template slot-scope="scope">
          {{ scope.row.chamberInvitationTotal > 0 ? scope.row.chamberInvitationTotal : '--' }}
        </template>
      </el-table-column>
      <el-table-column label="自己申请入会人数" prop="myselfApplyTotal" sortable="custom">
        <template slot-scope="scope">
          {{ scope.row.myselfApplyTotal > 0 ? scope.row.myselfApplyTotal : '--' }}
        </template>
      </el-table-column>
      <el-table-column label="会员邀请入会人数" prop="memberInvitationTotal" sortable="custom">
        <template slot-scope="scope">
          {{ scope.row.memberInvitationTotal > 0 ? scope.row.memberInvitationTotal : '--' }}
        </template>
      </el-table-column>
      <el-table-column label="商会后台添加入会人数" prop="chamberBackstageAddTotal" sortable="custom">
        <template slot-scope="scope">
          {{ scope.row.chamberBackstageAddTotal > 0 ? scope.row.chamberBackstageAddTotal : '--' }}
        </template>
      </el-table-column>
      <el-table-column label="个人会员" prop="personMemberTotal" sortable="custom">
        <template slot-scope="scope">
          {{ scope.row.personMemberTotal > 0 ? scope.row.personMemberTotal : '--' }}
        </template>
      </el-table-column>
      <el-table-column label="企业/团体" prop="companyMemberTotal" sortable="custom">
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
      :style="{'padding-top': '15px'}"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <el-dialog title="数据定义" :visible.sync="showMeaning" width="450px">
      <div class="meaning-wrap">
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
