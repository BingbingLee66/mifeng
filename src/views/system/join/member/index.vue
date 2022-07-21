<template>
  <div class="app-container">
    <div class="app-wrap">
      <div class="title">邀请入会专属二维码:</div>
      <div class="post">
        <div id="postdiv" ref="postRefs" class="post-wrap">
          <p class="tit-1">{{ property.name }}</p>
          <p class="tit-2">邀请您加入</p>
          <div class="erweima">
            <div class="erweima-content">
              <img class="erweima-img" :src="property.systemJoinQrcode">
              <img class="erweima-logo"  :src="property.systemLogo">
            </div>
            
            
          </div>
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

      .post {
        .post-wrap {
          width: 375px;
          height: 667px;
          background-image: url("../../../../../public/img/admin-entyr-poster-bg-1.png");
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
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
          }

          .tit-2 {
            margin: 0;
            padding: 0;
            color: #ffffff;
            font-weight: bold;
            font-size: 35px;
            margin-top: 12px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }

          .erweima {
            width: 342px;
            height: 313px;
            margin: 0 auto;
            margin-top: 20px;
            padding-top: 80px;
            background: url("../../../../../public/img/admin-entyr-poster-bg-2.png")
              no-repeat;
            background-size: 100% 100%;
            text-align: center;
            .erweima-content{
              position: relative;   
              width: 183px;
              height: 183px;
              margin: 0 auto;  
              .erweima-logo{
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-49%, -49%);
                width: 87px;
                height: 87px;
                border-radius: 50%;
                z-index: 200;
                object-fit: cover;
              }     
              .erweima-img {
                width: 183px;
                height: 183px;
                object-fit: cover;
              }
            }
              
          }
        }
      }
    }
  }
</style>
