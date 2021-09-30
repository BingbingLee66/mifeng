<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="提现" name="10"></el-tab-pane>
      <el-tab-pane label="提现银行卡设置" name="11"></el-tab-pane>
    </el-tabs>
    <div v-if="activeName == '10'">
      <div class="block">
        <div class="stat-card">
          <div class="card-box">
            <div class="card-box-3">
              <div class="card-key">会费累计提现金额（元）</div>
              <div class="card-value">¥{{pfStatistics.memberWithdraw == null ? 0 : pfStatistics.memberWithdraw}}</div>
            </div>
          </div>
          <div class="cut-line"></div>
          <div class="card-box">
            <div class="card-box-3">
              <div class="card-key">会费可提现金额（元）</div>
              <div class="card-value" style="color: #FF0000;">¥{{pfStatistics.memberLave}}</div>
            </div>
          </div>
          <div class="card-box">
            <div class="card-box-3">
              <el-button type="danger" :actionid="getId('提现', '申请提现')" v-if="has('提现', '申请提现')" @click="applyForMember($event)">申请提现</el-button>
            </div>
          </div>
        </div>
      </div>
      <el-tabs>
        <el-tab-pane label="提现记录"></el-tab-pane>
      </el-tabs>
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
        <el-button type="primary" size="mini" :actionid="getId('提现', '导表')" v-if="has('提现', '导表')" style="float: right;" @click="exportExcel($event)">导表</el-button>
      </div>
      <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" border fit highlight-current-row @selection-change="handleSelectionChange">
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
        <!-- <el-table-column label="平台服务费((元)">
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
            <el-button type="text" @click="detail($event, scope.row)" :actionid="getId('提现', '详情')" v-if="has('提现', '详情')">详情</el-button>
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
    <div v-if="activeName == '11'">
      <el-form ref="form" :model="cardSet" label-position="left" label-width="auto">
        <el-row>
          <el-col :span="12">
            <el-form-item label="商会名称：">
              <el-input v-model="cardSet.chamberName" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="账户名：">
              <el-input v-model="cardSet.accountName" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="开户行：">
              <el-input v-model="cardSet.accountBank" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="账号：">
              <el-input v-model="cardSet.account" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-col :span="8">
            <el-button type="danger" v-dbClick @click="openVisible($event)">修改</el-button>
          </el-col>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog
      title="提现银行卡设置"
      :visible.sync="visible"
      width="30%">
      <el-form ref="form" :model="formObj" :rules="rules" label-position="left" label-width="auto">
        <el-row>
          <el-col :span="24">
            <el-form-item label="商会名称：" prop="chamberName">
              <el-input v-model="formObj.chamberName" placeholder="请输入商会名称" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="账户名：" prop="accountName">
              <el-input v-model="formObj.accountName" placeholder="请输入账户名"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="开户行：" prop="accountBank">
              <el-input v-model="formObj.accountBank" placeholder="请输入开户行"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="账号：" prop="account">
              <el-input v-model="formObj.account" placeholder="请输入账号"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-col :offset="4" :span="16">
            <el-button type="danger" v-dbClick @click="save">保存</el-button>
            <el-button @click.native="visible = false">取消</el-button>
          </el-col>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      title="提现详情"
      :visible.sync="detailVisible"
      width="50%">
      <el-form ref="form" :model="detailObj" :rules="rules" label-position="left" label-width="auto">
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

<script src="./cashWithdrawal.js"></script>

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
