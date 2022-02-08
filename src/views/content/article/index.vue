<template>
  <div class="app-container">
        <preview ref="preview"></preview>
    <kdDialog ref="kdDialog" dialogTitle="导入微信文章" @savePopupData="savePopupData" >
      <div slot="content" class="content">
        <el-input v-model="articleUrl"  placeholder="请输入微信文章链接地址" ></el-input>
        <div class="case">支持导入微信公众号文章</div>
        <div >注意：1.如需获得正式使用权，请自行联系版权所有者
          <br/> <span v-for="item in 10" :key="item">&nbsp;</span>2.多次导入内容会进行覆盖
         
        </div>
      </div>
    </kdDialog>
    <el-form   ref="form" :model="formObj" :rules="rules" label-position="right" label-width="100px">
      <el-row>
        <el-col :span="24">
<!-- 这里需要注意 注释掉会存在 文章原先就不存在标题 编辑就必须填写标题问题不然验证不通过 <el-form-item v-if="!(this.articleId && !this.formObj.title)" label="文章标题：" prop="title">-->
          <el-form-item  label="文章标题：" prop="title">
            <el-input v-model="formObj.title" maxlength="60" placeholder="限输入5-60个字的标题" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item v-if="this.formObj.publishType != 1 && this.formObj.publishType != 2" label="文章来源：" prop="sourceId">
            <el-select v-model="formObj.sourceId" placeholder="请选择文章来源">
              <el-option v-for="as in articleSourceOptions" :key="as.value" :label="as.label" :value="as.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item v-if="this.formObj.publishType != 2 && this.formObj.contentModuleId != 7" label="对应栏目：" prop="contentColumnId">
            <el-select v-model="formObj.contentColumnId" placeholder="请选择对应栏目">
              <el-option v-for="cc in contentColumnOptions" :key="cc.value" :label="cc.label === '全部' ? cc.label : optionList[cc.typeUrl - 1] + '-' + cc.label" :value="cc.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="margin-left:100px">
        
 <el-button @click="showPreview" type="primary" style="margin-left:10px">实时预览</el-button>
          <el-button @click="importArticle" type="primary" style="margin-left:10px">导入微信文章</el-button>
      </el-row>
       
      <el-row>
        <el-col :span="18">
          <el-form-item label="文章内容：">
             <editorElem :content="formObj.contentHtml" @addParentHtml="addParentHtml" ref="editorElem"></editorElem>
    
          </el-form-item>
        </el-col>
        <!-- <el-col :span="6">
          <preview-ph :title="formObj.title" :html-obj="formObj.contentHtml" />
        </el-col> -->
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
        <el-form-item label="封面图片：" prop="coverImgs">
          <el-col :span="5" v-for="(img, index) in formObj.coverImgs" :key="index">
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
            <el-upload
              class="avatar-uploader"
              action="/"
              :show-file-list="false"
              :before-upload="function (file) { return beforeAvatarUpload(file, 0) }"
              :http-request="upload"
            >
              <img v-if="formObj.coverImgs[0]" :src="formObj.coverImgs[0]" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon" />
            </el-upload>
            <div class="tips">建议尺寸：176 x 176;支持格式：jpeg、png、jpg</div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="formObj.coverType == 2" style="margin-bottom:0px">
        <el-col :span="5">
          <el-form-item label="封面图片：" prop="coverImgs[0]" :rules="rules.coverImg1">
            <el-upload
              class="avatar-uploader"
              action="/"
              :show-file-list="false"
              :before-upload="function (file) { return beforeAvatarUpload(file, 0) }"
              :http-request="upload"
            >
              <img v-if="formObj.coverImgs[0]" :src="formObj.coverImgs[0]" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon" />
            </el-upload>
           
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="" prop="coverImgs[1]" :rules="rules.coverImg2">
            <el-upload
              class="avatar-uploader"
              action="/"
              :show-file-list="false"
              :before-upload="function (file) { return beforeAvatarUpload(file, 1) }"
              :http-request="upload"
            >
              <img v-if="formObj.coverImgs[1]" :src="formObj.coverImgs[1]" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon" />
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="" prop="coverImgs[2]" :rules="rules.coverImg3">
            <el-upload
              class="avatar-uploader"
              action="/"
              :show-file-list="false"
              :before-upload="function (file) { return beforeAvatarUpload(file, 2) }"
              :http-request="upload"
            >
              <img v-if="formObj.coverImgs[2]" :src="formObj.coverImgs[2]" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon" />
            </el-upload>
             
          </el-form-item>
          
        </el-col>
       
      </el-row >
        <div style="margin:0px 0px 10px 100px" v-if="formObj.coverType == 2" class="tips">建议尺寸：220 x 220;支持格式：jpeg、png、jpg</div>
      <el-row>
        <el-col :span="8">
          <el-form-item label="发布时间：">
            <el-radio-group v-model="formObj.status">
              <el-radio :label="1">立即发布</el-radio>
              <el-radio :label="4">定时发布</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col v-if="formObj.status == 4" :span="8">
          <el-form-item label="" prop="publishTs" label-width="0">
            <el-date-picker
              v-model="formObj.publishTs"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              placeholder="选择日期时间"
            />
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
          <el-button v-dbClick type="primary" @click="save">确定</el-button>
          <el-button  @click="closeTab">取消</el-button>
        </el-col>
      </el-form-item>
    </el-form>
  </div>

</template>

<script src="./article.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/common.scss";
</style>
<style>
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
.license-box {
  width: 180px;
  height: 100px;
  border-color: #409EFF;
}
.license-box img {
  width: 100%;
  height: 100%;
}
.content{
font-family: '微软雅黑', sans-serif;
    font-weight: 400;
      font-size: 14px;
    
}
.case{
  margin:8px 0px 10px 0px;
  font-size: 16px;
    line-height: 20px;
}
.tips{
  color:#bdbdbd;
  font-size: 14px !important;
}
</style>
