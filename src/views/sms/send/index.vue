<template>
  <div class="app-container">
    <el-form ref="form" :model="formObj" :rules="rules" label-position="right" label-width="100px">
      <el-row>
        <el-col :span="22">
          <el-form-item label="短信内容：" prop="msg">
            <div>短信内容少于70个字，为一条短信；超过70字的，按每67字为一条短信。</div>
            <el-input type="textarea" :rows="5" v-model="formObj.msg"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="22">
          <el-form-item label="发送号码：" prop="mobiles">
            <div>多个号码以英文逗号","隔开</div>
            <el-input type="textarea" :rows="15" v-model="formObj.mobiles"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-col :span="8">
          <el-button type="primary" v-dbClick @click="send($event)" :actionid="getId('', '发送')" v-if="has('', '发送')">发送</el-button>
        </el-col>
      </el-form-item>
    </el-form>
  </div>
</template>

<script src="./send.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/common.scss";
</style>
