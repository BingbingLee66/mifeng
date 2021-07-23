<template>
  <div class="app-container">
    <div class="block">
      <el-form ref="query" label-position="left" :model="query">
        <el-row>
          <el-col :span="4">
            <el-form-item label="用户名：" label-width="80px">
              <el-input v-model="query.uname" />
            </el-form-item>
          </el-col>
          <el-col :span="5" style="margin-left:10px">
            <el-form-item label="会员姓名/联系人姓名：" label-width="160px">
              <el-input v-model="query.memberName" />
            </el-form-item>
          </el-col>
          <el-col :span="5" style="margin-left: 10px;">
            <el-form-item label="手机号/联系人电话：" label-width="150px">
              <el-input v-model="query.phone" />
            </el-form-item>
          </el-col>
          <el-col :span="9" style="margin-left: 10px;">
            <el-form-item label="时间：" label-width="60px">
              <el-date-picker
                v-model="query.date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              />
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item label=" ">
              <el-button v-if="has('', '查询')" type="primary" :actionid="getId('', '查询')" @click="fetchData($event)">查询</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item label=" ">
              <el-button v-if="has('', '添加缴费')" type="primary" :actionid="getId('', '添加缴费')" @click="openVisible($event)">添加缴费</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <br>
    <el-table id="out-table" v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row>
      <!-- <el-table-column type="selection" width="55px">
      </el-table-column> -->
      <!-- <el-table-column type="index" label="序号" width="60px">
      </el-table-column> -->
      <el-table-column label="用户名" prop="uname" width="150px" />
      <el-table-column label="ID" width="100px">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
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
      <el-table-column label="会内职位">
        <template slot-scope="scope">
          {{ scope.row.memberPostName }}
        </template>
      </el-table-column>
      <el-table-column label="缴费时间">
        <template slot-scope="scope">
          {{ scope.row.payTs | dateFormat }}
        </template>
      </el-table-column>
      <el-table-column label="缴费金额(元)">
        <template slot-scope="scope">
          {{ scope.row.feeAmount }}
        </template>
      </el-table-column>
      <el-table-column label="支付方式" width="100px">
        <template slot-scope="scope">
          <div v-if="scope.row.type == 0">后台添加</div>
          <div v-if="scope.row.type == 1">小程序</div>
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
      title="添加缴费记录"
      :visible.sync="visible"
      width="80%"
    >
      <el-form ref="memberQuery" label-position="left" :model="memberQuery">
        <el-row>
          <el-col :span="5">
            <el-form-item :span="12" label="用户名：" label-width="100px">
              <el-input v-model="memberQuery.uname" />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item :span="12" label="会员职位：" label-width="100px">
              <el-select v-model="memberQuery.memberPostType" value-key="id" placeholder="请选择会员职位" @change="changeFee">
                <el-option v-for="post in memberPostOptions" :key="post.id" :label="post.postName" :value="post" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6" style="margin-left: 10px;">
            <el-form-item label="会员姓名/联系人姓名：" label-width="160px">
              <el-input v-model="memberQuery.memberName" />
            </el-form-item>
          </el-col>
          <el-col :span="6" style="margin-left: 10px;">
            <el-form-item label="手机号/联系人电话：" label-width="150px">
              <el-input v-model="memberQuery.phone" />
            </el-form-item>
          </el-col>
          <el-col :span="2" style="margin-left: 10px;">
            <el-form-item label=" ">
              <el-button type="primary" @click="getMember">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-table id="out-table" v-loading="listLoading1" :data="list1" element-loading-text="Loading" border fit highlight-current-row @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55px" />
        <!-- <el-table-column type="index" label="序号" width="60px"> -->
        <el-table-column label="用户名" prop="uname" />
        <el-table-column label="会员姓名/联系人姓名">
          <template slot-scope="scope">
            {{ scope.row.type == 0 ? scope.row.name : scope.row.contactName }}
          </template>
        </el-table-column>
        <el-table-column label="手机号/联系人电话">
          <template slot-scope="scope">
            {{ scope.row.type == 0 ? scope.row.phone : scope.row.contactPhone }}
          </template>
        </el-table-column>
        <el-table-column label="会内职位">
          <template>
            {{ memberQuery.memberPostType.postName }}
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
        :style="{'padding-top': '15px'}"
        @size-change="handleSizeChange1"
        @current-change="handleCurrentChange1"
      />
      <el-divider />
      <el-form ref="form" :model="formObj" :rules="rules" label-position="left">
        <el-row>
          <el-col :span="9">
            <el-form-item label="缴费时间：" prop="date" label-width="100px">
              <el-date-picker
                v-model="formObj.date"
                type="datetime"
              />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item :span="12" label="缴费年限：" prop="years" label-width="100px">
              <el-select v-model="formObj.years" placeholder="请选择缴费年限">
                <el-option v-for="year in yearsOptions" :key="year.value" :label="year.label" :value="year.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="5">
            <el-form-item :span="12" label="缴费金额：">
              {{ memberFee * formObj.years }}元
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-col :offset="8" :span="8">
            <el-button v-dbClick type="primary" @click="addMemberFee">确定</el-button>
            <el-button @click.native="closeVisible">取消</el-button>
          </el-col>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>

</template>

<script src="./memberFee.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/common.scss";
</style>
