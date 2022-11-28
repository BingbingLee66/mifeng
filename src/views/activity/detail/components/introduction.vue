<template>
  <div class="">
    <el-dialog title="嘉宾介绍" :visible.sync="introductionVisible" :before-close="close" width="30%">
      <span>{{ content }}</span>
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
    content: {
      type: String,
      default: ''
    },
    introductionVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  },
  methods: {
    close() {
      this.$emit('update:introductionVisible', false)
    }
  }
}
</script>

<style lang="scss" scoped></style>
