<template>
  <div>
    <hd v-bind="$attrs" />
    <!-- <el-radio v-model="radio" label="1">备选项</el-radio>
    <el-radio v-model="radio" label="2">备选项</el-radio> -->
  </div>
</template>
<script>
export default {
  components: {
    hd: () => import('./Common_Hd.vue')
  },
  props: {
    // item: {
    //   type: Object,
    //   default() {
    //     return {}
    //   }
    // },
    // index: { type: Number, require }
  }
}
</script>
