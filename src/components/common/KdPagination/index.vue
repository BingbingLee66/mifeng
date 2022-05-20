<template>
  <el-pagination
    background
    :layout="layout"
    :page-sizes="pageSizes"
    :page-size="pageSize"
    :style="{'padding-top': '15px'}"
    v-bind="$attrs"
    v-on="$listeners"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />
</template>

<script>

export default {
  components: {},
  inheritAttrs: false,
  props: {
    pageSize: {
      type: Number,
      default: 10
    },
    pageSizes: {
      type: Array,
      default() {
        return [10, 20, 50, 100, 500]
      }
    },
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper'
    }
  },
  data() {
    return { }
  },
  methods: {
    handleSizeChange(val) {
      this.$emit('change', { pageSize: val, pageNum: 1 })
    },
    handleCurrentChange(val) {
      this.$emit('change', { pageNum: val })
    },
  },
}
</script>

<style lang="scss" scoped>
//
</style>
