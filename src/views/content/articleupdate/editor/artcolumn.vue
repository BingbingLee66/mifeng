<template>
  <div class="app-container">
    <el-form ref="form" :model="formObj" :rules="rules" label-position="right" label-width="100px">
      <el-row>
        <el-col :span="24" v-if="activeName !== '8'">
          <el-form-item label="栏目：" prop="columnContent">
            <el-input v-model="formObj.columnContent" disabled></el-input> 
            <!-- <el-input v-model="formObj.columnContent" ></el-input> -->
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18">
          <el-form-item label="文章内容：">
            <Ckeditor ref="ckeditor2" @getHtml="getHtml"></Ckeditor>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <preview-ph :title="formObj.columnContent" :htmlObj="formObj.contentHtml"></preview-ph>
        </el-col>
      </el-row>
      <el-form-item>
        <el-col :span="8">
          <el-button type="primary" v-dbClick @click="save">确定</el-button>
          <el-button @click="closeTab">取消</el-button>
        </el-col>
      </el-form-item>
    </el-form>
  </div>

</template>

<script src="./column.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/common.scss";
</style>
