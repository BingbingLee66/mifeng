<template>
  <div>
    <hd v-bind="$attrs" />
    <a-input v-model="input" placeholder="限输入200字" :disabled="true" />
  </div>
</template>
<script>
import hd from './Common_Hd.vue'
export default {
  components: {
    hd
  },
  data() {
    return {
      radio: '',
      input: ''
    }
  }
}
</script>
