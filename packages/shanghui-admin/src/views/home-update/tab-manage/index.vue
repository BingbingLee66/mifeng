<template>
  <a-tabs v-model:activeKey="clientType" class="bg-white pl-8">
    <a-tab-pane :key="DEVICE_TYPE.MINIPROGRAM" tab="小程序" />
    <a-tab-pane :key="DEVICE_TYPE.APP" tab="app" />
  </a-tabs>
  <Table :clientType="clientType" />
</template>
<script>
import { ref, defineAsyncComponent } from 'vue'
import { DEVICE_TYPE } from '@/constant/home-update'
export default {
  components: {
    Table: defineAsyncComponent(() => import('./components/table.vue'))
  },
  setup() {
    const clientType = ref('1')
    return {
      clientType,
      DEVICE_TYPE
    }
  }
}
</script>
<style lang="scss" scoped>
:deep(.ant-tabs-nav) {
  margin: 0;
}
</style>
