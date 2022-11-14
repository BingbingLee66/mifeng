<!--对el-dialog 进行二次封装 -->
<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="dialogVisible"
    :width="dialogWidth"
    @close="close"
  >
    <slot name="content" />
    <span v-if="showFooter" slot="footer" :class="['dialog-footer',center? 'center':''] ">
      <div v-if="!customFooter">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
      <slot name="customFooter" />

    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'KdDialog',
  props: {
    // titile
    dialogTitle: {
      type: String,
      default: '提示',
    },
    // width
    dialogWidth: {
      type: String,
      default: '30%',
    },
    // if show footer
    showFooter: {
      type: Boolean,
      default: true,
    },
    // 是否直接点取消关闭弹框
    closeCancel: {
      type: Boolean,
      default: true,
    },
    // 底部按钮是否居中
    center: {
      type: Boolean,
      default: false,
    },
    // 自定义底部按钮
    customFooter: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      // if show dialog
      dialogVisible: false,
    }
  },
  methods: {
    cancel() {
      if (this.closeCancel) {
        this.hide()
      } else {
        this.$emit('cancelPopupData')
      }
    },
    // 关闭的回调
    close() {
      this.$emit('hide')
    },
    save() {
      this.$emit('savePopupData')
    },
    show() {
      this.dialogVisible = true
    },
    hide() {
      this.dialogVisible = false
    },
    handleClose() {},
  },
}
</script>

<style lang="scss" scoped>
/deep/ .el-dialog__title {
  color: #4d82f3;
}
/deep/ .el-dialog__body{
  overflow: hidden;
}
/deep/ .el-dialog__header {
  border-bottom: 1px solid #e6e6e6;
  margin: 0 20px;
  // padding: 20px 0 !important;
}

.center{
  display: flex;
  justify-content: center;
}
</style>

