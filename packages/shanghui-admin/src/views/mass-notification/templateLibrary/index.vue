<template>
  <a-tabs v-model:activeKey="filterInfo.type" @change="changeHandler" class="bg-white pl-8">
    <a-tab-pane :key="SYNC_CHANNELS_TYPE.TEXT_MESSAGE" tab="短信通知" />
    <a-tab-pane :key="SYNC_CHANNELS_TYPE.SUBSCRIBE" tab="订阅消息" />
    <a-tab-pane :key="SYNC_CHANNELS_TYPE.APP" tab="APP通知" />
  </a-tabs>
  <PlusTable
    :scroll="{ x: 'max-content' }"
    :columns="columns[filterInfo.type]"
    :data-source="tableData"
    :pagination="pagination"
    :loading="loading"
    @change="handleTableChange"
    :request="handlerSearch"
  >
    <template #bodyCell="{ record, column }">
      <template v-if="column.dataIndex === 'operation'">
        <a-button type="link" primary @click="detailHandler(record)">详情</a-button>
      </template>
    </template>
  </PlusTable>
  <DetailModal
    :visible="visible"
    :detail="detail"
    :active="DETAIL_TYPE.TEMPLATE_LIBRARY"
    :type="filterInfo.type"
    @handleOk="closeHandler"
    @handleCancel="closeHandler"
  />
</template>
<script setup>
import { ref } from 'vue'
import { SYNC_CHANNELS_TYPE } from '@/constant/mass-notification'
import { useAntTable } from '@business/logics/src/useAntTable/index'
import { noticeTemplateList, getNoticeTemplateDetailById } from '@/api/mass-notification'
import { columns } from './columns'
import DetailModal from './components/DetailModal.vue'
import { useModal } from './useModal'
import { DETAIL_TYPE } from '@/constant/mass-Template'

const filterInfo = ref({
  type: 1,
  title: ''
})
const detail = ref(null)
const tableData = ref([])
const { visible, closeHandler, openModalHandler } = useModal({
  fetch: async record => {
    const { data } = await getNoticeTemplateDetailById({ id: record.id })
    if (filterInfo.value.type === 2) {
      data.keyValueNoticeTemplateSetVo = {
        keyValueTypeVOMapList: data.subscriptionNoticeTemplateVo?.variableAttributes
      }
    }
    detail.value = data
  }
})
const { pagination, handleTableChange, fetchTableData, loading } = useAntTable({
  fetchFn: async pageOption => {
    const params = {
      pageSize: pageOption.pageSize,
      page: pageOption.current,
      type: filterInfo.value.type,
      title: filterInfo.value.title
    }
    const {
      data: { list, totalRows }
    } = await noticeTemplateList(params)
    tableData.value = list
    return {
      total: totalRows
    }
  }
})
fetchTableData()

const handlerSearch = value => {
  filterInfo.value.title = value.title
  fetchTableData({ pageSize: 1 })
}
const changeHandler = () => {
  filterInfo.value.title = ''
  fetchTableData({ pageSize: 1 })
}
const detailHandler = record => {
  openModalHandler(record)
}
</script>
