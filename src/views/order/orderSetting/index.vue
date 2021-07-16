<template>
  <div class="app-container">
    <div class="block">
      <div class="os-content1">
        发货后自动确认收货时间：发货后<span class="os-hightlight">{{day}}</span>天，自动确认收货
        <el-button style="margin-left: 40px;" type="primary" size="mini" @click="update($event)" :actionid="getId('', '修改')" v-if="has('', '修改')">修改</el-button>
      </div>
      <div class="os-content2">
        修改后将对新产生的订单立即生效，已产生的订单自动确认收货时间将在以发货时的设置为准。
      </div>
    </div>
  </div>

</template>

<script src="./setting.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/common.scss";
</style>
<style>
.os-content1 {
  margin-left: 30px;
  color: #333;
}
.os-hightlight {
  margin: 0 20px;
  font-weight: 600;
  font-size: 24px;
  color: red;
}
.os-content2 {
  margin-left: 30px;
  margin-top: 30px;
  font-size: 14px;
  color: #666;
}
</style>
