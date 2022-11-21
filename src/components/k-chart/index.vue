<template>
  <div v-loading="loading">
    <v-chart v-if="hasData && !loading" ref="chart" :options="option" :auto-resize="true" />
    <div v-else class="no-data">暂无数据</div>
  </div>
</template>

<script>
export default {
  name: 'KChart',
  props: {
    loading: {
      type: Boolean,
      default: true
    },
    hasData: {
      type: Boolean,
      default: false
    },
    option: {
      type: Object,
      default: () => {}
    }
  },
  mounted() {
    window.addEventListener('resize', this.onResize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResize)
  },
  methods: {
    onResize() {
      console.log(this.option)
      const { chart } = this.$refs
      // chart.mergeOptions()
      // setTimeout(() => {
      //   chart.options = this.option
      // }, 0)
      chart.resize()
    }
  }
}
</script>

<style scoped lang="scss">
::v-global(.ant-spin-nested-loading),
::v-global(.ant-spin-container) {
  height: 100%;
}
.no-data {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
