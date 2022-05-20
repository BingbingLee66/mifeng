<template>
  <el-pagination
    background
    layout="total, sizes, prev, pager, next, jumper"
    :page-sizes="[ 10, 20, 50, 100, 500]"
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
    }
  },
  data() {
    return { }
  },
  methods: {
    handleSizeChange(val) {
      this.$emit('change', { pageSize: val })
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
