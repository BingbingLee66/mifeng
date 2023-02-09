<template>
  <div>
    <PlusTable
      :loading="loading"
      :columns="columns"
      :data-source="tableData"
      :pagination="pagination"
      :scroll="{ x: 'max-content' }"
      @change="handleTableChange"
    >
      <template #bodyCell="{ record, column }">
        <template v-if="column.dataIndex === 'name'">
          <a-tag>{{ record.name }}</a-tag>
        </template>
        <template v-if="column.dataIndex === 'lastTime'">
          {{ $filters.dateFormat(+record.lastTime) }}
        </template>
      </template>
    </PlusTable>
  </div>
</template>
<script>
import { defineComponent, onMounted, ref } from 'vue'
import { useAntTable } from '@/use/useAntTable'
import Labels from '@/api/labels/labels'
import { useRoute } from 'vue-router'

export default defineComponent({
  setup() {
    const columns = [
      { title: '标签', dataIndex: 'name' },
      { title: '使用次数', dataIndex: 'useNum' },
      { title: '最近使用时间', dataIndex: 'lastTime' }
    ]
    const tableData = ref([])
    const {
      params: { userId }
    } = useRoute()
    const { pagination, handleTableChange, fetchTableData, loading } = useAntTable({
      fetchFn: async pageOption => {
        const {
          data: { totalRows, list }
        } = await Labels.getFirstInterestLabel({
          userId,
          pageNum: pageOption.current,
          pageSize: pageOption.pageSize
        })
        tableData.value = list || []
        return {
          total: totalRows || 0
        }
      }
    })
    onMounted(() => {
      fetchTableData()
    })
    return {
      columns,
      tableData,
      pagination,
      handleTableChange,
      fetchTableData,
      loading
    }
  }
})
</script>
