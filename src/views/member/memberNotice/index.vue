<template>
  <div class="app-container">
    <div class="block">
      <el-form ref="query" label-position="left" :model="query">
        <el-row>
          <el-col :span="4">
            <el-form-item label="用户名：" label-width="70px">
              <el-input v-model="query.uname" placeholder="请输入用户名" />
            </el-form-item>
          </el-col>
          <el-col :span="6" style="margin-left: 10px;">
            <el-form-item label="会员姓名/联系人姓名：" label-width="160px">
              <el-input v-model="query.memberName" placeholder="请输入会员姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="5" style="margin-left: 10px;">
            <el-form-item label="手机号/联系人电话：" label-width="150px">
              <el-input v-model="query.phone" placeholder="请输入手机号" />
            </el-form-item>
          </el-col>
          <el-col :span="5" style="margin-left: 10px;">
            <el-form-item label="职位：" label-width="70px">
              <el-select v-model="query.memberPostId" placeholder="请选择职位类型">
                <el-option v-for="post in memberPostOptions" :key="post.value" :label="post.label" :value="post.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-col :span="5" style="margin-left: 10px;"> -->
        <el-row>
          <el-col :span="4">
            <el-form-item label="缴费状态：" label-width="90px">
              <el-select v-model="query.type" placeholder="请选择缴费状态">
                <el-option v-for="type in typeOptions" :key="type.value" :label="type.label" :value="type.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="2" style="margin-left: 10px;">
            <el-form-item label=" ">
              <el-button v-if="has('', '查询')" type="primary" :actionid="getId('', '查询')" @click="fetchData($event)">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
    </div>
    <br>
    <el-row>
      <el-button v-if="has('', '发短信')" type="primary" :actionid="getId('', '发短信')" @click="openSmsVisible($event)">发短信</el-button>
      <el-button v-if="has('', '短信记录')" type="primary" :actionid="getId('', '短信记录')" @click="smsRecords($event)">短信记录</el-button>
    </el-row>
    <el-table id="out-table" ref="membertable" v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55px" />
      <!-- <el-table-column type="index" label="序号" width="60px">
      </el-table-column> -->
      <!-- <el-table-column label="ID" width="100px">
        <template slot-scope="scope">
          {{scope.row.id}}
        </template>
      </el-table-column> -->
      <el-table-column label="用户名" prop="uname" />
      <el-table-column label="会员姓名/联系人姓名">
        <template slot-scope="scope">
          {{ scope.row.memberName }}
        </template>
      </el-table-column>
      <el-table-column label="手机号/联系人电话">
        <template slot-scope="scope">
          {{ scope.row.phone }}
        </template>
      </el-table-column>
      <el-table-column label="职位">
        <template slot-scope="scope">
          {{ scope.row.memberPostName }}
        </template>
      </el-table-column>
      <el-table-column label="最近缴费时间">
        <template slot-scope="scope">
          {{ scope.row.payTs | dateFormat }}
        </template>
      </el-table-column>
      <el-table-column label="缴费状态">
        <template slot-scope="scope">
          {{ (scope.row.activeTs - new Date()) > 0 ? '已缴会费' : '未缴会费' }}
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
    <el-dialog
      title="群发短信"
      :visible.sync="smsVisible"
      width="60%"
    >
      <el-form ref="form" label-width="100px" :model="formObj" :rules="rules" label-position="left">
        <el-row>
          <el-col :span="12">
            <el-form-item label="发送对象：">
              共{{ selectionDatas.length }}个会员
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item label="短信内容：" prop="msg">
              <el-input v-model="formObj.msg" type="textarea" :rows="8" :disabled="true" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-col :offset="8" :span="8">
            <el-button v-dbClick type="primary" @click="sendSms">确定</el-button>
            <el-button @click.native="closeVisible">取消</el-button>
          </el-col>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>

</template>

<script src="./memberNotice.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/common.scss";
</style>
