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
            <div>
              <div
                ref="qecodeRef12"
                style="width: 375px;height: 667px;background-image: url(img/admin-entyr-poster-bg-1.png);background-size: 100% 100%;">
                <div style="padding-top:40px;text-align: center;font-family: PingFang SC, PingFang SC-Bold;font-family: PingFang SC, PingFang SC-Bold;">
                  <p style="margin:0;padding:0;color: #ffffff;font-weight: bold;font-size: 42px;font-style: italic;">{{ property.name }}</p>
                  <p style="margin:0;padding:0;color: #ffffff;font-weight: bold;font-size: 35px;margin-top: 12px">邀请您加入</p>
                </div>
                <div
                  class="erweima"
                  style="margin: 0 auto;margin-top:20px;width: 342px;height: 313px;padding-top:80px;background: url(img/admin-entyr-poster-bg-2.png) no-repeat;background-size: 100% 100%;text-align: center;">
                  <img style="width: 183px;height: 183px;object-fit: cover;"
                       :src="property.systemJoinQrcode" id="qrcode"/>
                </div>
              </div>
              <el-button style="margin-top: 20px;" type="primary" @click="refresh">刷新二维码</el-button>
              <el-button style="margin-top: 20px;" type="primary" @click="clickGeneratePicture">保存二维码</el-button>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script src="./member.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/common.scss";
</style>
