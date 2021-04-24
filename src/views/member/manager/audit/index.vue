<template>
  <div class="app-container">
    <div class="block">
      <el-form ref="query" label-width="auto" label-position="left" :model="query">
        <el-row>
          <el-col :span="5">
            <el-form-item :span="12" label="状态：">
              <el-select v-model="query.auditStatus" placeholder="请选择状态">
                <el-option label="所有" :value="-1"></el-option>
                <el-option label="待审核" :value="0"></el-option>
                <el-option label="已通过" :value="1"></el-option>
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
    <br/>
    <el-row>
      <el-button type="success" :actionid="getId('', '通过')" v-if="has('', '通过') && query.auditStatus == 0" @click="batchApproved($event)">通过</el-button>
      <el-button type="warning" :actionid="getId('', '驳回')" v-if="has('', '驳回') && query.auditStatus == 0" @click="batchRejectRemark($event)">驳回</el-button>
    </el-row>
    <el-table id="out-table" :data="list" v-loading="listLoading" element-loading-text="Loading" border fit highlight-current-row @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55px">
      </el-table-column>
      <!-- <el-table-column type="index" label="序号" width="60px">
      </el-table-column> -->
      <!-- <el-table-column label="ID">
        <template slot-scope="scope">
          {{scope.row.id}}
        </template>
      </el-table-column> -->
      <el-table-column label="申请人名字">
        <template slot-scope="scope">
          {{scope.row.name}}
        </template>
      </el-table-column>
      <el-table-column label="手机号" width="120px">
        <template slot-scope="scope">
          {{scope.row.phone}}
        </template>
      </el-table-column>
      <el-table-column label="籍贯">
        <template slot-scope="scope">
          {{nativePlaceStr(scope.row.nativePlace)}}
        </template>
      </el-table-column>
      <el-table-column label="公司">
        <template slot-scope="scope">
          {{scope.row.companyName}}
        </template>
      </el-table-column>
      <el-table-column label="申请时间">
        <template slot-scope="scope">
          {{scope.row.createdTs}}
        </template>
      </el-table-column>
      <el-table-column label="状态" width="100px">
        <template slot-scope="scope">
          <div v-if="scope.row.auditStatus == 0">待审核</div>
          <div v-if="scope.row.auditStatus == 1">已通过</div>
          <div v-if="scope.row.auditStatus == 2">已驳回</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" >
        <template slot-scope="scope">
          <el-button type="text" @click="detail($event, scope.row)" :actionid="getId('', '详情')" v-if="has('', '详情')">详情</el-button>
          <el-button type="text" @click="approved($event, scope.row)" :actionid="getId('', '通过')" v-if="has('', '通过') && scope.row.auditStatus == 0">通过</el-button>
          <el-button type="text" @click="rejectRemark($event, scope.row)" :actionid="getId('', '驳回')" v-if="has('', '驳回') && scope.row.auditStatus == 0">驳回</el-button>
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
      title="驳回理由"
      :visible.sync="visible"
      width="30%">
      <el-form ref="form" :model="audit" label-position="left" label-width="50px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="">
              <el-radio-group v-model="audit.remark">
                <el-row>
                  <el-radio label="资料乱填">资料乱填</el-radio>
                </el-row>
                <el-row>
                  <el-radio label="不是本商会会员">不是本商会会员</el-radio>
                </el-row>
                <el-row>
                  <el-radio label="提交资料不齐全">提交资料不齐全</el-radio>
                </el-row>
                <el-row>
                  <el-radio label="其他">其他</el-radio>
                </el-row>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="reject">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="驳回理由"
      :visible.sync="batchVisible"
      width="30%">
      <el-form ref="form" :model="audit" label-position="left" label-width="50px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="">
              <el-radio-group v-model="audit.remark">
                <el-row>
                  <el-radio label="资料乱填">资料乱填</el-radio>
                </el-row>
                <el-row>
                  <el-radio label="不是本商会会员">不是本商会会员</el-radio>
                </el-row>
                <el-row>
                  <el-radio label="提交资料不齐全">提交资料不齐全</el-radio>
                </el-row>
                <el-row>
                  <el-radio label="其他">其他</el-radio>
                </el-row>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="batchReject">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script src="./audit.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/common.scss";
</style>
