<template>
  <a-tabs v-model:activeKey="clientType" class="bg-white pl-8">
    <a-tab-pane :key="DEVICE_TYPE.MINIPROGRAM" tab="小程序" />
    <a-tab-pane :key="DEVICE_TYPE.APP" tab="app" />
  </a-tabs>
  <Banner :clientType="tabType" />
</template>
<script>
import { ref, defineAsyncComponent, computed } from 'vue'
import { DEVICE_TYPE } from '@/constant/home-update'
export default {
  components: {
    Banner: defineAsyncComponent(() => import('./components/banner.vue'))
  },
  setup() {
    const clientType = ref('1')
    const tabType = computed(() => {
      return clientType.value - 1 + ''
    })
    return {
      clientType,
      DEVICE_TYPE,
      tabType
    }
  }
}
</script>
<style lang="scss" scoped>
:deep(.ant-tabs-nav) {
  margin: 0;
}
</style>
