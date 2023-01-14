<template>
  <div>
    <hd v-bind="$attrs" />
    <el-input v-model="input" placeholder="限输入200字" :disabled="true" />

  </div>
</template>
<script>
export default {
  components: {
    hd: () => import('./Common_Hd.vue')
  },
  data() {
    return {
      radio: '', input: ''
    }
  },

}
</script>

