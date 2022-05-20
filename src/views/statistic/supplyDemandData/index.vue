<template>
  <div class="p-tags-index app-container">
    <el-tabs v-model="activeName">
      <el-tab-pane v-for="tab in tabList" :key="tab.name" :label="tab.label" :name="tab.name" />
    </el-tabs>
    <component :is="activeName" />

  </div>
</template>

<script>

export default {
  components: {
    SupplyDemandStatistics: () => import('./components/SupplyDemandStatistics'),
    HotRank: () => import('./components/HotRank')
  },
  data() {
    return {
      activeName: 'HotRank',
      tabList: [
        { name: 'SupplyDemandStatistics', label: '供需数据统计' },
        { name: 'HotRank', label: '热词排行榜' }
      ]
    }
  },
}
</script>

<style></style>
