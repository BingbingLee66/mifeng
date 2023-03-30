<template>
  <Panel>
    <a-tabs :activeKey="'tableTab'">
      <a-tab-pane key="tableTab" :tab="tabName" />
    </a-tabs>
    <TimeFilter @change="dateChange" />
    <PlusTable
      :scroll="{ x: 'max-content' }"
      :columns="columns"
      :data-source="tableData"
      :pagination="pagination"
      :loading="loading"
      @change="handleTableChange"
      class="p0"
    >
      <template v-for="(_, name) in $slots" v-slot:[name]="slotData">
        <slot :name="name" v-bind="slotData" />
      </template>
    </PlusTable>
  </Panel>
</template>
<script setup>
import TimeFilter from '@business/components/src/finance/tableFilter.vue'
import { reactive, ref } from 'vue'
import { useAntTable } from '@business/logics/src/useAntTable/index'
const props = defineProps({
  ckey: {
    type: String,
    default: ''
  },
  tabName: {
    type: String,
    default: ''
  },
  API: {
    type: Function,
    default: () => {}
  },
  columns: {
    type: Array,
    default: () => []
  }
})
const tableFilter = reactive({
  startTime: '',
  endTime: ''
})
const dateChange = date => {
  const [startTime, endTime] = date
  tableFilter.startTime = startTime
  tableFilter.endTime = endTime
  fetchTableData(true)
}
const tableData = ref([])
const { pagination, handleTableChange, fetchTableData, loading } = useAntTable({
  fetchFn: async pageOption => {
    const condition = {
      pageSize: pageOption.pageSize,
      page: pageOption.current,
      ckey: props.ckey,
      startTime: tableFilter.startTime,
      endTime: tableFilter.endTime
    }
    const {
      data: {
        data: { list, totalRows }
      }
    } = await props.API(condition)
    tableData.value = list
    return {
      total: totalRows
    }
  }
})
</script>
<style lang="scss" scoped>
:deep(.ant-tabs-nav) {
  margin-bottom: 16px;
}
</style>
