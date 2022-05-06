<template>
  <el-dialog
    class="publisher-dialog"
    title="添加发布者"
    :visible.sync="dialogVisible"
    width="50%"
    :before-close="handleClose">
    <div class="search">

    </div>
    <span slot="footer" class="dialog-footer">
    <el-button @click="handleClose">取 消</el-button>
    <el-button type="primary" @click="handleClose">确 定</el-button>
  </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'PublisherDialog',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    // 关闭弹窗
    handleClose() {
      this.$emit('update:dialogVisible', false)
    }
  }
}
</script>

<style scoped lang="scss">
.publisher-dialog {
  .search {
    display: flex;
  }
}
</style>
