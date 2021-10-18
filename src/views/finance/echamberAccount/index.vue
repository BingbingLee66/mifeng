<template>
  <div class="app-container">
    <div class="block">
      <div class="stat-card">
        <div class="left-box">
          <div class="card-box-1">
            <div class="card-key">平台累计交易额（元）</div>
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
      <div class="extra-box">
        <div class="extra-card-box">
            <div class="card-key">累计收取微信手续费（元）</div>
            <div class="card-value">¥{{pfStatistics.cumulativeWechatDeduction}}</div>
          </div>
      </div>
      <div class="extra-box" style="background-color: rgba(169, 254, 137, 1);">
        <div class="extra-card-box">
            <div class="card-key">累计收取平台服务费（元）</div>
            <div class="card-value">¥{{pfStatistics.cumulativePlatfromDeduction}}</div>
          </div>
      </div>
    </div>
    <el-tabs v-model="activeName" style="clear: left;" @tab-click="handleClick">
      <el-tab-pane label="交易数据" name="12"></el-tab-pane>
      <el-tab-pane label="提现记录" name="13"></el-tab-pane>
    </el-tabs>
    <div v-if="activeName == '12'">
      <div class="block">
        <span style="color: #bbb;margin-right: 20px;">时间</span>
        <el-radio-group v-model="query.days" size="mini" @change="initDatePicker">
          <el-radio-button :label="7" >7天</el-radio-button>
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
        <el-button type="primary" size="mini" style="float: right;" @click="exportExcel1($event)">导表</el-button>
      </div>
      <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" border fit highlight-current-row @selection-change="handleSelectionChange1">
        <el-table-column type="selection" width="55px">
        </el-table-column>
        <!-- <el-table-column type="index" label="序号" width="60px">
        </el-table-column> --> 
        <el-table-column label="日期">
          <template slot-scope="scope">
            {{scope.row.rptDate | dateFormat2}}
          </template>
        </el-table-column>
        <el-table-column label="商城交易额(元）">
          <template slot-scope="scope">
            {{scope.row.cumulativeShopPrice}}
          </template>
        </el-table-column>
        <el-table-column label="会费交易额（元）">
          <template slot-scope="scope">
            {{scope.row.cumulativeMemberPrice}}
          </template>
        </el-table-column>
        <el-table-column label="合计（元）">
          <template slot-scope="scope">
            {{Math.floor((scope.row.cumulativeShopPrice + scope.row.cumulativeMemberPrice) * 100) / 100}}
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
    </div>
    <div v-if="activeName == '13'">
      <div class="block">
        <span style="color: #bbb;margin-right: 20px;">时间</span>
        <el-radio-group v-model="query.days" size="mini" @change="initDatePicker">
          <el-radio-button :label="7" >7天</el-radio-button>
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
        <el-button type="primary" size="mini" style="float: right;" @click="exportExcel2($event)">导表</el-button>
      </div>
      <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" border fit highlight-current-row @selection-change="handleSelectionChange2">
        <el-table-column type="selection" width="55px">
        </el-table-column>
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
        <el-table-column label="状态">
          <template slot-scope="scope">
            <div v-if="scope.row.status == 0">审核中</div>
            <div v-if="scope.row.status == 1">提现成功</div>
            <div v-if="scope.row.status == 2">提现失败</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" >
          <template slot-scope="scope">
            <el-button type="text" @click="detail($event, scope.row)" :actionid="getId('提现记录', '详情')" v-if="has('提现记录', '详情')">详情</el-button>
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
    </div>

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
            <el-form-item label="微信手续费(元)：">
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
            <el-form-item label="平台服务费(元)：">
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

<script src="./echamberAccount.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/common.scss";
</style>
<style scoped>
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
.extra-box {
  float: left;
  margin: 20px 10px 0 0;
  width: 280px;
  height: 120px;
  border-radius: 5px;
  border: 1px solid #ccc;
  background-color: rgba(255, 219, 136, 1);
  text-align: center;
  display: table;
}
.extra-card-box {
  width: 100%;
  display: table-cell;
  vertical-align: middle;
}
</style>
