<template>
  <div class="app-container">
    <el-form ref="form" :model="formObj" :rules="rules" label-position="right" label-width="100px">
      <el-row>
        <el-col :span="24">
          <el-form-item label="文章标题：" prop="title">
            <el-input v-model="formObj.title" maxlength="60" placeholder="限输入5-60个字的标题"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <div>
          <el-col :span="8">
            <el-form-item label="对应栏目：" prop="contentColumnId">
              <el-select v-model="formObj.contentColumnId" placeholder="请选择对应栏目" style="display: inline-block">
                <el-option v-for="cc in contentColumnOptions" :label="cc.label" :value="cc.value" :key="cc.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </div>
        <el-button @click="addColumnFunc" type="primary" style="margin-left:10px">添加栏目</el-button>
      </el-row>
      <el-row>
        <el-col :span="18">
          <el-form-item label="文章内容：" class="ue-wrap">
            <!-- <Ckeditor ref="ckeditor1" @getHtml="getHtml"></Ckeditor> -->
            <UEditor ref="ueditor" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <preview-ph :title="formObj.title" :htmlObj="formObj.contentHtml"></preview-ph>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18">
          <el-form-item label="封面管理：">
            <el-radio-group v-model="formObj.coverType" @change="resetCoverImgs(formObj.coverType)">
              <el-radio :label="0">自动（使用文章图片，无图片不显示）</el-radio>
              <el-radio :label="1">自定义（单图）</el-radio>
              <el-radio :label="2">自定义（3图）</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- <el-row v-if="formObj.coverType == 1 || formObj.coverType == 2">
        <el-form-item label="封面图片：" prop="license">
          <el-col :span="5" v-for="(img, index) in coverImgs" :key="index">
            <el-upload
              class="avatar-uploader"
              action="/"
              :show-file-list="false"
              :before-upload="function (file) { return beforeAvatarUpload(file, index) }"
              :http-request="upload">
              <img v-if="img" :src="img" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-col>
        </el-form-item>
      </el-row> -->
      <el-row v-if="formObj.coverType == 1">
        <el-col :span="18">
          <el-form-item label="封面图片：" prop="coverImgs[0]" :rules="rules.coverImg1">
            <el-upload class="avatar-uploader" action="/" :show-file-list="false" :before-upload="function (file) { return beforeAvatarUpload(file, 0) }" :http-request="upload">
              <img v-if="formObj.coverImgs[0]" :src="formObj.coverImgs[0]" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="formObj.coverType == 2">
        <el-col :span="5">
          <el-form-item label="封面图片：" prop="coverImgs[0]" :rules="rules.coverImg1">
            <el-upload class="avatar-uploader" action="/" :show-file-list="false" :before-upload="function (file) { return beforeAvatarUpload(file, 0) }" :http-request="upload">
              <img v-if="formObj.coverImgs[0]" :src="formObj.coverImgs[0]" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="" prop="coverImgs[1]" :rules="rules.coverImg2">
            <el-upload class="avatar-uploader" action="/" :show-file-list="false" :before-upload="function (file) { return beforeAvatarUpload(file, 1) }" :http-request="upload">
              <img v-if="formObj.coverImgs[1]" :src="formObj.coverImgs[1]" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="" prop="coverImgs[2]" :rules="rules.coverImg3">
            <el-upload class="avatar-uploader" action="/" :show-file-list="false" :before-upload="function (file) { return beforeAvatarUpload(file, 2) }" :http-request="upload">
              <img v-if="formObj.coverImgs[2]" :src="formObj.coverImgs[2]" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="发布时间：">
            <el-radio-group v-model="formObj.status">
              <el-radio :label="1">立即发布</el-radio>
              <el-radio :label="4">定时发布</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="formObj.status == 4">
          <el-form-item label="" prop="publishTs" label-width="0">
            <el-date-picker format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" v-model="formObj.publishTs" type="datetime" placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- <el-row>
        <el-col :span="18">
          <el-form-item label="是否置顶：">
            <el-radio-group v-model="formObj.istop">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row> -->
      <el-form-item>
        <el-col :span="8">
          <el-button type="primary" v-dbClick @click="save">确定</el-button>
          <el-button @click="closeTab">取消</el-button>
        </el-col>
      </el-form-item>
    </el-form>
    <addColumn ref="addColumnRef"></addColumn>
  </div>

</template>

<script src="./editor.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import 'src/styles/common.scss';
</style>
<style lang="scss">
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
.ue-wrap {
  .el-form-item__content {
    line-height: 1;
  }
}
</style>
