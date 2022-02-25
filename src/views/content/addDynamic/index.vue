<template>
  <div class="app-container">
    <div >
      <span>*</span>
      <span>选择发布者</span>
      <el-button type="primary" @click="showOfficialComponent($event)"
        >去选择
      </el-button>
      <span>仅可选择一位发布者，重选后，新选择的发布者将会替换已选发布者</span>
    </div>

    <officialComponent
      :type="2"
      ref="OfficialComponent"
      title="添加发布者"
    ></officialComponent>
  </div>
</template>

<script src="./index.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/common.scss";
.contentHtml {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  img {
    width: 20% !important;
    height: 20% !important;
  }
}
#myhtml img {
  width: 20% !important;
  height: 20% !important;
}
</style>
