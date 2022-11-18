<template>
  <div>
    <template v-if="ckey">
      <cardList v-if="permission" :card-list="cardList" />

      <div class="flex-x">
        <ToolBar style="flex: 2; margin-right: -24px" />
        <myTodo :message-list="messageList" style="flex: 1" />
      </div>
    </template>
    <template v-else>
      <div id="dashboard" class="dashboard-container" style="background-color: #ffffff">
        <div class="dashboard-container-view">
          <div class="dashboard-text">欢迎光临:{{ name }}</div>
          <img class="dashboard-img" src="@/assets/img/home.png">
        </div></div></template>
  </div>
</template>

<script src="./dashboard.js"></script>
<style lang="scss">
.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  padding: 15px 0;
  border-bottom: 1px solid #e8e8e8;
  .panel-title {
    font-size: 16px;
    font-weight: bolder;
    color: rgba(0, 0, 0, 0.85);
    line-height: 24px;
  }
}
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-container {
  min-height: calc(100vh - 100px);
  display: flex;
  justify-content: center;
  align-items: center;
}
.dashboard-container-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  .dashboard-text {
    font-size: 24px;
    color: #222222;
    margin-bottom: 39px;
  }
  .dashboard-img {
    width: 524px;
    height: 288px;
  }
}
</style>
