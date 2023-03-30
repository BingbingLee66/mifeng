<template>
  <PlusTable
    :scroll="{ x: 'max-content' }"
    :columns="columns"
    :data-source="tableData"
    :pagination="pagination"
    :loading="loading"
    @change="handleTableChange"
  >
    <template #bodyCell="{ record, column }">
      <template v-if="column.dataIndex === 'operate'">
        <a-button type="link" @click="handleDialog(record)">编辑</a-button>
        <a-button type="link" @click="handleStatus(record.id, 1)" v-if="record.status === 0">展示</a-button>
        <a-button type="text" @click="handleStatus(record.id, 0)" danger v-if="record.status === 1">隐藏</a-button>
      </template>
    </template>
  </PlusTable>
  <CarouselModal ref="carouselRef" @refresh="fetchTableData" />
  <ContentModal ref="contentRef" @refresh="fetchTableData" />
</template>
<script setup>
import { useAntTable } from '@business/logics/src/useAntTable/index'
import { ref, watch } from 'vue'
import { getRecommendList, changeRecommendStatus } from '@/api/home-update/recommend'
import CarouselModal from './carousel-recommend.vue'
import ContentModal from './content-recommend.vue'
import { columns } from './tableCol'
const props = defineProps({
  clientType: { type: String, default: '' }
})
watch(
  () => props.clientType,
  () => {
    fetchTableData(true)
  }
)
const tableData = ref([])
const { pagination, handleTableChange, fetchTableData, loading } = useAntTable({
  fetchFn: async () => {
    const {
      data: { list, totalRows }
    } = await getRecommendList({
      platform: props.clientType,
      pageNum: 1,
      pageSize: 100
    })
    tableData.value = list
    return {
      total: totalRows
    }
  }
})
fetchTableData()
const handleStatus = async (id, status) => {
  try {
    await changeRecommendStatus({
      id,
      status
    })
    fetchTableData()
  } catch (err) {}
}
const carouselRef = ref()
const contentRef = ref()
const handleDialog = data => {
  switch (data.position) {
    case 1:
      carouselRef.value.edit(data)
      break
    case 2:
      contentRef.value.edit(data)
      break
    case 3:
      contentRef.value.edit(data)
      break
  }
}
</script>
