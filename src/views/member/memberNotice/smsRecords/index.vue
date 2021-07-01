<template>
  <div class="app-container">
    <el-table id="out-table" :data="list" v-loading="listLoading" element-loading-text="Loading" border fit highlight-current-row>
      <!-- <el-table-column type="selection" width="55px">
      </el-table-column> -->
      <el-table-column type="index" label="序号" width="60px">
      </el-table-column>
      <!-- <el-table-column label="ID" width="100px">
        <template slot-scope="scope">
          {{scope.row.id}}
        </template>
      </el-table-column> -->
      <el-table-column label="短信内容">
        <template slot-scope="scope">
          {{scope.row.msg}}
        </template>
      </el-table-column>
      <el-table-column label="发送时间" width="200px">
        <template slot-scope="scope">
          {{scope.row.sendTs | dateFormat}}
        </template>
      </el-table-column>
      <el-table-column label="添加人" width="120px">
        <template slot-scope="scope">
          {{scope.row.operator}}
        </template>
      </el-table-column>
      <el-table-column label="接收对象(人)" width="150px">
        <template slot-scope="scope">
          {{scope.row.mobileTotal}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100px">
        <template slot-scope="scope">
          <el-button type="text" @click="detail(scope.row)">详情</el-button>
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
      title="短信详情"
      :visible.sync="visible"
      width="70%">
      <el-row>
        <el-col :span="8">
          <div class="sms-detail-title">发送时间：</div>{{detailObj.sendTs | dateFormat}}
        </el-col>
        <el-col :span="8">
          <div class="sms-detail-title">添加人：</div>{{detailObj.operator}}
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="22">
          <div class="sms-detail-title">短信内容：</div>{{detailObj.msg}}
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="22">
          <div class="sms-detail-title">接收对象：</div>共{{detailObj.mobileTotal}}个会员
        </el-col>
      </el-row>
      <el-table id="out-table" :data="detailList" v-loading="listLoading2" element-loading-text="Loading" border fit highlight-current-row>
        <!-- <el-table-column type="selection" width="55px">
        </el-table-column> -->
        <el-table-column type="index" label="序号" width="60px">
        </el-table-column>
        <!-- <el-table-column label="ID" width="100px">
          <template slot-scope="scope">
            {{scope.row.id}}
          </template>
        </el-table-column> -->
        <el-table-column label="会员名字">
          <template slot-scope="scope">
            {{scope.row.memberName}}
          </template>
        </el-table-column>
        <el-table-column label="手机号" width="200px">
          <template slot-scope="scope">
            {{scope.row.mobile}}
          </template>
        </el-table-column>
        <el-table-column label="职位" width="120px">
          <template slot-scope="scope">
            {{scope.row.postName}}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="150px">
          <template slot-scope="scope">
            <div v-if="scope.row.smsStatus == 'DELIVRD'">成功</div>
            <div v-if="scope.row.smsStatus == 'SUBBMITED'">未明</div>
            <div v-if="scope.row.smsStatus != 'DELIVRD' && scope.row.smsStatus != 'SUBBMITED'">{{scope.row.smsStatus}}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100px">
          <template slot-scope="scope">
            <el-button type="text" @click="memberDetail(scope.row)">详情</el-button>
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
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click.native="visible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script src="./smsRecords.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/common.scss";
</style>
<style>
.sms-detail-title {
  width: 100px;
  font-size: 15px;
  font-weight: 600;
  float: left;
  margin-bottom: 15px;
}
</style>
