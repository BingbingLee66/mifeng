<template>
  <div class="app-container">
    <div class="block form-border">
      <div class="form-container">
        <el-form ref="form" :model="formObj" :rules="rules" label-position="left">
          <div class="title_block">入会信息</div>
          <el-row>
            <el-col :span="10">
              <el-form-item label="入会类型：">
                <el-radio-group v-model="formObj.type">
                  <el-radio :label="1">企业入会</el-radio>
                  <el-radio :label="0">个人入会</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <div v-if="formObj.type === 1">
            <el-row>
              <el-col :span="7">
                <el-form-item label="企业名称：" prop="companyName">
                  <el-input v-model.trim="formObj.companyName" maxLength="200"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="7">
                <el-form-item label="企业logo：" prop="companyLogo">
                  <el-upload
                    class="avatar-uploader"
                    action="/"
                    :show-file-list="false"
                    :before-upload="beforeAvatarUpload"
                    :http-request="uploadLogo">
                    <img
                      v-if="formObj.companyLogo"
                      :src="formObj.companyLogo"
                      style="height: 100px; width: 100px;"
                      class="avatar avatar-tips">
                    <i v-else class="el-icon-plus avatar-uploader-icon" style="height: 100px; width: 100px;">
                    </i>
                    <div v-if="!formObj.companyLogo" class="uploader-tips">上传LOGO</div>
                  </el-upload>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="7">
                <el-form-item label="联系方式：" prop="companyPhone">
                  <el-input v-model="formObj.companyPhone"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <div v-else>
            <el-row>
              <el-col :span="7">
                <el-form-item label="姓名：" prop="name" class="form_content">
                  <el-input v-model.trim="formObj.name" maxLength="100"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="7">
                <el-form-item label="手机号：" prop="phone">
                  <el-input v-model="formObj.phone" :readonly=true></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <div class="title_block">其他信息</div>
          <el-row v-if="formObj.type === 1">
            <el-col :span="7">
              <el-form-item label="姓名：" prop="name">
                <el-input v-model.trim="formObj.name" maxLength="100"></el-input>
              </el-form-item>
            </el-col>
            <el-col :offset="1" :span="7">
              <el-form-item label="手机号：" prop="phone">
                <el-input v-model="formObj.phone" :readonly=true></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="7">
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
            <el-col :offset="1" :span="7">
              <el-form-item label="性别：" prop="gender">
                <el-select v-model="formObj.gender" placeholder="请选择性别类型">
                  <el-option label="男" :value="1"></el-option>
                  <el-option label="女" :value="2"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="7">
              <el-form-item label="籍贯：" prop="nativeCas">
                <el-cascader
                  ref="cascaderAddr"
                  :options="nativeOptions"
                  v-model="formObj.nativeCas"
                  @change="handleItemChange">
                </el-cascader>
              </el-form-item>
            </el-col>
            <el-col :offset="1" :span="7">
              <el-form-item label="身份证号：" prop="idCard">
                <el-input v-model="formObj.idCard" maxLength="18"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="5">
              <el-form-item label="身份证照片：" prop="frontOfIdCard">
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
            <el-col :span="5">
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
            <el-col :span="15">
              <el-form-item label="个人简介：" prop="resume" class="flex_style">
                <el-input type="textarea" :rows="8" v-model="formObj.resume" maxLength="1000"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="7" v-if="formObj.type === 0">
              <el-form-item label="企业名称：" prop="companyName">
                <el-input v-model.trim="formObj.companyName" maxLength="200"></el-input>
              </el-form-item>
            </el-col>
            <el-col :offset="1" :span="7" v-if="formObj.type === 0">
              <el-form-item label="企业logo：" prop="companyLogo">
                <el-upload
                  class="avatar-uploader"
                  action="/"
                  :show-file-list="false"
                  :before-upload="beforeAvatarUpload"
                  :http-request="uploadLogo"
                >
                  <img
                    v-if="formObj.companyLogo"
                    :src="formObj.companyLogo"
                    style="height: 100px; width: 100px;"
                    class="avatar avatar-tips">
                  <i v-else class="el-icon-plus avatar-uploader-icon" style="height: 100px; width: 100px;">
                  </i>
                  <div v-if="!formObj.companyLogo" class="uploader-tips">上传LOGO</div>
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="7">
              <el-form-item label="行业：" prop="tradeCas">
                <el-cascader
                  :show-all-levels="false"
                  :options="tradeOptions"
                  v-model="bindTradeIds"
                  placeholder="请选择行业类型"
                  :props="{ multiple: true, checkStrictly: false }"
                  @change="handlerChange">
                </el-cascader>
              </el-form-item>
            </el-col>
            <el-col :offset="1" :span="7">
              <el-form-item label="会内职位：" prop="memberPostId">
                <el-select v-model="formObj.memberPostId" placeholder="请选择会内职位">
                  <el-option
                    v-for="post in memberPostOptions"
                    :label="post.label"
                    :value="post.value"
                    :key="post.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="7">
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
            <el-col :offset="1" :span="7" v-if="formObj.type === 0">
              <el-form-item label="联系方式：" prop="companyPhone">
                <el-input v-model="formObj.companyPhone"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="7">
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
            <el-col :offset="1" :span="7">
              <el-form-item label="企业职位：" prop="companyPositionId">
                <el-select v-model="formObj.companyPositionId" placeholder="请选择企业职位">
                  <el-option
                    v-for="position in positionOptions"
                    :label="position.label"
                    :value="position.value"
                    :key="position.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="15">
              <el-form-item label="办公地址：" prop="companyAddress" class="adress_style">
                <el-input v-model.trim="formObj.companyAddress" maxLength="200"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="15">
              <el-form-item label="企业简介：" prop="companyIntroduction">
                <el-input type="textarea" :rows="8" v-model="formObj.companyIntroduction" maxLength="1000"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
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

.title_block {
  font-size: 18px;
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif;
  display: flex;
  align-items: center;
  margin-top: 40px;
  margin-bottom: 20px;
  font-weight: 700;

  &::before {
    content: '';
    display: block;
    width: 3px;
    background: #409EFF;
    height: 20px;
    margin-right: 5px;
  }
}
</style>
<style lang="scss">
.form-border {
  margin: 20px 50px;
  border: 1px solid #bfc5d0;
}

.form-container {
  padding: 0 0 100px 100px;
  width: 100%;

  .el-form--label-left .el-form-item__label {
    text-align: left;
    width: 100px;
  }

  .el-select, .el-input, .el-cascader {
    width: 100% !important;
  }
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
