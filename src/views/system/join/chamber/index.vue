<template>
  <div class="app-container">
    <el-form ref="form" :model="property" label-position="left" label-width="200px">
      <el-row>
<!--         <el-col :offset="2" :span="10">
          <el-form-item label="邀请商会入驻链接：">
            <el-input v-model="property.systemJoinUrl"></el-input>
          </el-form-item>
        </el-col> -->
        <!-- <el-col :offset="1" :span="2">
          <el-button type="success" @click="createQrcode($event)" :actionid="getId('', '生成二维码')" v-if="has('', '生成二维码')">生成二维码</el-button>
        </el-col> -->
<!--         <el-col style="margin-left: 20px;" :span="2">
          <el-button type="primary"
            v-clipboard:copy="property.systemJoinUrl"
            v-clipboard:success="onCopy"
            v-clipboard:error="onError">复制链接</el-button>
        </el-col> -->
      </el-row>
      <el-row>
        <el-col :offset="2" :span="9">
          <el-form-item label="邀请商会专属二维码：">
            <div style="text-align: center;">
              <div ref="qecodeRef">
                <img src="https://ysh-sz.oss-cn-shenzhen.aliyuncs.com/prod/png/yushanghui-admin-poster-new.png" class="q-avatar" id="qrcode" />
              </div>
              <el-button style="margin-top: 20px;" type="primary" @click="save">保存二维码</el-button>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script src="./chamber.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/common.scss";
</style>
<style>
.q-avatar {
  width: 375px;
  height: 667px;
  display: block;
}
</style>
