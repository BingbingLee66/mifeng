<template>
  <div>
    <el-dialog title="详情" :visible.sync="detailVisible" width="50%">
      <div slot="title" class="header-title">
                    <span class="title-name">{{title}} </span>
                </div>
      <table border="1" style="border-collapse: collapse;">
        <tr>
          <th>修改项</th>
          <th>修改前</th>
          <th>修改后</th>
        </tr>
        <tr v-if="afterRevision.companyName!=beforeRevision.companyName">
          <td>企业名称</td>
          <td>{{beforeRevision.companyName}}</td>
          <td>{{afterRevision.companyName}}</td>
        </tr>
        <tr v-if="afterRevision.contactName!=beforeRevision.contactName">
          <td>联系人姓名</td>
          <td>{{beforeRevision.contactName}}</td>
          <td>{{afterRevision.contactName}}</td>
        </tr>

        <tr v-if="afterRevision.contactPhone!=beforeRevision.contactPhone">
          <td>联系人电话</td>
          <td>{{beforeRevision.contactPhone}}</td>
          <td>{{afterRevision.contactPhone}}</td>
        </tr>
        <tr v-if="afterRevision.companyLogo!=beforeRevision.companyLogo">
          <td>企业logo</td>
          <!-- <img class="updateImg" :src="afterRevision.backOfIdCard" />
          <img class="updateImg" :src="afterRevision.frontOfIdCard" /> -->
          <td><img class="updateImg" :src="beforeRevision.companyLogo" /></td>
          <td><img class="updateImg" :src="afterRevision.companyLogo" /></td>
        </tr>
        <tr v-if="afterRevision.postName!=beforeRevision.postName">
          <td>会内职位</td>
          <td>{{beforeRevision.postName}}</td>
          <td>{{afterRevision.postName}}</td>
        </tr>

        <tr v-if="afterRevision.name!=beforeRevision.name">
          <td>姓名</td>
          <td>{{beforeRevision.name}}</td>
          <td>{{afterRevision.name}}</td>
        </tr>

        <tr v-if="afterRevision.birthday!=beforeRevision.birthday">
          <td>生日</td>
          <td>{{beforeRevision.birthday}}</td>
          <td>{{afterRevision.birthday}}</td>
        </tr>

        <tr v-if="afterRevision.gender!=beforeRevision.gender">
          <td>性别</td>
          <td>
            <span v-if="beforeRevision.gender==1">男</span>
            <span v-else>女</span>
          </td>
          <td>
            <span v-if="afterRevision.gender==1">男</span>
            <span v-else>女</span>
          </td>
        </tr>

        <tr v-if="afterRevision.nativePlace!=beforeRevision.nativePlace">
          <td>籍贯</td>
          <td>{{beforeRevision.nativePlace}}</td>
          <td>{{afterRevision.nativePlace}}</td>
        </tr>
        <tr v-if="afterRevision.idCard!=beforeRevision.idCard">
          <td>身份证号码</td>
          <td>{{beforeRevision.idCard}}</td>
          <td>{{afterRevision.idCard}}</td>
        </tr>
        <tr v-if="afterRevision.license!=beforeRevision.license">
          <td>营业执照</td>
          <td>
            <img class="updateImg" :src="beforeRevision.license" />
          </td>
          <td>
            <img class="updateImg" :src="afterRevision.license" />
          </td>
        </tr>
        <tr v-if="afterRevision.backOfIdCard!=beforeRevision.backOfIdCard || afterRevision.frontOfIdCard !=beforeRevision.frontOfIdCard">
          <td>身份证照片</td>
          <td>
            <img class="updateImg" :src="beforeRevision.backOfIdCard" />
            <img class="updateImg" :src="beforeRevision.frontOfIdCard" />
          </td>
          <td>
            <img class="updateImg" :src="afterRevision.backOfIdCard" />
            <img class="updateImg" :src="afterRevision.frontOfIdCard" />
          </td>
        </tr>
        <tr v-if="afterRevision.tradeName!=beforeRevision.tradeName">
          <td>职位</td>
          <td>{{beforeRevision.tradeName}}</td>
          <td>{{afterRevision.tradeName}}</td>
        </tr>

        <tr v-if="afterRevision.companyIntroduction!=beforeRevision.companyIntroduction">
          <td>企业简介</td>
          <td>{{beforeRevision.companyIntroduction}}</td>
          <td>{{afterRevision.companyIntroduction}}</td>
        </tr>

        <tr v-if="afterRevision.resume!=beforeRevision.resume">
          <td>个人简介</td>
          <td>{{beforeRevision.resume}}</td>
          <td>{{afterRevision.resume}}</td>
        </tr>
        <tr v-if="afterRevision.companyAddress!=beforeRevision.companyAddress">
          <td>办公地址</td>
          <td>{{beforeRevision.companyAddress}}</td>
          <td>{{afterRevision.companyAddress}}</td>
        </tr>

      </table>
      <span slot="footer" class="dialog-footer">
        <span v-if="afterRevision.auditStatus===0">
          <el-button type="primary" @click="approved()">通过</el-button>
          <el-button @click="rejectRemark()">驳回</el-button>
        </span>
        <el-button @click.native="detailVisible = false">关闭</el-button>
      </span>
      <div v-if="afterRevision.auditStatus!=0" class="audit-result-view" style="font-size: 15px;">
        <el-row>
          <el-col :offset="2" :span="6">
            审核结果：
            <span v-if="afterRevision.auditStatus===1">通过</span>
            <span v-else-if="afterRevision.auditStatus===2">已驳回</span>
          </el-col>
          <el-col :span="8" v-if="afterRevision.auditStatus===2">
            驳回理由：{{afterRevision.rejectRemark}}
          </el-col>
          <el-col :span="4">
            审核人：{{afterRevision.auditor}}
          </el-col>
        </el-row>
        <el-row>
          <el-col :offset="2" :span="8">审核时间：{{afterRevision.auditedTs}}</el-col>
          <el-col :span="8">提交时间：{{afterRevision.createdTs}}</el-col>
        </el-row>
      </div>
      <!-- <el-form ref="form" label-position="right" label-width="150px">
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
          <hr />
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
      </span> -->
    </el-dialog>
  </div>
