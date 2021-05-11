<template>
  <div class="app-container">
    <div>
      <div>邀请商会专属二维码:</div>
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
  </div>
</template>

<script src="./member.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/common.scss";
</style>
