<template>
  <div class="app-container">
    <div class="app-wrap">
      <div class="title">邀请入会专属二维码:</div>
      <div class="poster-wrap">
        <div id="postdiv" class="poster">
          <div class="poster-header">
            <div class="poster-slogan">邀您加入</div>
            <div class="poster-chamber">“{{ property.name }}”</div>
          </div>
          <img class="poster-qrcode" :src="property.systemJoinQrcode">
          <img class="poster-logo" :src="property.systemLogo">
        </div>
        <el-button style="margin-top: 20px;" type="primary" @click="refresh">刷新二维码</el-button>
        <el-button style="margin-top: 20px;" type="primary" :loading="isLoading" @click="clickGeneratePicture">保存图片</el-button>
      </div>
    </div>
  </div>
</template>

<script src="./member.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .app-container {
    padding: 80px 0 0 100px;
    box-sizing: border-box;

    .app-wrap {
      display: flex;

      .title {
        vertical-align: middle;
        float: left;
        font-size: 14px;
        color: #606266;
        line-height: 40px;
        padding: 0 12px 0 0;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        margin-right: 50px;
      }
    }

    .poster {
      position: relative;
      width: 375px;
      height: 667px;
      background: url('../../../../assets/img/member-join-bg.png') no-repeat left / cover;

      .poster-header {
        height: 194px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-size: 21px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #4E3420;
      }
      .poster-slogan {
        height: 30px;
        line-height: 30px;
        display: flex;
        align-items: center;
        margin-bottom: 11px;

        &::after,
        &::before {
          content: '';
          display: block;
          width: 64px;
          height: 1px;
          background: #4E3420;
          margin: 0 5px;
        }
      }
      .poster-chamber {
        max-width: 242px;
        line-height: 32px;
      }

      .poster-qrcode {
        position: absolute;
        width: 88px;
        height: 88px;
        bottom: 82px;
        left: 50%;
        transform: translate(-50%);
        border-radius: 9px;
      }

      .poster-logo {
        position: absolute;
        width: 40px;
        height: 40px;
        bottom: 106px;
        left: 50%;
        transform: translate(-50%);
        border-radius: 50%;
        background-color: #fff;
      }
    }
  }
</style>
