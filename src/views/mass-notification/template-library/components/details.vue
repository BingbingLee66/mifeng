<template>
  <el-dialog ref="form" center :visible="visible" title="详情" width="60%" @close="close">
    <div class="content">
      <div class="content-left">凯迪云商会</div>
      <div class="content-right">
        <div class="offside">
          <div class="offside-stencil">模板ID</div>
          <div>FJIhJ3AL8MXiuz4LoGSK5QkmZlbcnt7Bsl173JZnVIA</div>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="close">我知道了</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    activeName: {
      type: String,
      default: ''
    } // activeName   1:短信 2：消息订阅  3：app
  },
  data() {
    return {
      visible: false
    }
  },

  methods: {
    // 显示
    show() {
      this.visible = true
      console.log('activeName', this.activeName)
    },

    // 关闭
    close() {
      this.visible = false
    }
  }
}
</script>

<style scoped lang="scss">
.content {
  display: flex;
  justify-content: space-between;
  .content-left {
  }
  .content-right {
    .offside {
      display: flex;
      align-content: center;
      .offside-stencil {
        font-weight: bold;
        margin-right: 50px;
      }
    }
  }
}
</style>
