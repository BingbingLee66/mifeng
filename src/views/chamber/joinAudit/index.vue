<template>
  <div class="app-container">
    <div class="block">
      <el-form ref="query" :model="query" label-width="80px">
        <el-form-item label="状态：">
          <el-col :span="4">
            <el-select v-model="query.status" @change="fetchData" placeholder="请选择状态">
              <el-option v-for="(item, index) in statusOptions" :label="item.label" :value="item.value" :key="index"></el-option>
            </el-select>
          </el-col>
        </el-form-item>
      </el-form>
    </div>
    <div style="margin-bottom:30px">
      <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" border fit highlight-current-row>
        <el-table-column type="index" label="序号" width="60px">
        </el-table-column>
        <el-table-column label="商/协会名称">
          <template slot-scope="scope">
            {{scope.row.name}}
          </template>
        </el-table-column>
        <el-table-column label="商/协会logo">
          <template slot-scope="scope">
            <img style="width: 44px;height: 44px;border-radius: 50%;object-fit: cover;" :src="scope.row.systemLogo" alt="">
          </template>
        </el-table-column>
        <el-table-column label="联系人姓名">
          <template slot-scope="scope">
            {{scope.row.president}}
          </template>
        </el-table-column>
        <el-table-column label="联系人手机号">
          <template slot-scope="scope">
            {{scope.row.phone}}
          </template>
        </el-table-column>
        <el-table-column label="办公地址">
          <template slot-scope="scope">
            {{scope.row.address}}
          </template>
        </el-table-column>
        <el-table-column label="社会团体法人登记证" width="160px">
          <template slot-scope="scope">
            <img style="width: 80px; height: 35px;" :src="scope.row.license" @click="enlarge(scope.row.license)" />
          </template>
        </el-table-column>
        <el-table-column label="推荐人">
          <template slot-scope="scope">
            {{scope.row.referrer}}
          </template>
        </el-table-column>
        <el-table-column label="申请人ID">
          <template slot-scope="scope">
            {{scope.row.userId}}
          </template>
        </el-table-column>
        <el-table-column label="申请时间" width="180px">
          <template slot-scope="scope">
            {{scope.row.createdTs}}
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <div v-if="scope.row.auditStatus == 0">待审核</div>
            <div v-if="scope.row.auditStatus == 1">通过</div>
            <div v-if="scope.row.auditStatus == 2">驳回</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" v-if="scope.row.auditStatus != 0"  @click="detail(scope.row)">详情</el-button>
            <el-button type="text" v-if="scope.row.auditStatus == 0" @click="handlePassOrReject(scope.row,1)">通过</el-button>
            <el-button type="text" v-if="scope.row.auditStatus == 0" @click="handlePassOrReject(scope.row,2)">驳回</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-pagination background layout="total, sizes, prev, pager, next, jumper" :page-sizes="pageSizes" :page-size="limit" :total="total" :current-page.sync="currentpage" @size-change="handleSizeChange" @current-change="handleCurrentChange">
    </el-pagination>

    <el-dialog title="商会详情" :visible.sync="detailVisible" width="50%" center>
      <el-row>
        <el-col :offset="2" :span="8">商/协会名称</el-col>
        <el-col :span="10">{{detailObj.name}}</el-col>
      </el-row>
      <el-row>
        <el-col :offset="2" :span="8">商/协会logo</el-col>
        <el-col :span="10"><img style="width: 44px;height: 44px;border-radius: 50%;object-fit: cover;" :src="detailObj.systemLogo" /></el-col>
      </el-row>
      <el-row>
        <el-col :offset="2" :span="8">联系人姓名</el-col>
        <el-col :span="10">{{detailObj.president}}</el-col>
      </el-row>
      <el-row>
        <el-col :offset="2" :span="8">联系人手机号</el-col>
        <el-col :span="10">{{detailObj.phone}}</el-col>
      </el-row>
      <el-row>
        <el-col :offset="2" :span="8">办公地址</el-col>
        <el-col :span="10">{{detailObj.address}}</el-col>
      </el-row>
      <el-row>
        <el-col :offset="2" :span="8">社会团体法人登记证</el-col>
        <el-col :span="10">
          <div class="license-box"><img :src="detailObj.license" @click="enlarge(detailObj.license)" /></div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :offset="2" :span="8">推荐人</el-col>
        <el-col :span="10" v-if="detailObj.referrer">{{detailObj.referrer}}</el-col>
        <el-col :span="10" v-if="!detailObj.referrer">无</el-col>
      </el-row>
      <el-row>
        <hr />
      </el-row>

      <el-row v-if="detailObj.auditStatus != 0">
        <el-col :offset="2" :span="8">审核结果</el-col>
        <el-col :span="10">
          <div v-if="detailObj.auditStatus == 1">通过</div>
          <div v-if="detailObj.auditStatus == 2">驳回</div>
        </el-col>
      </el-row>
      <el-row v-if="detailObj.auditStatus == 2">
        <el-col :offset="2" :span="8">驳回理由</el-col>
        <el-col :span="10">{{detailObj.rejectRemark}}</el-col>
      </el-row>
      <el-row v-if="detailObj.auditStatus != 0">
        <el-col :offset="2" :span="8">操作时间</el-col>
        <el-col :span="10">{{detailObj.auditedTs}}</el-col>
      </el-row>
      <el-row v-if="detailObj.auditStatus != 0">
        <el-col :offset="2" :span="8">操作人</el-col>
        <el-col :span="10">{{detailObj.auditor}}</el-col>
      </el-row>

      <span slot="footer" class="dialog-footer" v-if="detailObj.auditStatus != 0">
        <el-button type="primary" @click.native="detailVisible = false">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="通过" :visible.sync="passDia" width="30%" center>
      <div class="pass-tip">温馨提示：设置密码后，自动审核通过</div>
      <div class="block">
        <el-row>
          <el-col :offset="2" :span="7">商/协会名称</el-col>
          <el-col :span="10">{{ detailObj.name }}</el-col>
        </el-row>
        <el-row>
          <el-col :offset="2" :span="7">后台账号</el-col>
          <el-col :span="10">{{ detailObj.phone }}</el-col>
        </el-row>
      </div>
      <div class="block">
        <el-form ref="detail" :model="detailObj" :rules="rules" label-position="left" label-width="150px">
          <el-row>
            <el-col :offset="2" :span="20">
              <el-form-item label="设置密码" prop="temporaryPass">
                <el-input type="password" v-model="detailObj.temporaryPass"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :offset="2" :span="20">
              <el-form-item label="确认密码" prop="confirmPassword">
                <el-input type="password" v-model="detailObj.confirmPassword"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :offset="2" :span="20">
              <el-form-item label="排序" prop="level">
                <el-input v-model="detailObj.level" minlength=1></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="audit($event, detailObj, 1)" :actionid="getId('', '通过')" v-if="has('', '通过')">确 定</el-button>
        <el-button @click="passDia = false">取 消</el-button>
      </span>
    </el-dialog>

    <el-dialog title="驳回" :visible.sync="rejectDia" width="30%" center>
      <div class="block">
        <el-row>
          <el-col :offset="2" :span="7">商/协会名称：{{ detailObj.name }}</el-col>
        </el-row>
      </div>
      <div class="block">
        <el-input type="textarea" class="reject-dia-reason" v-model="rejectRemark" show-word-limit placeholder="请填写驳回原因，1-30个字" resize="none" minlength="1" maxlength="30"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="audit($event, detailObj, 2)" :actionid="getId('', '驳回')" v-if="has('', '驳回')">确定</el-button>
        <el-button @click="rejectDia = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script src="./joinAudit.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import 'src/styles/common.scss';
.pass-tip{
  width: 100%;
  margin-bottom: 20px;
  text-align: center;
  font-size: 12px;
  color: #848282;
}
/deep/.reject-dia-reason .el-textarea__inner{
  width: 85%;
  margin-left:40px;
  height: 100px;
}
/deep/.reject-dia-reason.el-textarea .el-input__count{
  bottom: -22px;
  right: 40px;
}
</style>
<style>
.license-box {
  width: 180px;
  height: 100px;
  border-color: #409eff;
}
.license-box img {
  width: 100%;
  height: 100%;
}
</style>
