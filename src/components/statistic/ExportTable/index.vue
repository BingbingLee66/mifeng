<template>
  <el-button type="primary" size="mini" @click="exportExcel">导表</el-button>
</template>

<script>
import { exportJson2Excel } from '@/utils/exportExcel'

export default {
  components: {},
  props: {
    title: {
      type: String,
      default: ''
    },
    data: {
      type: [Array, Function],
      default() {
        return []
      }
    },
  },
  methods: {
    exportExcel() {
      if (typeof this.data !== 'function' && !this.data.length) return this.$message({ message: '请选择导出记录', type: 'warning' })
      exportJson2Excel(this.title, this.data)
    },

  },
}
</script>

<style lang="scss" scoped>
//
</style>
