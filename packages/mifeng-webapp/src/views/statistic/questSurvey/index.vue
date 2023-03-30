<template>
  <a-tabs v-model:activeKey="activeName" @change="onTabClick" class="my-tab">
    <a-tab-pane v-for="item in tabList" :key="item.n" :tab="item.l" :name="item.n" />
  </a-tabs>
  <div class="wrap">
    <component :is="activeName === 'StatisticPandect' ? StatisticPandect : TableComponent"></component>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import StatisticPandect from './components/statisticPandect.vue'
import TableComponent from './components/tableComponent.vue'
const tabList = [
  { l: '总览', n: 'StatisticPandect' },
  { l: '问卷', n: 'TableComponent' }
]
const activeName = ref('StatisticPandect')
const onTabClick = activeKey => {
  console.log('activeKey', activeKey)
}
</script>

<style lang="scss" scoped>
.wrap {
  padding-left: 25px;
}
.my-tab {
  padding-left: 32px;
  background: #fff;
  margin-bottom: 0px;
}
:deep(.ant-tabs-nav) {
  margin-bottom: 0px;
}
</style>
