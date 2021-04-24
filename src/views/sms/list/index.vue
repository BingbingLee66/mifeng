<template>
  <div class="app-container">
    <div class="block">
      <el-form ref="query" label-width="auto" label-position="right" :model="query">
        <el-row>
          <el-col :span="7">
            <el-form-item label="手机号码：">
              <el-input v-model="query.mobile"></el-input>
            </el-form-item>
          </el-col>
          <el-col :offset="1" :span="7">
            <el-form-item label="发送时间：">
              <el-select v-model="query.sendTimeType">
                <el-option label="24h内" :value="1"></el-option>
                <el-option label="3天内" :value="2"></el-option>
                <el-option label="7天内" :value="3"></el-option>
                <el-option label="一个月内" :value="4"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item label=" ">
              <el-button type="primary" @click="fetchData($event)" :actionid="getId('', '查询')" v-if="has('', '查询')">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <br/>
    <el-table id="out-table" :data="list" v-loading="listLoading" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column type="selection" width="55px">
      </el-table-column>
      <!-- <el-table-column type="index" label="序号" width="60px">
      </el-table-column> -->
      <el-table-column label="ID" width="100px">
        <template slot-scope="scope">
          {{scope.row.id}}
        </template>
      </el-table-column>
      <el-table-column label="任务批号" width="120px">
        <template slot-scope="scope">
          {{scope.row.bid}}
        </template>
      </el-table-column>
      <el-table-column label="手机号码" width="150px">
        <template slot-scope="scope">
          {{scope.row.mobile}}
        </template>
      </el-table-column>
      <el-table-column label="短信内容">
        <template slot-scope="scope">
          {{scope.row.msg}}
        </template>
      </el-table-column>
      <el-table-column label="发送状态" width="100px">
        <template slot-scope="scope">
          <div v-if="scope.row.smsStatus == 'DELIVRD'">成功</div>
          <div v-if="scope.row.smsStatus == 'SUBBMITED'">未明</div>
          <div v-if="scope.row.smsStatus != 'DELIVRD' && scope.row.smsStatus != 'SUBBMITED'">{{scope.row.smsStatus}}</div>
        </template>
      </el-table-column>
      <el-table-column label="任务时间" width="200px">
        <template slot-scope="scope">
          {{scope.row.createdTs}}
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
      @current-change="handleCurrentChange">
    </el-pagination>
    <el-dialog
      title=""
      :visible.sync="visible"
      width="60%">
      <el-row>
        <el-col :offset="2" :span="8">任务批号</el-col>
        <el-col :span="10">{{detailObj.bid}}</el-col>
      </el-row>
      <el-row>
        <el-col :offset="2" :span="8">手机号码</el-col>
        <el-col :span="10">{{detailObj.mobile}}</el-col>
      </el-row>
      <el-row>
        <el-col :offset="2" :span="8">短信内容</el-col>
        <el-col :span="10">{{detailObj.msg}}</el-col>
      </el-row>
      <el-row>
        <el-col :offset="2" :span="8">状态回调</el-col>
          <div v-if="detailObj.smsStatus == 'DELIVRD'">成功</div>
          <div v-if="detailObj.smsStatus == 'SUBBMITED'">未明</div>
          <div v-if="detailObj.smsStatus != 'DELIVRD' && detailObj.smsStatus == 'SUBBMITED'">{{detailObj.smsStatus}}</div>
      </el-row>
      <el-row>
        <el-col :offset="2" :span="8">发送时间</el-col>
        <el-col :span="10">{{detailObj.sendTs}}</el-col>
      </el-row>
      <el-row>
        <el-col :offset="2" :span="8">状态时间</el-col>
        <el-col :span="10">{{detailObj.receivedTs}}</el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click.native="visible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script src="./list.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/common.scss";
</style>
