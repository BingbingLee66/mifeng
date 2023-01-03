<template>
  <el-dialog :visible="visible" title="分享" width="500px" v-bind="$attrs" v-on="$listeners">
    <div style="margin-bottom:20px;" class="flex-x">
      <div class="shrink-0 ml-10">链接</div>
      <div>链接链接链接链接链接链接链接链接链接链接链接链接链接链接链接链接链接链接链接链接链接</div>
      <div class="shrink-0 ml-10 text-blue" @click="onCopy">复制</div>
    </div>
    <div class="flex-x">
      <div class="shrink-0 ml-10">二维码</div>
      <div>二维码</div>
      <div class="shrink-0 ml-10 text-blue">下载</div>
    </div>
    <el-button slot="footer" type="primary" @click.stop="$emit('update:visible',!visible)">关闭</el-button>
  </el-dialog>
</template>

<script>

export default {
  components: {},
  inheritAttrs: false,
  props: {
    visible: {
      type: Boolean,
      value: false
    }
  },
  data() { return {} },
  methods: {
    async onCopy() {
      try {
        await this.$copyText('123123')
        this.$message.success('复制成功')
      } catch (error) {
        this.$message.error('复制失败')
      }
    }
  },
}
</script>

<style lang="scss" scoped>
.shrink-0 {
  flex-shrink: 0;
}

.text-blue {
  cursor: pointer;
}
</style>
