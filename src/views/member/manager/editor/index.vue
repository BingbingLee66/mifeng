<template>
  <div class="app-container">
    <div class="block form-border">
      <el-form ref="form" :model="formObj" :rules="rules" label-position="right" label-width="150px">
        <el-row>
          <div class="bar-info">入会类型</div>
          <el-form-item label="">
            <el-radio-group v-model="formObj.type">
              <el-radio :label="0">个人入会</el-radio>
              <el-radio :label="1">企业入会</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-row>
        <hr size="1"/>
        <el-row><div class="bar-info">个人信息</div></el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="姓名：" prop="name">
              <el-input v-model.trim="formObj.name" maxLength="100"></el-input>
            </el-form-item>
          </el-col>
          <el-col :offset="2" :span="10">
            <el-form-item label="头像：" prop="portrait">
              <el-upload
                class="avatar-uploader"
                action="/"
                :show-file-list="false"
                :before-upload="beforeAvatarUpload"
                :http-request="uploadPortrait">
                <img v-if="formObj.portrait" :src="formObj.portrait" class="avatar"
                style="height: 100px; width: 100px;">
                <i v-else class="el-icon-plus avatar-uploader-icon"
                style="height: 100px; width: 100px;"></i>
                <div v-if="!formObj.portrait" class="uploader-tips">上传头像</div>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="籍贯：" prop="nativeCas">
              <el-cascader
                ref="cascaderAddr"
                :options="nativeOptions"
                v-model="formObj.nativeCas"
                @change="handleItemChange">
              </el-cascader>
            </el-form-item>
          </el-col>
          <el-col :offset="2" :span="10">
            <el-form-item label="生日：" prop="birthday">
              <el-date-picker
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                v-model="formObj.birthday"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="性别：" prop="gender">
              <el-select v-model="formObj.gender" placeholder="请选择性别类型">
                <el-option label="男" :value="1"></el-option>
                <el-option label="女" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :offset="2" :span="10">
            <el-form-item label="手机号：" prop="phone">
              <el-input v-model="formObj.phone"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="入会时间：" prop="joinedTs">
              <el-date-picker
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                v-model="formObj.joinedTs"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :offset="2" :span="10">
            <el-form-item label="职位：" prop="memberPostId">
              <el-select v-model="formObj.memberPostId" placeholder="请选择职业类型">
                <el-option v-for="post in memberPostOptions" :label="post.label" :value="post.value" :key="post.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="身份证号码：" prop="idCard">
              <el-input v-model="formObj.idCard" maxLength="25"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="身份证照：" prop="frontOfIdCard">
              <el-upload
                class="avatar-uploader"
                action="/"
                :show-file-list="false"
                :before-upload="beforeAvatarUpload"
                :http-request="uploadFrontOfIdCard">
                <img v-if="formObj.frontOfIdCard" :src="formObj.frontOfIdCard" class="avatar avatar-tips">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                <div v-if="!formObj.frontOfIdCard" class="uploader-tips">上传身份证头像面</div>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="" prop="backOfIdCard">
              <el-upload
                class="avatar-uploader"
                action="/"
                :show-file-list="false"
                :before-upload="beforeAvatarUpload"
                :http-request="uploadBackOfIdCard">
                <img v-if="formObj.backOfIdCard" :src="formObj.backOfIdCard" class="avatar avatar-tips">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                <div v-if="!formObj.backOfIdCard" class="uploader-tips">上传身份证国徽面</div>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item label="个人履历：" prop="resume">
              <el-input type="textarea" :rows="8" v-model="formObj.resume" maxLength="1000"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <hr size="1"/>
        <el-row><div class="bar-info">企业信息</div></el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="企业名称：" prop="companyName">
              <el-input v-model.trim="formObj.companyName" maxLength="200"></el-input>
            </el-form-item>
          </el-col>
          <el-col :offset="2" :span="10">
            <el-form-item label="LOGO" prop="companyLogo">
              <el-upload
                class="avatar-uploader"
                action="/"
                :show-file-list="false"
                :before-upload="beforeAvatarUpload"
                :http-request="uploadLogo">
                <img v-if="formObj.companyLogo" :src="formObj.companyLogo" 
                style="height: 100px; width: 100px;" class="avatar avatar-tips">
                <i v-else class="el-icon-plus avatar-uploader-icon"
                style="height: 100px; width: 100px;"></i>
                <div v-if="!formObj.companyLogo" class="uploader-tips">上传LOGO</div>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="行业：" prop="tradeCas">
              <el-cascader
                :options="tradeOptions"
                v-model="formObj.tradeCas"
                placeholder="请选择行业类型"
                @change="handlerChange">
              </el-cascader>
            </el-form-item>
          </el-col>
          <el-col :offset="2" :span="10">
            <el-form-item label="联系电话：" prop="companyPhone">
              <el-input v-model="formObj.companyPhone"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="办公地址：" prop="companyAddress">
              <el-input v-model.trim="formObj.companyAddress" maxLength="200"></el-input>
            </el-form-item>
          </el-col>
          <el-col :offset="2" :span="10">
            <el-form-item label="职务：" prop="companyPositionId">
              <el-select v-model="formObj.companyPositionId" placeholder="请选择职务类型">
                <el-option v-for="position in positionOptions" :label="position.label" :value="position.value" :key="position.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="营业执照：" prop="license">
              <el-upload
                class="avatar-uploader"
                action="/"
                :show-file-list="false"
                :before-upload="beforeAvatarUpload"
                :http-request="uploadLicense">
                <img v-if="formObj.license" :src="formObj.license" class="avatar avatar-tips">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                <div v-if="!formObj.license" class="uploader-tips">上传公司营业执照</div>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item label="公司介绍：" prop="companyIntroduction">
              <el-input type="textarea" :rows="8" v-model="formObj.companyIntroduction" maxLength="1000"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-col :offset="6" :span="8">
            <el-button type="primary" v-dbClick @click="save">保存</el-button>
            <el-button @click="closeTab">取消</el-button>
          </el-col>
        </el-form-item>
      </el-form>
    </div>
  </div>

</template>

<script src="./editor.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/common.scss";
</style>
<style>
.form-border {
  margin: 20px 50px;
  border: 1px solid #bfc5d0;
}
.bar-info {
  margin: 20px 2px;
  padding-left: 25px;
  font-size: 20px;
  font-weight: 800;
  border-left: 3px solid black;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 180px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}
.avatar {
  width: 180px;
  height: 100px;
  display: block;
}
.avatar-tips {
  height: 116px;
}
.uploader-tips {
  line-height: 50px;
  margin-top: -34px;
  font-size: 12px;
  color: #8c939d;
}
</style>
