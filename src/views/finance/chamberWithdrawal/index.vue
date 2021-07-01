<template>
  <div class="app-container">
    <div class="block">
      <el-form ref="query" label-width="auto" label-position="left" :model="query">
        <el-row>
          <el-col :span="5">
            <el-form-item :span="12" label="打款状态：">
              <el-select v-model="query.status" placeholder="请选择打款状态">
                <el-option label="全部" :value="-1"></el-option>
                <el-option label="未打款" :value="0"></el-option>
                <el-option label="已打款" :value="1"></el-option>
                <el-option label="已驳回" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item label=" ">
              <el-button type="primary" :actionid="getId('', '查询')" v-if="has('', '查询')" @click="fetchData($event)">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" border fit highlight-current-row>
      <!-- <el-table-column type="selection" width="55px">
      </el-table-column> -->
      <!-- <el-table-column type="index" label="序号" width="60px">
      </el-table-column> -->
      <el-table-column label="提现日期" width="100px">
        <template slot-scope="scope">
          {{scope.row.createTime | dateFormat2}}
        </template>
      </el-table-column>
      <el-table-column label="申请方" width="180px">
        <template slot-scope="scope">
          {{scope.row.chamberName}}
        </template>
      </el-table-column>
      <el-table-column label="提现类型" width="100px">
        <template slot-scope="scope">
          <div v-if="scope.row.type == 0">商城</div>
          <div v-if="scope.row.type == 1">会费</div>
        </template>
      </el-table-column>
      <el-table-column label="申请提现金额(元)" width="150px">
        <template slot-scope="scope">
          {{scope.row.applyPrice}}
        </template>
      </el-table-column>
      <el-table-column label="微信手续费(元)" width="150px">
        <template slot-scope="scope">
          {{scope.row.wechatPrice === null ? 0 : scope.row.wechatPrice}}
        </template>
      </el-table-column>
      <!-- <el-table-column label="平台服务费(元)" width="150px">
        <template slot-scope="scope">
          {{scope.row.platfromPrice === null ? 0 : scope.row.platfromPrice}}
        </template>
      </el-table-column> -->
      <el-table-column label="打款金额(元)" width="150px">
        <template slot-scope="scope">
          {{scope.row.realPrice}}
        </template>
      </el-table-column>
      <el-table-column label="打款状态" width="80px">
        <template slot-scope="scope">
          <div v-if="scope.row.status == 0">未打款</div>
          <div v-if="scope.row.status == 1">已打款</div>
          <div v-if="scope.row.status == 2">已驳回</div>
        </template>
      </el-table-column>
      <!-- <el-table-column label="操作人">
        <template slot-scope="scope">
          {{scope.row.operator}}
        </template>
      </el-table-column> -->
      <el-table-column label="操作" >
        <template slot-scope="scope">
          <el-button type="text" @click="detail($event, scope.row)" :actionid="getId('', '详情')" v-if="has('', '详情')">详情</el-button>
          <el-button type="text" @click="confirm($event, scope.row)" :actionid="getId('', '确定打款')" v-if="has('', '确定打款')" :disabled="scope.row.status != 0">确定打款</el-button>
          <el-button type="text" @click="openReject($event, scope.row)" :actionid="getId('', '驳回')" v-if="has('', '驳回')" :disabled="scope.row.status != 0">驳回</el-button>
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
    <el-dialog
      title="驳回理由"
      :visible.sync="rejectVisible"
      width="40%">
      <el-form ref="form" :model="audit" :rules="auditRules" label-position="left" label-width="50px">
        <el-row>
          <el-col :span="22">
            <el-form-item label="">
              <el-radio-group v-model="audit.remark">
                <el-row>
                  <el-radio label="账号信息有误，请修改后再重新申请提现">账号信息有误，请修改后再重新申请提现</el-radio>
                </el-row>
                <el-row>
                  <el-radio label="其他">其他</el-radio>
                </el-row>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="" v-if="audit.remark == '其他'" prop="input">
              <el-input v-model="audit.input" placeholder="选择“其他”时需要输入具体的内容才可提交" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="reject">确定</el-button>
        <el-button @click="rejectVisible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script src="./chamberWithdrawal.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/common.scss";
</style>