</template>

<script>
  export default {
    props: ["title"],
    data() {
      return {
        //状态
        reject: null,
        reslove: null,
        detailVisible: false,
        //修改后对象
        afterRevision: {},
        //修改前对象
        beforeRevision: {},
        detailObj: {
          auditStatus: 1,
        },
      };
    },
    methods: {
      //打开
      open(item) {
        const self = this;
        return new Promise((reslove, reject) => {
          this.reslove = reslove;
          this.reject = reject;
          let afterRevision = self.handleNullFunc(item.dtl);
          this.afterRevision = afterRevision;
          let beforeRevision = self.handleNullFunc(item.member);
          this.beforeRevision = beforeRevision;
          // this.item = item;
          this.show();
        });
      },
      //工具类函数  给对象的null置为空串
      handleNullFunc(obj) {
        for (var i in obj) {
          if (obj[i] === null) {
            obj[i] = "";
          }
        }
        return obj;
      },
      //展示
      show() {
        this.detailVisible = true;
      },
      //关闭
      close() {
        this.detailVisible = false;
        this.reject = null;
        this.reslove = null;
      },
      //通过
      approved() {
        this.$emit("monitorPassFunc");
      },
      //驳回
      rejectRemark() {
        this.$emit("monitorRefusal");
      },
    },
  };
</script>
<style lang="scss" scoped>
  .audit-result-view {
  }
  table {
    th,
    td {
      height: 45px;
      line-height: 45px;
      border: 1px solid #ccc;
      text-align: center;
    }
    th {
      background: #ccc;
    }
    width: 90%;
    margin: 10px auto;
    border-collapse: collapse; /*合并内外边距*/
  }

  /deep/.el-dialog__header {
    border-bottom: 1px solid #e6e6e6;
    margin: 0 30px;
    padding: 20px 0 !important;
  }
  .header-title {
    .title-name {
      color: #4d82f3;
      font-size: 16px;
      font-weight: 600;
      line-height: 20px;
    }
  }
  .updateImg {
    width: 50px;
    height: 50px;
  }
</style>