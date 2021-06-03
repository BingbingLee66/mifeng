<template>
  <div class="app-container">
    <el-form ref="form" :model="property" label-position="left" label-width="200px">
      <el-row>
        <el-col :offset="2" :span="9">
          <el-form-item label="邀请商会专属二维码：">
            <div style="text-align: center;">
              <div ref="qecodeRef">
                <img src="https://ysh-sz.oss-cn-shenzhen.aliyuncs.com/prod/png/yushanghui-admin-poster-new-2.png" class="q-avatar" id="qrcode" />
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
