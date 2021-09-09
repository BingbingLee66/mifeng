<template>
  <div class="app-container">
    <div style="font-size: 24px;font-weight: 700;margin-bottom: 40px;">创建新活动</div>
    <div class="create-container">
      <el-form ref="form" :model="formObj" :rules="rules" label-position="right" label-width="120px">
        <el-row>
          <el-col style="width: 600px;">
            <el-form-item label="活动名称：" prop="name">
              <el-input v-model="formObj.name" show-word-limit maxlength="30" placeholder="限30字内"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col style="width: 600px;height: 160px">
            <el-form-item label="活动头像：" prop="pic" class="upload-style">
              <el-upload
                class="uploader-pic-wrap"
                action="/"
                :show-file-list="false"
                :before-upload="beforeUpload"
                :http-request="uploadPic"
              >
                <img v-if="formObj.pic" :src="formObj.pic" class="pic">
                <i v-else class="el-icon-plus uploader-pic-icon"></i>
              </el-upload>
              <div style="color: #999">建议尺寸 744*300，支持jpg、png</div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col style="width: 600px;">
            <el-form-item label="活动列表图：" prop="lpic" class="upload-style">
              <el-upload
                class="uploader-lpic-wrap"
                action="/"
                :show-file-list="false"
                :before-upload="beforeUpload"
                :http-request="uploadLpic"
              >
                <img v-if="formObj.lpic" :src="formObj.lpic" class="lpic">
                <i v-else class="el-icon-plus uploader-lpic-icon"></i>
              </el-upload>
              <div style="color: #999">建议尺寸 744*300，支持jpg、png</div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col style="width: 600px;padding-left: 100px;">
            <el-button type="primary" v-dbClick @click="save">保存</el-button>
            <!-- <el-button @click="closeTab">取消</el-button> -->
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script src="./create.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/common.scss";
</style>

<style lang="scss">
.create-container {
  .upload-style {
    .el-form-item__label {
      line-height: 1;
    }
  }

  .uploader-pic-wrap {
    height: 120px;
    width: 300px;
  }

  .uploader-pic-wrap .el-upload {
    width: 298px;
    height: 120px;
    border: 1px dashed #d9d9d9;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .uploader-pic-wrap .el-upload:hover {
    border-color: #409eff;
  }

  .uploader-pic-icon {
    font-size: 28px;
    color: #8c939d;
    width: 298px;
    height: 120px;
    line-height: 120px;
    text-align: center;
  }

  .pic {
    width: 298px;
    height: 120px;
    display: block;
  }

  .uploader-lpic-wrap {
    width: 117px;
    height: 80px;
  }

  .uploader-lpic-wrap .el-upload {
    width: 117px;
    height: 80px;
    border: 1px dashed #d9d9d9;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .uploader-lpic-wrap .el-upload:hover {
    border-color: #409eff;
  }

  .uploader-lpic-icon {
    font-size: 28px;
    color: #8c939d;
    width: 117px;
    height: 80px;
    line-height: 80px;
    text-align: center;
  }

  .lpic {
    width: 117px;
    height: 80px;
    display: block;
  }
}
</style>

