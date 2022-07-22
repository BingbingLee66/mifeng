<template>
  <el-button type="primary" size="mini" @click="exportExcel">
    <slot>导表</slot>
  </el-button>
</template>

<script>
import { exportJson2Excel } from '@/utils/exportExcel'

export default {
  components: {},
  props: {
    title: {
      type: String,
      default: '导出记录'
    },
    data: {
      type: [Array, Function],
      default() {
        return []
      }
    },
    errMsg: {
      type: String,
      default: '请选择导出记录'
    }
  },
  methods: {
    exportExcel() {
      if (typeof this.data !== 'function' && !this.data.length) return this.$message({ message: this.errMsg, type: 'warning' })
      exportJson2Excel(this.title, this.data)
    },

  },
}
</script>

<style lang="scss" scoped>
//
</style>
