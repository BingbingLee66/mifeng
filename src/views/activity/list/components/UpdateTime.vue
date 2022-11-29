<template>
  <div class="">
    <el-dialog title="修改活动时间" :visible.sync="updateTimeVisiable" :before-close="close" width="30%">
      <span>{{ id }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="close">我知道了</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    id: {
      type: String,
      default: ''
    },
    updateTimeVisiable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  },
  methods: {
    close() {
      this.$emit('update:updateTimeVisiable', false)
    }
  }
}
</script>

<style lang="scss" scoped></style>
