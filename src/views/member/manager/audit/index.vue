<template>
  <div class="app-container">
    <div class="block">
      <el-form ref="query" label-width="55px" label-position="left" :model="query">
        <el-row>
          <el-col :span="5">
            <el-form-item :span="12" label="状态：">
              <el-select v-model="query.auditStatus" placeholder="请选择状态">
                <el-option label="所有" :value="-1" />
                <el-option label="待审核" :value="0" />
                <el-option label="已通过" :value="1" />
                <el-option label="已驳回" :value="2" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item label=" ">
              <el-button v-if="has('', '查询')" type="primary" :actionid="getId('', '查询')" @click="fetchData($event)">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div style="margin-bottom:30px">
      <el-button v-if="has('', '通过') && query.auditStatus == 0" type="success" :actionid="getId('', '通过')" @click="batchApproved($event)">通过</el-button>
      <el-button v-if="has('', '驳回') && query.auditStatus == 0" type="warning" :actionid="getId('', '驳回')" @click="batchRejectRemark($event)">驳回</el-button>
    </div>
    <div style="margin-bottom:30px">
      <el-table id="out-table" v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55px" />

        <!-- <el-table-column label="头像/企业(团体)logo" width="180px">
          <template slot-scope="scope">
            <img style="width: 44px;height: 44px;border-radius: 50%;" :src="scope.row.type == 0 ? scope.row.portrait : scope.row.companyLogo">
          </template>
        </el-table-column> -->
        <el-table-column label="用户头像" width="180px" prop="uavatar" />
        <el-table-column label="用户名" width="130px" prop="uname " />
        <el-table-column label="会员姓名/联系人姓名" width="180px">
          <template slot-scope="scope">
            {{ scope.row.type == 0 ? scope.row.name : scope.row.contactName }}
          </template>
        </el-table-column>
        <el-table-column label="手机号/联系人电话" width="180px">
          <template slot-scope="scope">
            {{ scope.row.type == 0 ? scope.row.phone : scope.row.contactPhone }}
          </template>
        </el-table-column>
        <el-table-column label="入会类型" width="120px">
          <template slot-scope="scope">
            {{ scope.row.type == 0 ? '个人' : '企业/团体' }}
          </template>
        </el-table-column>
        <el-table-column label="会内职位" width="120px">
          <template slot-scope="scope">
            {{ scope.row.postName }}
          </template>
        </el-table-column>
        <el-table-column label="企业/团体名称" width="120px">
          <template slot-scope="scope">
            {{ scope.row.companyName }}
          </template>
        </el-table-column>
        <el-table-column label="所在部门" width="180px">
          <template slot-scope="scope">
            {{ scope.row.departmentName }}
          </template>
        </el-table-column>
        <el-table-column label="申请时间" width="180px">
          <template slot-scope="scope">
            {{ scope.row.createdTs }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="120px">
          <template slot-scope="scope">
            <div v-if="scope.row.auditStatus == 0">待审核</div>
            <div v-if="scope.row.auditStatus == 1">已通过</div>
            <div v-if="scope.row.auditStatus == 2">已驳回</div>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- <el-button type="text" @click="detail($event, scope.row)" :actionid="getId('', '详情')" v-if="has('', '详情')">详情</el-button> -->
            <el-button v-if="has('', '通过') && scope.row.auditStatus == 0" type="success" :loading="approveLoading" :actionid="getId('', '通过')" @click="approved($event, scope.row)">通过</el-button>
            <el-button v-if="has('', '驳回') && scope.row.auditStatus == 0" type="warning" :loading="rejectLoading" :actionid="getId('', '驳回')" @click="rejectRemark($event, scope.row)">驳回</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-pagination background layout="total, sizes, prev, pager, next, jumper" :page-sizes="pageSizes" :page-size="limit" :total="total" :current-page.sync="currentpage" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    <el-dialog title="驳回理由" :visible.sync="visible" width="30%">
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
    <el-dialog title="驳回理由" :visible.sync="batchVisible" width="30%">
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
