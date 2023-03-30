<template>
  <PlusTable
    :columns="columns"
    :data-source="tableData"
    :scroll="{ x: 'max-content' }"
    :pagination="pagination"
    :loading="loading"
    @change="handleTableChange"
    :request="handlerSearch"
  >
    <template #searchToolBar> <div></div></template>
    <template #filterItem>
      <div class="flex-x" style="width: 1000px">
        <a-input
          v-model:value="tableFilter.queryParameter"
          allowClear
          style="width: 300px"
          placeholder="相册名称、主体名称"
        >
          <template #prefix>
            <search-outlined />
          </template>
        </a-input>

        <div class="flex-x-center-center ml20">
          相册状态
          <a-select
            v-model:value="tableFilter.status"
            :options="ALBUM_TYPES_LIST"
            style="width: 300px; margin-left: 10px"
          />
        </div>
      </div>
    </template>
  </PlusTable>
  <ReportDetail
    :albumInfo="detailModalData.albumInfo"
    v-model:visible="detailModalData.visible"
    @success="onQueryChange(true)"
  />
</template>
<script setup>
import { ref, reactive, watch, onUnmounted } from 'vue'

import { getReportList } from '@/api/report'
import { ALBUM_TYPES_LIST } from '@business/common/src/album/constant'

import { useAntTable } from '@business/logics/src/useAntTable'
import ReportDetail from './components/reportDetail.vue'
const tableData = ref([])
const tableFilter = reactive({
  queryParameter: '',
  status: ''
})
const detailModalData = reactive({})
const columns = [
  {
    title: '举报相册',
    dataIndex: 'albumId',
    customRender: ({ record: { albumId, albumName } }) => {
      return (
        <div>
          <div style="color:#66b1ff">{albumId}</div>
          {albumName}
        </div>
      )
    },
    width: 200
  },

  {
    title: '相册主体',
    dataIndex: 'activityId&activityName',
    customRender: ({ record: { mainBodyId, mainBodyName } }) => {
      return (
        <div>
          <div style="color:#66b1ff">{mainBodyId}</div>
          {mainBodyName}
        </div>
      )
    }
  },
  {
    title: '举报次数',
    dataIndex: 'reportCount'
  },
  {
    title: '状态',
    dataIndex: 'albumStatus',
    filter: true,
    customRender: ({ record: { albumStatus } }) => {
      return albumStatus ? <span style="color:#67c23a">正常</span> : <span style="color:#f56c6c">已冻结</span>
    }
  },
  {
    title: '处理时间',
    dataIndex: 'freezeTime'
  },
  {
    title: '操作',
    dataIndex: 'operation',
    hideInAdd: true,
    customRender: ({ record }) => {
      return (
        <a-button type="link" onClick={() => showDetailDialog(record)}>
          详情
        </a-button>
      )
    },
    fixed: 'right'
  }
]
const showDetailDialog = record => {
  detailModalData.albumInfo = record
  detailModalData.visible = true
}

const { fetchTableData, pagination, handleTableChange, loading } = useAntTable({
  async fetchFn({ current, pageSize }) {
    const { data } = await getReportList({
      ...tableFilter,
      pageSize,
      pageNum: current
    })
    tableData.value = data.list || []
    return { total: data.totalRows || 0 }
  }
})

const handlerSearch = value => {
  Object.assign(tableFilter, value)
  fetchTableData(1)
}
// tableFilter变化时实时获取数据绑定的timer
let QueryChangetimer = null
const onQueryChange = async query => {
  Object.assign(tableFilter, query)
  clearTimeout(QueryChangetimer)
  QueryChangetimer = setTimeout(() => fetchTableData(true), 300)
}
onUnmounted(() => {
  clearTimeout(QueryChangetimer)
})
watch(
  tableFilter,
  newV => {
    onQueryChange(newV)
  },
  {
    deep: true,
    immediate: true
  }
)
</script>
<style lang="scss" scoped></style>
