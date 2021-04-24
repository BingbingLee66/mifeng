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
        <el-col :span="18">
          <el-form-item label="文章内容：">
            <Ckeditor ref="ckeditor1" @getHtml="getHtml"></Ckeditor>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <preview-ph :title="formObj.title" :htmlObj="formObj.webContent"></preview-ph>
        </el-col>
      </el-row>
      <el-form-item>
        <el-col :span="8">
          <el-button type="primary" @click="save">确定</el-button>
          <el-button @click="closeTab">取消</el-button>
        </el-col>
      </el-form-item>
    </el-form>
  </div>

</template>

<script src="./editor.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/common.scss";
</style>
