<template>
  <div>
    <myTodo :message-list="messageList" />
    <cardList v-if="permission" :card-list="cardList" />
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
  .panel-title {
    font-size: 15px;
    line-height: 25px;
  }
}
</style>
<style rel="stylesheet/scss" lang="scss" scoped></style>
