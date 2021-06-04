<template>
  <div class="app-container">
    <div class="block form-border">
      <div class="add_form_container">
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
            <el-form-item label="企业logo：" prop="companyLogo" class="avatar_style">
              <el-upload class="avatar-uploader" action="/" :show-file-list="false" :before-upload="beforeAvatarUpload" :http-request="uploadLogo">
                <img v-if="formObj.companyLogo" :src="formObj.companyLogo" class="avatar avatar-tips">
                <i v-else class="el-icon-plus avatar-uploader-icon" style="height: 100px; width: 100px;">
                </i>
              </el-upload>
              <!--              <div style="color: #999">格式:jpg/png/jpeg  尺寸:132*132px</div>-->
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
          <el-form-item label="所在部门：">
            <el-cascader clearable :show-all-levels="false" :options="departmentOptions" :props="{expandTrigger:'click',emitPath:false, multiple: true, checkStrictly: true , value:'id',label:'departmentName',children:'departmentRespList',disable:'disabled' }" v-model="departmentCas" placeholder="请选择部门" @change="handlerDepartmentChange">
            </el-cascader>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" v-dbClick @click="save">保存</el-button>
            <el-button @click="closeTab">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script src="./add.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/common.scss";
</style>
<style lang="scss">
  .form-border {
    margin: 20px 50px;
    border: 1px solid #bfc5d0;
  }

  .add_form_container {
    padding: 50px 0 100px 100px;
    width: 50%;

    .el-cascader {
      width: 100%;
    }

    .avatar_style {
      .el-form-item__label {
        float: none;
      }
    }

    .avatar-uploader .el-upload {
      width: 132px;
      height: 132px;
      border: 1px dashed #d9d9d9;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      border-radius: 50%;
    }

    .avatar-uploader .el-upload:hover {
      border-color: #409eff;
    }

    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 132px;
      height: 132px;
      line-height: 132px;
      text-align: center;
    }

    .avatar {
      width: 132px;
      height: 132px;
      display: block;
    }
  }
</style>
