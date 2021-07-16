<template>
  <div class="app-container">
    <div class="block">
      <div class="stat-card">
        <div class="left-box">
          <div class="card-box-1">
            <div class="card-key">累计交易额（元）</div>
            <div class="card-value">¥{{pfStatistics.cumulativeTransactionAmount}}</div>
          </div>
        </div>
        <div class="right-box">
          <div class="box-line">
            <div class="card-box-2">
              <div class="card-key">商城累计交易额（元）</div>
              <div class="card-value">¥{{pfStatistics.cumulativeShopPrice}}</div>
            </div>
            <div class="card-box-2">
              <div class="card-key">商城已提现（元）</div>
              <div class="card-value">¥{{pfStatistics.shopWithdraw == null ? 0 : pfStatistics.shopWithdraw}}</div>
            </div>
            <div class="card-box-2" style="border-right: 0;">
              <div class="card-key">商城待提现（元）</div>
              <div class="card-value" style="color: #FF0000;">¥{{pfStatistics.shopLave}}</div>
            </div>
          </div>
          <div class="box-line" style="border-bottom: 0;">
            <div class="card-box-2">
              <div class="card-key">会费累计交易额（元）</div>
              <div class="card-value">¥{{pfStatistics.cumulativeMemberPrice}}</div>
            </div>
            <div class="card-box-2">
              <div class="card-key">会费已提现（元）</div>
              <div class="card-value">¥{{pfStatistics.memberWithdraw == null ? 0 : pfStatistics.memberWithdraw}}</div>
            </div>
            <div class="card-box-2" style="border-right: 0;">
              <div class="card-key">会费待提现（元）</div>
              <div class="card-value" style="color: #FF0000;">¥{{pfStatistics.memberLave}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-tabs>
      <el-tab-pane label="商城交易详情"></el-tab-pane>
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
        @change="fetchData1"
        size="mini">
      </el-date-picker>
    </div>
    <el-table :data="list1" v-loading="listLoading1" element-loading-text="Loading" border fit highlight-current-row>
      <!-- <el-table-column type="selection" width="55px">
      </el-table-column> -->
      <!-- <el-table-column type="index" label="序号" width="60px">
      </el-table-column> --> 
      <el-table-column label="日期">
        <template slot-scope="scope">
          {{scope.row.rptDate | dateFormat2}}
        </template>
      </el-table-column>
      <el-table-column label="交易额(元）">
        <template slot-scope="scope">
          {{scope.row.shopPrice}}
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
      @current-change="handleCurrentChange1"
      :style="{'padding-top': '15px'}">
    </el-pagination>

    <el-tabs>
      <el-tab-pane label="会费交易详情"></el-tab-pane>
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
    </div>
    <el-table :data="list2" v-loading="listLoading2" element-loading-text="Loading" border fit highlight-current-row>
      <!-- <el-table-column type="selection" width="55px">
      </el-table-column> -->
      <!-- <el-table-column type="index" label="序号" width="60px">
      </el-table-column> --> 
      <el-table-column label="日期">
        <template slot-scope="scope">
          {{scope.row.rptDate | dateFormat2}}
        </template>
      </el-table-column>
      <el-table-column label="缴费人数(人)">
        <template slot-scope="scope">
          {{scope.row.memberCount}}
        </template>
      </el-table-column>
      <el-table-column label="交易额（元）">
        <template slot-scope="scope">
          {{scope.row.memberPrice}}
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
      @current-change="handleCurrentChange2"
      :style="{'padding-top': '15px'}">
    </el-pagination>

    <el-tabs>
      <el-tab-pane label="提现记录"></el-tab-pane>
    </el-tabs>
    <div class="block">
      <span style="color: #bbb;margin-right: 20px;">时间</span>
      <el-radio-group v-model="query3.days" size="mini" @change="initDatePicker3">
        <el-radio-button :label="7" >7天</el-radio-button>
        <el-radio-button :label="14">14天</el-radio-button>
        <el-radio-button :label="30">30天</el-radio-button>
      </el-radio-group>
      <el-date-picker
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        v-model="query3.date"
        type="daterange"
        :clearable="false"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="fetchData3"
        size="mini">
      </el-date-picker>
    </div>
    <el-table :data="list3" v-loading="listLoading3" element-loading-text="Loading" border fit highlight-current-row>
      <!-- <el-table-column type="selection" width="55px">
      </el-table-column> -->
      <!-- <el-table-column type="index" label="序号" width="60px">
      </el-table-column> --> 
      <el-table-column label="提现日期">
          <template slot-scope="scope">
            {{scope.row.createTime | dateFormat2}}
          </template>
        </el-table-column>
        <el-table-column label="申请方">
          <template slot-scope="scope">
            {{scope.row.chamberName}}
          </template>
        </el-table-column>
        <el-table-column label="提现类型">
          <template slot-scope="scope">
            <div v-if="scope.row.type == 0">商城</div>
            <div v-if="scope.row.type == 1">会费</div>
          </template>
        </el-table-column>
        <el-table-column label="申请提现金额(元)">
          <template slot-scope="scope">
            {{scope.row.applyPrice}}
          </template>
        </el-table-column>
        <el-table-column label="微信手续费(元)">
          <template slot-scope="scope">
            {{scope.row.wechatPrice}}
          </template>
        </el-table-column>
        <!-- <el-table-column label="平台服务费(元)">
          <template slot-scope="scope">
            {{scope.row.platfromPrice}}
          </template>
        </el-table-column> -->
        <el-table-column label="打款金额(元)">
          <template slot-scope="scope">
            {{scope.row.realPrice}}
          </template>
        </el-table-column>
        <el-table-column label="打款时间">
          <template slot-scope="scope">
            {{scope.row.processTime | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作" >
          <template slot-scope="scope">
            <el-button type="text" @click="detail(scope.row)">详情</el-button>
          </template>
        </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="total, sizes, prev, pager, next, jumper"
      :page-sizes="pageSizes3"
      :page-size="limit3"
      :total="total3"
      :current-page.sync="currentpage3"
      @size-change="handleSizeChange3"
      @current-change="handleCurrentChange3"
      :style="{'padding-top': '15px'}">
    </el-pagination>
    <el-dialog
      title="提现详情"
      :visible.sync="detailVisible"
      width="50%">
      <el-form ref="form" :model="detailObj" label-position="left" label-width="auto">
        <el-row>
          <el-col :span="12">
            <el-form-item label="申请方：">
              {{detailObj.chamberName}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="微信手续费：">
              {{detailObj.wechatPrice}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="提现日期：">
              {{detailObj.createTime | dateFormat}}
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="平台服务费：">
              {{detailObj.platfromPrice}}
            </el-form-item>
          </el-col> -->
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="提现类型：">
              <span v-if="detailObj.type == 0">商城</span>
              <span v-if="detailObj.type == 1">会员</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="应打款金额：">
              {{detailObj.realPrice}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="申请提现金额：">
              {{detailObj.applyPrice}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider></el-divider>
        <el-row>
          <el-col :span="12">
            <el-form-item label="账户名：">
              {{detailObj.accountName}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="开户行：">
              {{detailObj.accountBank}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="账号：">
              {{detailObj.account}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider></el-divider>
        <el-row>
          <el-col :span="12">
            <el-form-item label="状态：">
              <span v-if="detailObj.status == 0">审核中</span>
              <span v-if="detailObj.status == 1">提现成功</span>
              <span v-if="detailObj.status == 2">提现失败</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="处理时间：">
              {{detailObj.processTime | dateFormat}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="detailObj.status == 2">
          <el-col :span="12">
            <el-form-item label="驳回理由：">
              {{detailObj.rejectRemark}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-col :offset="8" :span="8">
            <el-button type="primary" v-dbClick @click="detailVisible = false">确定</el-button>
          </el-col>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script src="./detail.js"></script>

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
.left-box {
  float: left;
  width: 25%;
  height: 100%;
  text-align: center;
  display: table;
}
.right-box {
  /*float: left;*/
  width: 75%;
  height: 100%;
  text-align: center;
  display: table;
}
.card-box-1 {
  width: 100%;
  display: table-cell;
  vertical-align: middle;
  border-right: 1px solid #ccc;
}
.card-box-2 {
  width: 33%;
  display: table-cell;
  vertical-align: middle;
  border-right: 1px solid #ccc;
}
.box-line {
  width: 100%;
  height: 60px;
  display: table;
  border-bottom: 1px solid #ccc;
}
.card-key {
}
.card-value {
  margin-top: 10px;
  color: #008000;
  font-weight: 600;
}
</style>
