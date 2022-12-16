<template>
  <div>
    <hd v-bind="$attrs" />
    <div v-for="(item, index) in $attrs.item.selectItem" :key="index">
      <el-radio v-model="radio" label="1">{{ item.label }}</el-radio>
    </div>
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
  },
  data() {
    return { radio: '' }
  }
}
</script>
