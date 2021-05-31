<template>
  <div class="app-container">
    <div class="app-wrap">
      <div class="title">扫码快速加入 <span style="color: #409EFF">{{chamberName}} > {{departmentName}}</span></div>
      <div class="post">
        <div id="postdiv" ref="postRefs" class="post-wrap">
          <p class="tit-1">{{chamberName}}</p>
          <p class="tit-2">{{departmentName}}</p>
          <div class="erweima">
            <img :src="qrcode"/>
          </div>
        </div>
        <el-button style="margin-top: 20px;" type="primary" @click="domtoimage" :loading="isLoading">保存图片</el-button>
      </div>
    </div>
  </div>
</template>

<script src="./invite.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/common.scss";
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.app-container {
  padding: 10px 0 0 30px;
  box-sizing: border-box;

  .app-wrap {

    .title {
      font-size: 16px;
      color: #000;
      line-height: 40px;
      font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
    }

    .post {
      .post-wrap {
        width: 375px;
        height: 667px;
        background-image: url("../../../../public/img/admin-entyr-poster-bg-1.png");
        background-size: 100% 100%;
        padding: 40px 16px 16px 16px;
        text-align: center;

        .tit-1 {
          margin: 0;
          padding: 0;
          color: #ffffff;
          font-weight: bold;
          font-size: 42px;
          font-style: italic;
          overflow: hidden;
        }

        .tit-2 {
          margin: 0;
          padding: 0;
          color: #ffffff;
          font-weight: bold;
          font-size: 35px;
          margin-top: 12px
        }

        .erweima {
          width: 342px;
          height: 313px;
          margin: 0 auto;
          margin-top: 20px;
          padding-top: 80px;
          background: url("../../../../public/img/admin-entyr-poster-bg-2.png") no-repeat;
          background-size: 100% 100%;
          text-align: center;

          img {
            width: 183px;
            height: 183px;
            object-fit: cover;
          }
        }
      }
    }
  }
}
</style>
