<template>
  <div>
    <cardList v-if="permission" :card-list="cardList" />

    <div class="flex-x">
      <toolBar style="flex: 2" />
      <myTodo :message-list="messageList" style="flex: 1" />
    </div>
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
<style rel="stylesheet/scss" lang="scss" scoped></style>
