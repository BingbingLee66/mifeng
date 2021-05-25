<template>
  <div class="app-container">
    <div class="block">
      <el-row>
        <span class="row-title">账号信息</span>
      </el-row>
      <el-row>
        <el-col :span="1" class="wx-col col-title">ID</el-col>
        <el-col :span="2" class="wx-col">{{memberDetail.id ? memberDetail.id : '空'}}</el-col>
        <el-col :span="2" class="wx-col col-title">微信</el-col>
        <el-col :span="3" class="wx-col">{{memberDetail.uname ? memberDetail.uname : '未绑定'}}</el-col>
        <el-col :span="2" class="wx-col col-title">手机号</el-col>
        <el-col :span="3" class="wx-col">{{memberDetail.phone ? memberDetail.phone : '空'}}</el-col>
        <el-col :span="2" class="wx-col col-title">注册时间</el-col>
        <el-col :span="4" class="wx-col">{{memberDetail.joinedTs ? memberDetail.joinedTs : '空'}}</el-col>
        <el-col :span="2" class="wx-col col-title">注册方式</el-col>
        <el-col :span="3" class="wx-col">
          <span v-if="memberDetail.registerType == 0">商会后台</span>
          <span v-if="memberDetail.registerType == 1">微信小程序</span>
          <!-- <span v-if="memberDetail.registerType == 2">凯迪网</span> -->
          <span v-if="memberDetail.registerType != 0 && memberDetail.registerType != 1 && memberDetail.registerType != 2">空</span>
        </el-col>
      </el-row>
    </div>
    <div style="margin-top: 20px;" class="table_style">
      <el-row>
        <span class="row-title">入会信息</span>
        <el-button v-if="type == 0" @click="goEdit">修改</el-button>
      </el-row>
      <table width="100%" align="center" cellspacing="0">
        <tr align="center" height="45">
          <td width="100%" colspan="5">
            <div style="font-size: 18px; font-weight: 800;">{{member.chamberName}}</div>
          </td>
        </tr>
        <tr align="left" height="45">
          <td width="100%" colspan="5">
            <div style="margin-left: 15px; font-size: 18px; font-weight: 800;">个人信息</div>
          </td>
        </tr>
        <tr align="center" height="45">
          <td width="24%" rowspan="6">
            <div class="head-portrait"><img :src="member.portrait" /></div>
          </td>
          <td width="8%">姓名</td>
          <td width="30%">{{member.name}}</td>
          <td width="8%">入会时间</td>
          <td width="30%">{{member.joinedTs}}</td>
        </tr>
        <tr align="center" height="45">
          <td width="8%">性别</td>
          <td width="30%">
            <div v-if="member.gender == 1">男</div>
            <div v-if="member.gender == 2">女</div>
          </td>
          <td width="8%">会内职位</td>
          <td width="30%">{{member.postName}}</td>
        </tr>
        <tr align="center" height="45">
          <td width="8%">籍贯</td>
          <td width="30%">{{member.nativePlace}}</td>
          <td width="8%">身份证号码</td>
          <td width="30%">{{member.idCard}}</td>
        </tr>
        <tr align="center" height="45">
          <td width="8%">生日</td>
          <td width="30%">{{member.birthday}}</td>
          <td width="8%">身份证照</td>
          <td width="30%"><el-button type="text" @click="idCardDetail(member)">详情</el-button></td>
        </tr>
        <tr align="center" height="45">
          <td width="8%">手机号码</td>
          <td colspan="1">{{member.phone}}</td>
          <td colspan="2"></td>
        </tr>
        <tr align="center" height="45">
          <td width="8%">个人简历</td>
          <td align="left" height="150" colspan="10">{{resumeCp(member.resume)}} <el-button type="text" @click="resumeDetail(member.resume)">详情</el-button></td>
        </tr>
        <tr align="left" height="45">
          <td width="100%" colspan="5">
            <div style="margin-left: 15px; font-size: 18px; font-weight: 800;">公司信息</div>
          </td>
        </tr>
        <tr align="center" height="45">
          <td width="24%" rowspan="4">
            <div class="head-portrait"><img :src="member.companyLogo" v-if="member.companyLogo != ''" /></div>
          </td>
          <td width="8%">企业名称</td>
          <td width="30%">{{member.companyName}}</td>
          <td width="8%">企业职位</td>
          <td width="30%">{{member.companyPosition}}</td>
        </tr>
        <tr align="center" height="45">
          <td width="8%">行业</td>
          <td width="30%">{{member.tradeName}}</td>
          <td width="8%">联系方式</td>
          <td width="30%">{{member.companyPhone}}</td>
        </tr>
        <tr align="center" height="45">
          <td width="8%">办公地址</td>
          <td width="30%">{{member.companyAddress}}</td>
          <td width="8%">营业执照</td>
          <td width="30%"><el-button type="text" @click="licenseDetail(member)">详情</el-button></td>
        </tr>
        <tr align="center" height="45">
          <td width="8%">企业简介</td>
          <td align="left" height="150" colspan="10">{{companyInstrodCp(member.companyIntroduction)}} <el-button type="text" @click="companyIntroductionDetail(member.companyIntroduction)">详情</el-button></td>
        </tr>
      </table>
      <div v-if="type == 2" style="font-size: 20px;">
        <el-row>
        </el-row>
        <el-row v-if="member.auditStatus != 0">
          <el-col :span="8">
            审核结果：
            <span v-if="member.auditStatus == 1">通过</span>
            <span v-if="member.auditStatus == 2">已驳回</span>
          </el-col>
          <el-col v-if="member.auditStatus == 2" :span="8">
            驳回理由：{{member.rejectRemark}}
          </el-col>
          <el-col :span="8">
            审核人：{{member.auditor}}
          </el-col>
        </el-row>
        <el-row v-if="member.auditStatus != 0">
          <el-col :span="8">审核时间：{{member.auditedTs}}</el-col>
          <el-col :span="8">提交时间：{{member.createdTs}}</el-col>
        </el-row>
      </div>
      <div class="d-btn-box" v-if="(type == 1 || type == 2) && member.auditStatus == 0">
        <el-col :offset="10" :span="8">
          <el-button type="primary" @click="approved(member)">通过</el-button>
          <el-button @click="rejectRemark(member)">驳回</el-button>
        </el-col>
      </div>
    </div>
    <el-dialog
      title="身份证照"
      :visible.sync="idCardVisible"
      width="50%">
      <el-row>身份证头像面</el-row>
      <el-row><img class="idcard-prv" :src="idCardImage.frontOfIdCard"/></el-row>
      <el-row>身份证国徽面</el-row>
      <el-row><img class="idcard-prv" :src="idCardImage.backOfIdCard"/></el-row>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click.native="idCardVisible = false">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="营业执照"
      :visible.sync="licenseVisible"
      width="50%">
      <el-row><img class="idcard-prv" :src="licenseImage"/></el-row>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click.native="licenseVisible = false">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="个人履历"
      :visible.sync="resumeVisible"
      width="50%">
      <el-row><div class="text-detail">{{resume}}</div></el-row>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click.native="resumeVisible = false">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="公司介绍"
      :visible.sync="companyIntroductionVisible"
      width="50%">
      <el-row><div class="text-detail">{{companyIntroduction}}</div></el-row>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click.native="companyIntroductionVisible = false">确定</el-button>
      </span>
    </el-dialog>
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
  </div>
