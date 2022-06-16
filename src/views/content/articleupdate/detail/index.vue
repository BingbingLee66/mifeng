<template>
  <div class="preview-wrap">
    <div v-if="detailObj.auditStatus === 2 || detailObj.auditStatus === 3" class="article-remark">不通过理由：{{detailObj.auditRemark}}</div>
    <div class="preview-area">
      <div class="article-title">{{detailObj.title}}</div>
      <div style="margin-bottom:15px;">
        <videoComponent ref="videoRef" v-show="detailObj.vid" :vid="detailObj.vid" height="430px"/>
      </div>
      <div class="article-content" v-html="detailObj.contentHtml"></div>
    </div>
  </div>
</template>

<script src="./detail.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/common.scss";
</style>
<style>
.preview-wrap {
  width: 95%;
  height: auto;
  min-height: 500px;
}
.preview-area {
  width: 100%;
  min-height: 500px;
  margin: 30px 20px;
  border: 1px solid #d9dde2;
  overflow-y: auto;
}
.article-remark {
  font-size: 19px;
  font-weight: 500;
  margin: 20px;
}
.article-title {
  text-align: center;
  font-size: 24px;
  font-weight: 700;
  margin: 40px 40px 20px 40px;
}
.article-content {
  font-size: 16px;
  font-weight: 500;
  line-height: 1.8;
  margin: 0 40px 20px 40px;
}
.article-content>p>img {
  margin: 20px 10%;
  width: 80% !important;
  height: auto !important;
  max-height: 100% !important;
}
</style>
