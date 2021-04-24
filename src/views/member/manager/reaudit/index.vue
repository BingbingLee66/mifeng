<template>
  <div class="app-container">
    <div class="block">
      <el-form ref="query" label-width="auto" label-position="left" :model="query">
        <el-row>
          <el-col :span="12">
            <el-form-item label=" " label-width="0">
              <el-button type="primary" size="small" :actionid="getId('', '通过')" v-if="has('', '通过') && query.auditStatus == 0" @click="batchApproved($event)">通过</el-button>
              <el-button type="primary" size="small" :actionid="getId('', '驳回')" v-if="has('', '驳回') && query.auditStatus == 0" @click="batchRejectRemark($event)">驳回</el-button>
            </el-form-item>
          </el-col>
          <el-col :offset="7" :span="5">
            <el-form-item :span="12" label="状态：">
              <el-select v-model="query.auditStatus" placeholder="请选择状态" @change="fetchData">
                <el-option label="所有" :value="-1"></el-option>
                <el-option label="待审核" :value="0"></el-option>
                <el-option label="已通过" :value="1"></el-option>
                <el-option label="已驳回" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
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
      <el-table-column label="会员名字">
        <template slot-scope="scope">
          {{scope.row.name}}
        </template>
      </el-table-column>
      <el-table-column label="手机号" width="120px">
        <template slot-scope="scope">
          {{scope.row.phone}}
        </template>
      </el-table-column>
      <el-table-column label="商会职位">
        <template slot-scope="scope">
          {{scope.row.postName}}
        </template>
      </el-table-column>
      <el-table-column label="提交时间">
        <template slot-scope="scope">
          {{scope.row.updatedTs}}
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
          <el-button type="text" @click="detail($event, scope.row)">详情</el-button>
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
      :visible.sync="rejectVisible"
      width="30%">
      <el-form ref="form" :model="audit" label-position="left" label-width="50px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="">
              <el-radio-group v-model="audit.remark">
                <el-row>
                  <el-radio label="资料不属实">资料不属实</el-radio>
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
      :visible.sync="batchRejectVisible"
      width="30%">
      <el-form ref="form" :model="audit" label-position="left" label-width="50px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="">
              <el-radio-group v-model="audit.remark">
                <el-row>
                  <el-radio label="资料不属实">资料不属实</el-radio>
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
    <el-dialog
      title="详情"
      :visible.sync="detailVisible"
      width="60%">
      <el-form ref="form" label-position="right" label-width="150px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="会员姓名：">
              {{detailObj.name}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号：">
              {{detailObj.phone}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="头像：">
              <div class="portrait-box"><img :src="detailObj.portrait" /></div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="昵称：">
              {{detailObj.nickname}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="个人履历：">
              <div class="text-box">{{detailObj.resume}}</div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="公司LOGO：">
              <div class="license-box"><img :src="detailObj.companyLogo" /></div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="办公地址：">
              {{detailObj.companyAddress}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="职务：">
              {{detailObj.companyPosition}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话：">
              {{detailObj.companyPhone}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="公司简介：">
              <div class="text-box">{{detailObj.companyIntroduction}}</div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="发展历程：">
              <div class="text-box">{{detailObj.companyHistory}}</div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="荣誉资质：">
              <div class="text-box">{{detailObj.companyHonor}}</div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="detailObj.auditStatus != 0">
          <hr/>
        </el-row>
        <div style="font-size: 18px;">
          <el-row v-if="detailObj.auditStatus != 0">
            <el-col :offset="2" :span="6">
              审核结果：
              <span v-if="detailObj.auditStatus == 1">通过</span>
              <span v-if="detailObj.auditStatus == 2">已驳回</span>
            </el-col>
            <el-col v-if="detailObj.auditStatus == 2" :span="8">
              驳回理由：{{detailObj.rejectRemark}}
            </el-col>
            <el-col :span="8">
              审核人：{{detailObj.auditor}}
            </el-col>
          </el-row>
          <el-row v-if="detailObj.auditStatus != 0">
            <el-col :offset="2" :span="8">审核时间：{{detailObj.auditedTs}}</el-col>
            <el-col :span="8">提交时间：{{detailObj.createdTs}}</el-col>
          </el-row>
        </div>

      </el-form>
      <span slot="footer" class="dialog-footer" v-if="detailObj.auditStatus == 0">
        <el-button type="primary" @click="approved($event, detailObj)" :actionid="getId('', '通过')" v-if="has('', '通过')">通过</el-button>
        <el-button @click="rejectRemark($event, detailObj)" :actionid="getId('', '驳回')" v-if="has('', '驳回')">驳回</el-button>
        <el-button @click.native="detailVisible = false">关闭</el-button>
      </span>
      <span slot="footer" class="dialog-footer" v-if="detailObj.auditStatus != 0">
        <el-button type="primary" @click.native="detailVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script src="./reaudit.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/common.scss";
</style>
<style>
.portrait-box {
  width: 100px;
  height: 100px;
  border-color: #409EFF;
}
.portrait-box img {
  width: 100%;
  height: 100%;
}
.license-box {
  width: 180px;
  height: 100px;
  border-color: #409EFF;
}
.license-box img {
  width: 100%;
  height: 100%;
}
.text-box {
  border: 1px solid #333;
  padding: 5px;
  min-height: 50px;
  max-height: 300px;
  overflow-y: auto;
}
</style>
