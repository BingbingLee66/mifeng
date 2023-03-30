<template>
  <div>
    <a-tabs v-model:activeKey="activeName">
      <a-tab-pane tab="链接" key="link">
        <Link @onClick="onClick" />
      </a-tab-pane>
      <a-tab-pane tab="云会甄选小程序" key="miniprogram">
        <Miniprogram @onClick="onClick" />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Link from './link.vue'
import Miniprogram from './miniprogram'
const emit = defineEmits(['click'])
const activeName = ref('link')
const onClick = data => {
  emit('click', { ...data, linkType: activeName.value })
}
</script>

<style scoped lang="scss"></style>