</template>

<script src="./detail.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/common.scss";
</style>
<style lang="scss">
  .wx-col {
    border: 1px solid #DCDFE6;
    border-right: 0;
    border-radius: 0 !important;
    line-height: 40px;
    text-align: center;
  }
  .wx-col:last-child {
    border: 1px solid #DCDFE6;
  }
  .col-title {
    background-color: #b7f0ff;
  }
  .row-title {
    font-size: 20px;
    font-weight: 800;
  }
  .head-portrait {
    position: relative;
    width: 80%;
    height: 0;
    margin: 0 auto;
    padding-top: 80%;
    border: 1px solid black;
    border-radius: 50%;
  }
  .head-portrait>img {
    position: absolute;
    height: 100%;
    width: 100%;
    border-radius: 50%;
    top: 0;
    left: 0;
  }
  .text-detail {
    margin: 0 5%;
    line-height: 1.8;
    font-size: 15px;
  }
  .idcard-prv {
    border: solid 1px #ccc;
    border-radius: 10px;
    width: 90%;
    height: auto;
  }
  .d-btn-box {
    margin: 20px 0 40px 0;
    height: 10px;
  }
  .table_style{
    table{
      border-top: 1px solid #DCDFE6;
      border-right: 1px solid #DCDFE6;
      border-spacing: 0px;
      tr{
        td{
          border-bottom: 1px solid #DCDFE6;
          border-left: 1px solid #DCDFE6;
        }
      }
    }
  }
</style>
