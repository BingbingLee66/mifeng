<!--对el-dialog 进行二次封装 -->
<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="dialogVisible"
    :width="dialogWidth"
    @close="close"
  >
    <slot name="content"></slot>
    <span slot="footer" class="dialog-footer" v-if="showFooter">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: "kdDialog",
  data() {
    return {
      // if show dialog
      dialogVisible: false,
    };
  },
  props: {
    //titile
    dialogTitle: {
      type: String,
      default: "提示",
    },
    //width
    dialogWidth: {
      type: String,
      default: "30%",
    },
    //if show footer
    showFooter: {
      type: Boolean,
      default: true,
    },
    //是否直接点取消关闭弹框
    closeCancel: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    cancel() {
      if (this.closeCancel) {
        this.hide();
        this.close()
      } else {
        this.$emit("cancelPopupData");
      }
    },
    //关闭的回调
    close() {
      this.$emit("hide");
    },
    save() {
      this.$emit("savePopupData");
    },
    show() {
      this.dialogVisible = true;
    },
    hide() {
      this.dialogVisible = false;
    },
    handleClose() {},
  },
};
</script>

<style lang="scss" scoped>
/deep/ .el-dialog__title {
  color: #4d82f3;
}
/deep/ .el-dialog__header {
  border-bottom: 1px solid #e6e6e6;
  margin: 0 20px;
  // padding: 20px 0 !important;
}
</style>

