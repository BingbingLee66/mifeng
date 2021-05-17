<template>
  <div class="app-container">
    <div class="block form-border">
      <div class="form-container">
        <el-form ref="form" :model="formObj" :rules="rules" label-position="left">
          <el-form-item label="入会类型：">
            <el-radio-group v-model="formObj.type">
              <el-radio :label="1">企业入会</el-radio>
              <el-radio :label="0">个人入会</el-radio>

            </el-radio-group>
          </el-form-item>
          <div v-if="formObj.type === 1">
            <el-form-item label="企业名称：" prop="companyName">
              <el-input v-model.trim="formObj.companyName" maxLength="200"></el-input>
            </el-form-item>
            <el-form-item label="企业logo：" prop="companyLogo">
              <el-upload class="avatar-uploader" action="/" :show-file-list="false" :before-upload="beforeAvatarUpload" :http-request="uploadLogo">
                <img v-if="formObj.companyLogo" :src="formObj.companyLogo" style="height: 100px; width: 100px;" class="avatar avatar-tips">
                <i v-else class="el-icon-plus avatar-uploader-icon" style="height: 100px; width: 100px;">
                </i>
                <div v-if="!formObj.companyLogo" class="uploader-tips">上传LOGO</div>
              </el-upload>
            </el-form-item>
            <el-form-item label="联系电话：" prop="companyPhone">
              <el-input v-model="formObj.companyPhone"></el-input>
            </el-form-item>
          </div>
          <div v-else>
            <el-form-item label="姓名：" prop="name">
              <el-input v-model.trim="formObj.name" maxLength="100"></el-input>
            </el-form-item>
            <el-form-item label="手机号：" prop="phone">
              <el-input v-model="formObj.phone"></el-input>
            </el-form-item>
          </div>
          <el-form-item>
            <el-button type="primary" v-dbClick @click="save">保存</el-button>
            <el-button @click="closeTab">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script src="./editor.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import 'src/styles/common.scss';
</style>
<style>
.form-border {
  margin: 20px 50px;
  border: 1px solid #bfc5d0;
}

.form-container {
  padding: 50px 0 100px 100px;
  width: 50%;
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
  border-color: #409eff;
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
