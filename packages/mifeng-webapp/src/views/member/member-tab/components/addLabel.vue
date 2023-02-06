<template>
  <div>{{ addlabelVisibleMy }}</div>
  <a-modal v-model:visible="addlabelVisibleMy" title="查看标签">sss </a-modal>
</template>

<script>
import { ref } from 'vue-demi'
export default {
  props: ['type', 'addlabelVisible'],
  setup(props) {
    // console.log('props', props)
    // return { ...toRefs(props) }
    const addlabelVisibleMy = ref(props.addlabelVisible)
    return { addlabelVisibleMy }
  }
}
</script>

<style></style>
