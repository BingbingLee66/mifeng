<template>
  <div class="app-container">
    <div class="block">
      <div class="stat-card">
        <div class="card-box">
          <div class="card-box-3">
            <div class="card-key">本月收到会费（元）</div>
            <div class="card-value">¥{{pfMonthStatistics.sumMemberPrice}}</div>
          </div>
        </div>
        <div class="cut-line"></div>
        <div class="card-box">
          <div class="card-box-3">
            <div class="card-key">累计收到会费（元）</div>
            <div class="card-value">¥{{pfStatistics.cumulativeMemberPrice}}</div>
          </div>
        </div>
        <div class="cut-line"></div>
        <div class="card-box">
          <div class="card-box-3">
            <div class="card-key">可提现会费（元）</div>
            <div class="card-value" style="color: #FF0000;">¥{{pfStatistics.memberLave}}</div>
          </div>
        </div>
        <div class="card-box">
          <div class="card-box-3">
            <el-button type="danger" :actionid="getId('', '前往结算提现')" v-if="has('', '前往结算提现')" @click="goSettle">前往结算提现</el-button>
          </div>
        </div>
      </div>
    </div>
    <el-tabs>
      <el-tab-pane label="会员缴费数据"></el-tab-pane>
    </el-tabs>
    <div class="block">
      <span style="color: #bbb;margin-right: 20px;">时间</span>
      <el-radio-group v-model="query1.days" size="mini" @change="initDatePicker1">
        <el-radio-button :label="7" >7天</el-radio-button>
        <el-radio-button :label="14">14天</el-radio-button>
        <el-radio-button :label="30">30天</el-radio-button>
      </el-radio-group>
      <el-date-picker
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        v-model="query1.date"
        type="daterange"
        :clearable="false"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        size="mini"
        @change="fetchData1">
      </el-date-picker>
      <el-button type="primary" size="mini" :actionid="getId('', '导表')" v-if="has('', '导表')" style="float: right;" @click="exportExcel1($event)">导表</el-button>
    </div>
    <el-table :data="list1" v-loading="listLoading1" element-loading-text="Loading" border fit highlight-current-row @selection-change="handleSelectionChange1">
      <el-table-column type="selection" width="55px">
      </el-table-column>
      <!-- <el-table-column type="index" label="序号" width="60px">
      </el-table-column> --> 
      <el-table-column label="日期">
        <template slot-scope="scope">
          {{scope.row.rptDate | dateFormat2}}
        </template>
      </el-table-column>
      <el-table-column label="缴费人数">
        <template slot-scope="scope">
          {{scope.row.memberCount}}
        </template>
      </el-table-column>
      <el-table-column label="缴费金额(元)">
        <template slot-scope="scope">
          {{scope.row.memberPrice}}
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="total, sizes, prev, pager, next, jumper"
      :page-sizes="pageSizes1"
      :page-size="limit1"
      :total="total1"
      :current-page.sync="currentpage1"
      @size-change="handleSizeChange1"
      @current-change="handleCurrentChange1">
    </el-pagination>
    <el-tabs>
      <el-tab-pane label="会员缴费详情"></el-tab-pane>
    </el-tabs>
    <div class="block">
      <span style="color: #bbb;margin-right: 20px;">时间</span>
      <el-radio-group v-model="query2.days" size="mini" @change="initDatePicker2">
        <el-radio-button :label="7" >7天</el-radio-button>
        <el-radio-button :label="14">14天</el-radio-button>
        <el-radio-button :label="30">30天</el-radio-button>
      </el-radio-group>
      <el-date-picker
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        v-model="query2.date"
        type="daterange"
        :clearable="false"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="fetchData2"
        size="mini">
      </el-date-picker>
      <el-button type="primary" size="mini" :actionid="getId('', '导表')" v-if="has('', '导表')" style="float: right;" @click="fetchData2($event)">导表</el-button>
    </div>
    <el-table :data="list2" v-loading="listLoading2" element-loading-text="Loading" border fit highlight-current-row @selection-change="handleSelectionChange2">
      <el-table-column type="selection" width="55px">
      </el-table-column>
      <!-- <el-table-column type="index" label="序号" width="60px">
      </el-table-column> --> 
      <el-table-column label="会员名字">
        <template slot-scope="scope">
          {{scope.row.memberName}}
        </template>
      </el-table-column>
      <el-table-column label="职位">
        <template slot-scope="scope">
          {{scope.row.memberPostName}}
        </template>
      </el-table-column>
      <el-table-column label="手机号">
        <template slot-scope="scope">
          {{scope.row.phone}}
        </template>
      </el-table-column>
      <el-table-column label="缴费时间">
        <template slot-scope="scope">
          {{scope.row.createdTs | dateFormat}}
        </template>
      </el-table-column>
      <el-table-column label="缴费金额(元)">
        <template slot-scope="scope">
          {{scope.row.feeAmount}}
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="total, sizes, prev, pager, next, jumper"
      :page-sizes="pageSizes2"
      :page-size="limit2"
      :total="total2"
      :current-page.sync="currentpage2"
      @size-change="handleSizeChange2"
      @current-change="handleCurrentChange2">
    </el-pagination>
  </div>
</template>

<script src="./memberFee.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/common.scss";
</style>
<style>
.stat-card {
  width: 100%;
  height: 120px;
  border-radius: 10px;
  border: 1px solid #ccc;
}
.card-box {
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
  margin-top: 10px;
  color: #008000;
  font-weight: 600;
}
.cut-line {
  float: left;
  margin-top: 42px;
  width: 1px;
  height: 36px;
  border-left: 1px solid #ccc;
}
</style>
