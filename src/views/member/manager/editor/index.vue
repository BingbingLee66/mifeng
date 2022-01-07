<template>
  <div class="app-container">
    <div class="block form-border">
      <div class="edit_form_container">
        <el-form ref="form" :model="formObj" :rules="rules" label-position="left" label-width="110px">
          <div class="title_block">入会信息</div>
          <el-row>
            <el-col :span="10">
              <el-form-item label="入会类型：">
                <el-radio-group v-model="formObj.type">
                  <el-radio :label="1">企业/团体入会</el-radio>
                  <el-radio :label="0">个人入会</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <div v-if="formObj.type === 1">
            <el-row>
              <el-col :span="7">
                <el-form-item label="企业名称：" prop="companyName">
                  <el-input v-model.trim="formObj.companyName" max-length="200" />
                </el-form-item>
              </el-col>
            </el-row>
            <!-- <el-row>
              <el-col :span="7"> -->
            <!-- <el-form-item label="企业/团体logo：" label-width="150px" prop="companyLogo">
                  <el-upload
                    class="avatar_uploader"
                    action="/"
                    :show-file-list="false"
                    :before-upload="beforeAvatarUpload"
                    :http-request="uploadLogo"
                  >
                    <img
                      v-if="formObj.companyLogo"
                      :src="formObj.companyLogo"
                      style="height: 100px; width: 100px;border-radius:50%;"
                      class="avatar avatar-tips"
                    >
                    <i v-else class="el-icon-plus avatar-uploader-icon" style="height: 100px; width: 100px;border-radius:50%;">
                    </i>
                      <div v-if="!formObj.companyLogo" class="uploader_tips">上传LOGO</div>
                  </el-upload>
                </el-form-item> -->
            <!-- </el-col>
            </el-row> -->
            <el-row>
              <el-col :span="7">
                <el-form-item label="联系人姓名：" prop="contactName">
                  <el-input v-model="formObj.contactName" max-length="20" placeholder="请填写真实姓名" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row style="margin-bottom:15px">
              <el-col :span="7">
                <el-form-item label="联系人电话：" prop="contactPhone">
                  <el-input v-model="formObj.contactPhone" />
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <div v-else>
            <el-row>
              <el-col :span="7">
                <el-form-item label="会员姓名：" prop="name">
                  <el-input v-model.trim="formObj.name" max-length="100" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row style="margin-bottom:15px">
              <el-col :span="7">
                <el-form-item label="会员手机号：" prop="phone">
                  <el-input v-model="formObj.phone" />
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <el-row>
            <el-col :span="7">
              <el-form-item label="会内职位：" prop="memberPostId">
                <el-select v-model="formObj.memberPostId" placeholder="请选择会内职位">
                  <el-option
                    v-for="post in memberPostOptions"
                    :key="post.value"
                    :label="post.label"
                    :value="post.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="7">
              <el-form-item label="所在部门：">
                <el-cascader
                  v-model="departmentCas"
                  clearable
                  :show-all-levels="false"
                  :options="departmentOptions"
                  :props="{
                    expandTrigger:'click',
                    emitPath:false,
                    multiple: true,
                    checkStrictly: true ,
                    value:'id',
                    label:'departmentName',
                    children:'departmentRespList',
                    disable:'disabled'
                  }"
                  placeholder="请选择部门"
                  @change="handlerDepartmentChange"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <div class="title_block">其他信息</div>
          <!-- <el-row v-if="formObj.type === 1">
            <el-col :span="7">
              <el-form-item label="姓名：" prop="name">
                <el-input v-model.trim="formObj.name" max-length="100" />
              </el-form-item>
            </el-col>
            <el-col :span="7" :offset="1">
              <el-form-item label="手机号：" prop="phone">
                <el-input v-model="formObj.phone" :readonly="true" />
              </el-form-item>
            </el-col>
          </el-row> -->
          <!-- <el-row>
            <el-col :span="7">
              <el-form-item label="生日：" prop="birthday">
                <el-date-picker
                  v-model="formObj.birthday"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  type="date"
                  placeholder="选择日期"
                />
              </el-form-item>
            </el-col>
            <el-col :offset="1" :span="7">
              <el-form-item label="性别：" prop="gender">
                <el-select v-model="formObj.gender" placeholder="请选择性别类型">
                  <el-option label="男" :value="1" />
                  <el-option label="女" :value="2" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row> -->
          <!-- <el-row>
            <el-col :span="7">
              <el-form-item label="籍贯：" prop="nativeCas">
                <el-cascader
                  ref="cascaderAddr"
                  v-model="formObj.nativeCas"
                  :options="nativeOptions"
                  @change="handleItemChange"
                />
              </el-form-item>
            </el-col>
            <el-col :offset="1" :span="7">
              <el-form-item label="身份证号：" prop="idCard">
                <el-input v-model="formObj.idCard" max-length="18" />
              </el-form-item>
            </el-col>
          </el-row> -->
          <!-- <el-row>
            <div
              style="text-align: left;font-weight: 700;vertical-align: middle;font-size: 14px;color: #606266;line-height: 40px;padding: 0 12px 0 0;-webkit-box-sizing: border-box;box-sizing: border-box;"
            >
              身份证照片：
            </div>
            <el-col :span="3">
              <el-form-item label="" prop="frontOfIdCard">
                <el-upload
                  class="avatar-uploader"
                  action="/"
                  :show-file-list="false"
                  :before-upload="beforeAvatarUpload"
                  :http-request="uploadFrontOfIdCard"
                >
                  <img v-if="formObj.frontOfIdCard" :src="formObj.frontOfIdCard" class="avatar avatar-tips">
                  <i v-else class="el-icon-plus avatar-uploader-icon" />
                  <div v-if="!formObj.frontOfIdCard" class="uploader-tips">上传身份证头像面</div>
                </el-upload>
              </el-form-item>
            </el-col>
            <el-col :offset="1" :span="5">
              <el-form-item label="" prop="backOfIdCard">
                <el-upload
                  class="avatar-uploader"
                  action="/"
                  :show-file-list="false"
                  :before-upload="beforeAvatarUpload"
                  :http-request="uploadBackOfIdCard"
                >
                  <img v-if="formObj.backOfIdCard" :src="formObj.backOfIdCard" class="avatar avatar-tips">
                  <i v-else class="el-icon-plus avatar-uploader-icon" />
                  <div v-if="!formObj.backOfIdCard" class="uploader-tips">上传身份证国徽面</div>
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row> -->
          <!-- <el-row>
            <el-col :span="15">
              <el-form-item label="个人简介：" prop="resume" class="flex_style">
                <el-input v-model="formObj.resume" type="textarea" :rows="8" max-length="1000" />
              </el-form-item>
            </el-col>
          </el-row> -->
          <!-- <el-row>
            <el-col v-if="formObj.type === 0" :span="7">
              <el-form-item label="企业/团体名称：" label-width="130px" prop="companyName">
                <el-input v-model.trim="formObj.companyName" max-length="200" />
              </el-form-item>
            </el-col>
            <el-col v-if="formObj.type === 0" :offset="1" :span="7">
              <el-form-item label="企业/团体logo：" label-width="150px" prop="companyLogo">
                <el-upload
                  class="avatar_uploader"
                  action="/"
                  :show-file-list="false"
                  :before-upload="beforeAvatarUpload"
                  :http-request="uploadLogo"
                >
                  <img
                    v-if="formObj.companyLogo"
                    :src="formObj.companyLogo"
                    style="height: 100px; width: 100px;border-radius:50%;"
                    class="avatar avatar-tips"
                  >
                  <i v-else class="el-icon-plus avatar-uploader-icon" style="height: 100px; width: 100px;border-radius:50%;" />
                  <div v-if="!formObj.companyLogo" class="uploader_tips">上传LOGO</div>
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row> -->
          <!-- <el-row>
            <el-col :span="7">
              <el-form-item label="行业：" prop="tradeCas">
                <el-cascader
                  v-model="bindTradeIds"
                  :show-all-levels="false"
                  :options="tradeOptions"
                  placeholder="请选择行业类型"
                  :props="{ multiple: true, checkStrictly: false }"
                  @change="handlerChange"
                />
              </el-form-item>
            </el-col>
          </el-row> -->
          <el-row>
            <el-col :span="7">
              <el-form-item label="入会时间：" prop="joinedTs">
                <el-date-picker
                  v-model="formObj.joinedTs"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  type="date"
                  placeholder="选择日期"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <div v-if="formObj.type === 1">
            <el-row>
              <el-row>
                <el-col :span="7">
                  <el-form-item label="营业执照：" prop="license">
                    <el-upload
                      class="avatar-uploader"
                      action="/"
                      :show-file-list="false"
                      :before-upload="beforeAvatarUpload"
                      :http-request="uploadLicense"
                    >
                      <img v-if="formObj.license" :src="formObj.license" class="avatar avatar-tips">
                      <i v-else class="el-icon-plus avatar-uploader-icon" />
                      <div v-if="!formObj.license" class="uploader-tips">上传公司营业执照</div>
                    </el-upload>
                  </el-form-item>
                </el-col>
                <!-- <el-col v-if="formObj.type === 0" :offset="1" :span="7">
              <el-form-item label="联系人电话：" prop="contactPhone">
                <el-input v-model="formObj.contactPhone" />
              </el-form-item>
            </el-col> -->
              </el-row>
              <el-col :span="7">
                <el-form-item label="企业职位：" prop="companyPositionId">
                  <el-select v-model="formObj.companyPositionId" placeholder="请选择企业/团体职位">
                    <el-option
                      v-for="position in positionOptions"
                      :key="position.value"
                      :label="position.label"
                      :value="position.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <!-- <el-row>
            <el-col :span="15">
              <el-form-item label="办公地址：" prop="companyAddress" class="adress_style">
                <el-input v-model.trim="formObj.companyAddress" max-length="200" />
              </el-form-item>
            </el-col>
          </el-row> -->
          <!-- <el-row>
            <el-col :span="15">
              <el-form-item label="企业简介：" prop="companyIntroduction">
                <el-input type="textarea" :rows="8" v-model="formObj.companyIntroduction" maxLength="1000"></el-input>
              </el-form-item>
            </el-col>
          </el-row> -->
              <div class="title_block">身份信息{{formObj.identityVOList.length}}</div>
              <div v-if="formObj.identityVOList.length>0">
              <el-row  v-for="(item,index) in formObj.identityVOList" :key="index">
                <el-col :span="15">
                  <el-form-item :label="item.type===1 ? '企业：': '机构：'"  class="adress_style">
                <el-input :value="item.unit" max-length="200" disabled/>
              </el-form-item>
                </el-col>
              <el-col :span="15">
                  <el-form-item label="职务：" class="adress_style">
                <el-input :value="item.post" disabled />
              </el-form-item>
              </el-col>   
              </el-row>
            <!-- </el-col> -->
            </div>
            <!-- <el-col :span="15" v-if="formObj.IdentityVO.type==1">
              <el-form-item label="企业："  class="adress_style">
                <el-input :value=" formObj.IdentityVO.unit" max-length="200" />
              </el-form-item>
            </el-col>
            <el-col :span="15">
              <el-form-item label="职务：" class="adress_style">
                <el-input :value="formObj.IdentityVO.post" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="15" v-if="formObj.IdentityVO.type==2">
              <el-form-item label="机构：" class="adress_style">
                <el-input :value="formObj.IdentityVO.unit" />
              </el-form-item>
            </el-col> -->
          <el-form-item>
            <el-button v-dbClick type="primary" @click="save">保存</el-button>
            <el-button @click="closeTab">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script src="./editor.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/common.scss";
</style>
<style lang="scss">
.form-border {
  margin: 20px 50px;
  border: 1px solid #bfc5d0;
}

.edit_form_container {
  padding: 0 0 100px 100px;
  width: 100%;

  .title_block {
    font-size: 18px;
    font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB,
    Microsoft YaHei, Arial, sans-serif;
    display: flex;
    align-items: center;
    margin-top: 40px;
    margin-bottom: 20px;
    font-weight: 700;

    &::before {
      content: "";
      display: block;
      width: 3px;
      background: #409eff;
      height: 20px;
      margin-right: 5px;
    }
  }

  .el-form--label-left .el-form-item__label {
    text-align: left;
    width: 100px;
  }

  .el-select,
  .el-input,
  .el-cascader {
    width: 100% !important;
  }

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar_uploader .el-upload{
    border: 1px dashed #d9d9d9;
    border-radius: 50%;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar_uploader .el-upload:hover {
    border-color: #409eff;
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

  .uploader_tips {
    line-height: 50px;
    margin-top: -50px;
    font-size: 12px;
    color: #8c939d;
  }
}
</style>
