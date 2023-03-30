<template>
  <a-tabs v-model:activeKey="activeKey" class="bg-white pl-8">
    <a-tab-pane key="ysh" tab="凯迪云商会" />
    <a-tab-pane key="chamber" tab="其它商协会" />
  </a-tabs>
  <ActivityVerify :tableFilter="tableFilter" :inheritedColumns="tableColumns"></ActivityVerify>
</template>
<script setup>
import { computed, reactive, ref, watch } from 'vue'
import ActivityVerify from '@business/components/src/activity/ActivityVerify.vue'
import { getActivitySource } from '@/api/activity/activity'
const chamberOptions = reactive([])
const activeKey = ref('ysh')
const getChamberOptions = async () => {
  const { data } = await getActivitySource()
  chamberOptions.push(...data.filter(item => item.name !== '凯迪云商会'))
}

const tableFilter = reactive({
  ckey: ''
})
watch(activeKey, newV => {
  if (newV === 'ysh') tableFilter.ckey = ''
  else tableFilter.ckey = 'other'
})
getChamberOptions()
const tableColumns = [
  {
    title: '活动来源',
    dataIndex: 'ckey',
    filter: computed(() => activeKey.value !== 'ysh'),
    valueType: 'select',
    hideInTable: true,
    formItemProps: {
      options: chamberOptions,
      fieldNames: { label: 'name', value: 'ckey' }
    }
  }
]
</script>
