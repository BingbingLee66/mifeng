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
        <tr>
          <td>会员姓名</td>
          <td>医疗</td>
          <td>教育</td>
        </tr>
        <tr>
          <td>企业logo</td>
          <td>http://www.baidu.com/</td>
          <td>搜索</td>
        </tr>

      </table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="approved()">通过</el-button>
        <el-button @click="rejectRemark()">驳回</el-button>
        <el-button @click.native="detailVisible = false">关闭</el-button>
      </span>
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
        detailVisible: true,
        //父级传过来的数据
        item: null,
      };
    },
    methods: {
      //打开
      open(item) {
        return new Promise((reslove, reject) => {
          this.reslove = reslove;
          this.reject = reject;
          this.item = item;
          this.show();
        });
      },
      //展示
      show() {
        this.detailVisible = true;
      },
      //关闭
      close() {
        this.detailVisible = false;
      },
      //通过
      approved() {},
      //驳回
      rejectRemark() {
        console.log("驳回啦");
        this.$emit("monitorRefusal");
      },
    },
  };
</script>
<style lang="scss" scoped>
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
</style>