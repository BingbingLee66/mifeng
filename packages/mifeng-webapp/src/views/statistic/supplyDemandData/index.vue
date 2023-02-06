<template>
  <a-tabs v-model:activeKey="activeName" class="bg-white pl-8">
    <a-tab-pane v-for="tab in tabList" :key="tab.name" :tab="tab.label" />
  </a-tabs>

  <component :is="activeName" />
</template>
<script>
import { reactive, ref, defineAsyncComponent } from 'vue'

export default {
  components: {
    SupplyDemandStatistics: defineAsyncComponent(() => import('./components/SupplyDemandStatistics.vue')),
    HotRank: defineAsyncComponent(() => import('./components/HotRank.vue'))
  },
  setup() {
    const activeName = ref('SupplyDemandStatistics')
    const tabList = reactive([
      { name: 'SupplyDemandStatistics', label: '供需数据统计' },
      { name: 'HotRank', label: '热词排行榜' }
    ])
    return {
      activeName,
      tabList
    }
  }
}
</script>
<style lang="scss" scoped>
:deep(.ant-tabs-nav) {
  margin: 0;
}
</style>
