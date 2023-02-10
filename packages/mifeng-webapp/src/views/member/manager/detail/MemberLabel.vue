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
        <template v-if="column.dataIndex === 'tagName'">
          <a-tag> {{ record.tagName }}</a-tag>
        </template>
        <template v-if="column.dataIndex === 'updateInfo'">
          <div>{{ record.tagPeople || '--' }}</div>
          <div>{{ record.markTime ? $filters.dateFormat(+record.markTime) : '- -' }}</div>
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
import PlusTable from '@/components/plusTable/PlusTable.vue'

export default defineComponent({
  components: { PlusTable },
  setup() {
    const columns = [
      { title: '标签组', dataIndex: 'tagGroupName' },
      { title: '标签', dataIndex: 'tagName' },
      { title: '标记信息', dataIndex: 'updateInfo' }
    ]
    const tableData = ref([])
    const {
      params: { userId }
    } = useRoute()
    const { pagination, handleTableChange, fetchTableData, loading } = useAntTable({
      fetchFn: async pageOption => {
        const {
          data: { totalRows, list }
        } = await Labels.getUserDetailLabelLst(userId, '1', {
          page: pageOption.current,
          pageSize: pageOption.pageSize
        })
        tableData.value = list || []
        return {
          total: totalRows || 0
        }
      }
    })
    onMounted(() => {
      if (userId) {
        fetchTableData()
      }
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
