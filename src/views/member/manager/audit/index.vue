<template>
  <div class="app-container">
    <div class="audit-query-form">
      <el-form
        ref="query"
        :inline="true"
        label-width="70px"
        label-position="right"
        :model="query"
        size="small"
      >
        <el-form-item label="审核状态">
          <el-select v-model="query.auditStatus" placeholder="请选择">
            <el-option label="所有" :value="-1" />
            <el-option label="待审核" :value="0" />
            <el-option label="已通过" :value="1" />
            <el-option label="已驳回" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="query.phone" />
        </el-form-item>
        <el-form-item label="入会类型">
          <el-select v-model="query.type" placeholder="请选择">
            <el-option label="全部" :value="-1" />
            <el-option label="个人" :value="0" />
            <el-option label="企业/团体" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="query.name" />
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="query.uname" />
        </el-form-item>
        <el-form-item label="">
          <el-button
            v-if="has('', '查询')"
            type="primary"
            :actionid="getId('', '查询')"
            @click="fetchData($event)"
            >查询
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div style="margin-bottom: 30px">
      <el-button
        v-if="has('', '通过') && query.auditStatus == 0"
        type="success"
        size="small"
        :actionid="getId('', '通过')"
        @click="batchApproved($event)"
      >
        通过
      </el-button>
      <el-button
        v-if="has('', '驳回') && query.auditStatus == 0"
        type="warning"
        size="small"
        :actionid="getId('', '驳回')"
        @click="batchRejectRemark($event)"
      >
        驳回
      </el-button>
    </div>
    <div style="margin-bottom: 20px">
      <el-table
        id="out-table"
        v-loading="listLoading"
        :data="list"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55px" />
        <el-table-column label="用户头像" width="85px" prop="uavatar">
          <template slot-scope="scope">
            <img
              style="
                width: 60px;
                height: 60px;
                border-radius: 50%;
                object-fit: cover;
              "
              :src="scope.row.uavatar"
            />
          </template>
        </el-table-column>
        <el-table-column label="用户名" width="200px" prop="uname ">
          <template slot-scope="scope">
            {{ scope.row.uname }}
          </template>
        </el-table-column>
        <el-table-column label="入会类型" width="100px">
          <template slot-scope="scope">
            {{ scope.row.type == 0 ? "个人" : "企业/团体" }}
          </template>
        </el-table-column>
        <el-table-column label="联系信息" width="300px">
          <template slot-scope="scope">
            <div v-if="scope.row.type == 0">
              <div>【会员姓名】{{ scope.row.name }}</div>
              <div>【会员手机号】{{ scope.row.phone }}</div>
            </div>
            <div v-else>
              <div>【企业/团体名称】{{ scope.row.companyName }}</div>
              <div>【联系人姓名】{{ scope.row.contactName }}</div>
              <div>【联系人手机号】{{ scope.row.contactPhone }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="所属部门" width="150px">
          <template slot-scope="scope">
            {{ scope.row.departmentName ? scope.row.departmentName : '--' }}
          </template>
        </el-table-column>
        <el-table-column label="会内职位" width="150px">
          <template slot-scope="scope">
            {{ scope.row.postName }}
          </template>
        </el-table-column>
        <el-table-column label="申请时间/申请途径" width="160px">
          <template slot-scope="scope">
            <div>{{ scope.row.createdTs }}</div>
            <div v-if="scope.row.registerType == 0">后台</div>
            <div v-if="scope.row.registerType == 1">小程序</div>
            <div v-if="scope.row.registerType == 2">商会邀请</div>
            <div v-if="scope.row.registerType == 3">会员邀请</div>
            <div v-if="scope.row.registerType == 4">会员邀请</div>
            <div v-if="scope.row.registerType == 10">app</div>

          </template>
        </el-table-column>
        <el-table-column label="状态" width="100px">
          <template slot-scope="scope">
            <div v-if="scope.row.auditStatus == 0">待审核</div>
            <div v-if="scope.row.auditStatus == 1">已通过</div>
            <div v-if="scope.row.auditStatus == 2">已驳回</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <!-- <el-button type="text" @click="detail($event, scope.row)" :actionid="getId('', '详情')" v-if="has('', '详情')">详情</el-button> -->
            <el-button
              v-if="has('', '通过') && scope.row.auditStatus == 0"
              type="success"
              size="small"
              :loading="rowId === scope.row.id"
              :actionid="getId('', '通过')"
              @click="approved($event, scope.row)"
            >
              通过
            </el-button>
            <el-button
              v-if="has('', '驳回') && scope.row.auditStatus == 0"
              type="warning"
              size="small"
              :loading="rejectLoading"
              :actionid="getId('', '驳回')"
              @click="rejectRemark($event, scope.row)"
            >
              驳回
            </el-button>
            <el-button
              v-if="scope.row.auditStatus !== 0"
              type="primary"
              size="small"
              @click="getDetail(scope.row.id)"
              >详情</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-pagination
      background
      layout="total, sizes, prev, pager, next, jumper"
      :page-sizes="pageSizes"
      :page-size="limit"
      :total="total"
      :current-page.sync="currentpage"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <el-dialog title="驳回理由" :visible.sync="visible" width="480px">
      <el-form
        ref="form"
        :model="audit"
        label-position="left"
        label-width="50px"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item label="">
              <el-radio-group v-model="audit.remark" @change="radioChange">
                <el-row>
                  <el-radio label="资料乱填" value="1">资料乱填</el-radio>
                </el-row>
                <el-row>
                  <el-radio label="不是本商会会员" value="2"
                    >不是本商会会员</el-radio
                  >
                </el-row>
                <el-row>
                  <el-radio label="提交资料不齐全" value="3"
                    >提交资料不齐全</el-radio
                  >
                </el-row>
                <el-row class="radio-input-style">
                  <el-radio label="其他">其他(30字内)</el-radio>
                  <el-input
                    v-show="showInput"
                    v-model="audit.otherRemark"
                    resize="none"
                    show-word-limit
                    maxlength="30"
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 4 }"
                  />
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
      <el-form
        ref="form"
        :model="audit"
        label-position="left"
        label-width="50px"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item label="">
              <el-radio-group v-model="audit.remark" @change="radioChange">
                <el-row>
                  <el-radio label="资料乱填">资料乱填</el-radio>
                </el-row>
                <el-row>
                  <el-radio label="不是本商会会员">不是本商会会员</el-radio>
                </el-row>
                <el-row>
                  <el-radio label="提交资料不齐全">提交资料不齐全</el-radio>
                </el-row>
                <el-row class="radio-input-style">
                  <el-radio label="其他">其他(30字内)</el-radio>
                  <el-input
                    v-show="showInput"
                    v-model="audit.otherRemark"
                    resize="none"
                    show-word-limit
                    maxlength="30"
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 4 }"
                  />
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

    <!-- ---------------------------详情弹窗--------------------------- -->
    <el-dialog title="详情" :visible.sync="detailDia" width="25%" center>
      <div class="margin-b">操作人：{{ detailObj.auditor }}</div>
      <div class="margin-b">
        操作时间：{{ detailObj.auditedTsLong | dateFormat }}
      </div>
      <div class="margin-b" v-if="detailObj.auditStatus == 2">
        驳回原因：{{ detailObj.rejectRemark }}
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="detailDia = false" type="primary"
          >我知道了</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script src="./audit.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/common.scss";
.margin-b {
  margin-bottom: 15px;
}
</style>

<style lang="scss">
.audit-query-form .el-form-item {
  margin-right: 20px;

  .el-input__inner {
    width: 130px;
  }
}

.radio-input-style {
  .el-textarea {
    margin-top: 10px;
    margin-left: 24px;
  }
}
</style>
