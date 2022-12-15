<template>
  <div>
    <div>{{ item.name }}</div>
    <el-radio v-model="radio" label="1">备选项</el-radio>
    <el-radio v-model="radio" label="2">备选项</el-radio>

  </div>
</template>
<script>
export default {
  props: {
    item: {
      type: Object,
      default() { return {} }
    }
  }
}
</script>
