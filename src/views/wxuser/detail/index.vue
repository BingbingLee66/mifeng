<template>
  <div class="app-container">
    <div class="block">
      <el-row>
        <span class="row-title">账号信息</span>
      </el-row>
      <el-row>
        <el-col :span="1" class="wx-col col-title">ID</el-col>
        <el-col :span="2" class="wx-col">{{ userDetail.id ? userDetail.id : '空' }}</el-col>
        <el-col :span="2" class="wx-col col-title">微信</el-col>
        <el-col :span="3" class="wx-col">{{ userDetail.uname ? userDetail.uname : '未绑定' }}</el-col>
        <el-col :span="2" class="wx-col col-title">手机号</el-col>
        <el-col :span="3" class="wx-col">{{ userDetail.phone ? userDetail.phone : '空' }}</el-col>
        <el-col :span="2" class="wx-col col-title">注册时间</el-col>
        <el-col :span="4" class="wx-col">{{ userDetail.createdTs ? userDetail.createdTs : '空' }}</el-col>
        <el-col :span="2" class="wx-col col-title">注册方式</el-col>
        <el-col :span="3" class="wx-col">
          <span v-if="userDetail.registerType == 0">商会后台</span>
          <span v-if="userDetail.registerType == 1">微信小程序</span>
          <!-- <span v-if="userDetail.registerType == 2">凯迪网</span> -->
          <span v-if="userDetail.registerType != 0 && userDetail.registerType != 1 && userDetail.registerType != 2">空</span>
        </el-col>
      </el-row>
    </div>
    <div>
      <el-row>
        <span class="row-title">个人信息</span>
      </el-row>
      <table border="1" width="100%" align="center" cellspacing="0">
        <tr align="center" height="45">
          <td width="24%" rowspan="6">
            <div class="head-portrait"><img :src="userInfo.uavatar"></div>
          </td>
          <td width="8%">用户名</td>
          <td width="30%">{{ userInfo.uname }}</td>
          <td width="8%">手机号码</td>
          <td width="30%">{{ userInfo.phone }}</td>
        </tr>
        <tr align="center" height="45">
          <td width="8%">性别</td>
          <td width="30%">
            <div v-if="userInfo.ugender == 1">男</div>
            <div v-if="userInfo.ugender == 2">女</div>
          </td>
          <td width="8%">生日</td>
          <td width="30%">{{ userInfo.birthday | dateFormat }}</td>
        </tr>
        <tr align="center" height="45">
          <td width="8%">籍贯</td>
          <td width="30%">{{ userInfo.nativePlace }}</td>
          <td width="8%">简介</td>
          <!-- {{ resumeCp(userInfo.introduction) }} -->
          <td align="center" height="50" colspan="10">
            <el-button type="text" @click="resumeDetail(userInfo.introduction)">详情</el-button>
          </td>
        </tr>
      </table>
    </div>
    <div style="margin-top: 20px;">
      <el-row>
        <span class="row-title">已加入商会（{{ count }}）</span>
      </el-row>
      <table v-for="(member, index) in memberList" border="1" width="100%" align="center" cellspacing="0">
        <tr align="center" height="45">
          <td width="100%" colspan="6">
            <div style="font-size: 18px; font-weight: 800;">{{ member.chamberName }}</div>
          </td>
        </tr>
        <tr align="left" height="45">
          <td width="100%" colspan="6">
            <div style="margin-left: 15px; font-size: 18px; font-weight: 800;">入会信息</div>
          </td>
        </tr>
        <tr v-if="member.type===0" align="center" height="45">
          <td width="15%">姓名</td>
          <td width="35%">{{ member.name }}</td>
          <td width="15%">手机号</td>
          <td width="35%">{{ member.phone }}</td>

        </tr>
        <tr v-else align="center" height="45">
          <td width="15%">企业名称</td>
          <td width="35%">{{ member.companyName }}</td>
          <td width="15%">联系人姓名</td>
          <td width="35%">{{ member.contactName }}</td>

        </tr>
        <tr v-if="member.type===1" align="center" height="45">
          <td width="8%">联系人电话</td>
          <td width="30%">{{ member.contactPhone }}
          </td>
          <td width="8%">会内职位</td>
          <td width="30%">{{ member.postName }}</td>
        </tr>
        <tr v-else align="center" height="45">
          <td width="8%">会内职位</td>
          <td width="30%">{{ member.postName }}</td>
          <td width="8%">所在部门</td>
          <td width="30%">
            {{ member.departmentName }}
          </td>
        </tr>
        <tr v-if="member.type===1" align="center" height="45" style="line-height: 45px">
          <td width="8%">所在部门</td>
          {{ member.departmentName }}
        </tr>
        <!-- <tr align="center" height="45">
          <td width="24%" rowspan="6">
            <div class="head-portrait"><img :src="member.portrait"></div>
          </td>
          <td width="8%">用户名</td>
          <td width="30%">{{ member.uname }}</td>
          <td width="8%">手机号码</td>
          <td width="30%">{{ member.phone }}</td>
        </tr> -->
        <!-- <tr align="center" height="45">
          <td width="8%">性别</td>
          <td width="30%">
            <div v-if="member.gender == 1">男</div>
            <div v-if="member.gender == 2">女</div>
          </td>
          <td width="8%">生日</td>
          <td width="30%">{{ member.birthday }}</td>

          <td width="8%">商会职位</td>
          <td width="30%">{{ member.postName }}</td>
        </tr> -->
        <!-- <tr align="center" height="45">
          <td width="8%">籍贯</td>
          <td width="30%">{{ member.nativePlace }}</td>
          <td width="8%">简介</td>
          <td align="left" height="50" colspan="10">{{ resumeCp(member.resume) }}
            <el-button type="text" @click="resumeDetail(member.resume)">详情</el-button>
          </td>
          <td width="8%">身份证号码</td>
          <td width="30%">{{ member.idCard }}</td>
        </tr> -->
        <!-- <tr align="center" height="45">

          <td width="8%">身份证照</td>
          <td width="30%">
            <el-button type="text" @click="idCardDetail(member)">详情</el-button>
          </td>
        </tr>
        <tr align="center" height="45">
          <td width="8%">手机号码</td>
          <td colspan="1">{{ member.phone }}</td>
          <td colspan="2" />
        </tr>
        <tr align="center" height="45">
          <td width="8%">个人履历</td>
          <td align="left" height="150" colspan="10">{{ resumeCp(member.resume) }}
            <el-button type="text" @click="resumeDetail(member.resume)">详情</el-button>
          </td>
        </tr> -->
        <tr align="left" height="45">
          <td width="100%" colspan="6">
            <div style="margin-left: 15px; font-size: 18px; font-weight: 800;">其他信息</div>
          </td>
        </tr>
        <tr align="center" height="45" width="100%">
          <td width="5%">入会时间</td>
          <td width="20%">{{ member.joinedTs }}</td>
          <td width="5%">营业执照</td>
          <td width="20%">  <el-button type="text" @click="licenseDetail(member)">详情</el-button></td>
          <!-- <td width="5%">企业职位</td>
          <td width="25%">{{ member.companyPosition }}</td> -->
        </tr>
        <tr align="center" height="45" width="100%" style="line-height: 45px">
          <td width="5%">企业职位</td>
          <!-- <td width="25%"> -->
          {{ member.companyPosition }}
          <!-- </td> -->
        </tr>
        <!-- <tr align="center" height="45">
          <td width="24%" rowspan="4">
            <div class="head-portrait"><img :src="member.companyLogo"></div>
          </td>
          <td width="8%">公司名称</td>
          <td width="30%">{{ member.companyName }}</td>
          <td width="8%">职务</td>
          <td width="30%">{{ member.companyPosition }}</td>
        </tr>
        <tr align="center" height="45">
          <template v-if="member.type===1">
            <td width="8%">联系人姓名</td>
            <td width="30%">{{ member.contactName }}</td>
          </template>
          <template v-else>
            <td width="8%">行业</td>
            <td width="30%">{{ member.tradeName }}</td>
          </template>
          <td width="8%">联系人电话</td>
          <td width="30%">{{ member.contactPhone }}</td>
        </tr>
        <tr align="center" height="45">
          <td width="8%">办公地址</td>
          <td width="30%">{{ member.companyAddress }}</td>
          <td width="8%">营业执照</td>
          <td width="30%">
            <el-button type="text" @click="licenseDetail(member)">详情</el-button>
          </td>
        </tr>
        <tr v-if="member.type===1" align="center" height="45">
          <td width="8%">行业</td>
          <td align="left" height="150" colspan="10">{{ member.tradeName }}
          </td>
        </tr> -->
      </table>
    </div>
    <el-dialog
      title="身份证照"
      :visible.sync="idCardVisible"
      width="50%"
    >
      <el-row>身份证头像面</el-row>
      <el-row><img :src="idCardImage.frontOfIdCard"></el-row>
      <el-row>身份证头像面</el-row>
      <el-row><img :src="idCardImage.backOfIdCard"></el-row>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click.native="idCardVisible = false">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="营业执照"
      :visible.sync="licenseVisible"
      width="50%"
    >
      <el-row><img :src="licenseImage"></el-row>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click.native="licenseVisible = false">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="个人履历"
      :visible.sync="resumeVisible"
      width="50%"
    >
      <el-row>
        <div class="text-detail">{{ resume }}</div>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click.native="resumeVisible = false">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="公司介绍"
      :visible.sync="companyIntroductionVisible"
      width="50%"
    >
      <el-row>
        <div class="text-detail">{{ companyIntroduction }}</div>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click.native="companyIntroductionVisible = false">确定</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script src="./detail.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/common.scss";
</style>
<style>
.wx-col {
  border: 1px solid black;
  border-right: 0;
  border-radius: 0 !important;
  line-height: 40px;
  text-align: center;
}

.wx-col:last-child {
  border: 1px solid black;
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
  width: 150px;
  height: 150px;
  margin: 20px auto;
  border-radius: 50%;
}

.head-portrait > img {
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
</style>
