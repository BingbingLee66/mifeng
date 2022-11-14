<template>
  <div>
    <myTodo />
    <cardList :card-list="cardList" />
    <toolBar />
  </div>
</template>

<script src="./dashboard.js"></script>
<style lang="scss">
.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  padding-bottom: 20px;
  // &:after {
  //   content: '';
  //   position: absolute;
  //   left: -20px;
  //   right: -20px;
  //   bottom: 0;
  //   height: 1px;
  //   background: #e8e8e8;
  // }

  .panel-title {
    font-size: 15px;
    line-height: 25px;
  }
}
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-container {
  min-height: calc(100vh - 100px);
  // display: flex;
  // justify-content: center;
  // align-items: center;
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
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}

.dashboard {
  &-container {
    padding: 15px;
    background-color: #f0f2f5;
  }
  &-text {
    font-size: 14px;
    line-height: 22px;
    padding-bottom: 15px;
  }
}
.echarts {
  width: 100%;
  height: 100%;
}
.box-card {
  height: 108px;
}
.chart {
  height: 350px;
}
.section {
  padding: 20px;
  background-color: white;
  border: 1px solid #ebeef5;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.box-card > div > div > .svg-icon {
  width: 4em;
  height: 4em;
  color: #34bfa3;
}
.card-panel-text {
  padding-top: 10px;
  font-size: 16px;
  color: gray;
}
.card-panel-num {
  padding-top: 10px;
  font-size: 20px;
  font-weight: bold;
}
</style>
