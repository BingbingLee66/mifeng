<template>
  <a-tabs
    v-model:activeKey="activeKey"
    class="bg-white pl-8"
    @change="
      handlerSearch({
        name: '',
        source: -1,
        dateTimeRange: []
      })
    "
  >
    <a-tab-pane key="rapidentry" tab="快速入驻线索" />
    <a-tab-pane key="introduce" tab="转介绍线索" />
  </a-tabs>
  <PlusTable
    :row-selection="{ onChange: onChange, selectedRowKeys: selectedTableRow, preserveSelectedRowKeys: true }"
    row-key="id"
    :columns="columns"
    :pagination="pagination"
    :loading="loading"
    :request="handlerSearch"
    :data-source="list"
    @change="handleTableChange"
  >
    <template #toolBar>
      <a-button type="primary" @click="exportExcel">导出线索</a-button>
    </template>
  </PlusTable>
</template>

<script setup>
import PlusTable from '@business/components/src/plus-table/PlusTable'
import { useAntTable } from '@business/logics/src/useAntTable/index'
import { getClueList } from '@/api/chamber/manager'
import { reactive, ref } from 'vue'
import { CHAMBER_CLUE_MAP } from '@/constant/chamber'
import dayjs from 'dayjs'
import { message } from 'ant-design-vue'
import { exportJson2Excel } from '@business/common/src/utils/exportExcel'
const statusList = [
  { id: -1, name: '全部' },
  { id: 1, name: '小程序名录' },
  { id: 2, name: 'APP名录' },
  { id: 3, name: 'h5名录' }
]
const columns = reactive([
  {
    title: '线索ID',
    dataIndex: 'id',
    filter: false,
    hideInTable: false,
    valueType: 'text'
  },
  {
    title: '社会组织名称',
    dataIndex: 'name',
    filter: true,
    hideInTable: false,
    valueType: 'text',
    width: 220
  },
  {
    title: '线索来源',
    dataIndex: 'source',
    filter: true,
    hideInTable: true,
    valueType: 'select',
    initialValue: -1,
    formItemProps: {
      options: statusList,
      fieldNames: { label: 'name', value: 'id' }
    }
  },
  {
    title: '创建时间',
    dataIndex: 'createdTs',
    filter: true,
    hideInTable: false,
    valueType: 'dateTimeRange',
    formItemProps: { valueFormat: 'x' },
    customRender: ({ record }) => {
      return dayjs(parseInt(record.createdTs)).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  {
    title: '联系人姓名',
    dataIndex: 'contactName',
    filter: false,
    hideInTable: false,
    valueType: 'texts'
  },
  {
    title: '线索来源',
    dataIndex: 'contactName',
    filter: false,
    hideInTable: false,
    valueType: 'texts'
  },
  {
    title: '联系人电话',
    dataIndex: 'contactPhone',
    filter: false,
    hideInTable: false,
    valueType: 'texts'
  }
])
const tableFilter = reactive({
  createdTs: [],
  source: -1,
  name: ''
})
const activeKey = ref('rapidentry')
const list = ref([])
const { fetchTableData, pagination, handleTableChange, loading } = useAntTable({
  async fetchFn({ current: page, pageSize }) {
    const { source, name } = tableFilter
    const params = {
      page,
      pageSize,
      type: CHAMBER_CLUE_MAP.get(activeKey.value),
      source,
      name
    }
    if (tableFilter.createdTs) {
      ;[params.startTime, params.endTime] = tableFilter.createdTs
    }
    const type = CHAMBER_CLUE_MAP.get(activeKey.value) === 1
    const { data } = type ? await getClueList(params) : await getClueList(params)
    list.value = data.list || []
    return { total: data.totalRows || 0 }
  }
})
fetchTableData()
// 导出表格
function exportXLSX() {
  const tempSelectDatas = ref([])
  const selectedTableRow = ref([])
  const onChange = (index, row) => {
    selectedTableRow.value = index
    tempSelectDatas.value = row.filter(item => item !== undefined)
  }
  const exportExcel = () => {
    if (selectedTableRow.value.length === 0) {
      message.warn('请选择导出记录')
      return
    }
    const selectionDatas = handleData(tempSelectDatas.value)
    const text = activeKey.value === 'rapidentry' ? '快速入驻线索' : '转介绍线索'
    exportJson2Excel(text, selectionDatas)
  }
  const handleData = list => {
    const newList = list.map(v => ({
      线索ID: v.id,
      社会组织名称: v.name,
      创建时间: dayjs(parseInt(v.createdTs)).format('YYYY-MM-DD HH:mm:ss'),
      线索来源: v.source === 1 ? '小程序名录' : v.source === 2 ? 'APP名录' : 'h5名录',
      联系人姓名: v.contactName,
      联系人电话: v.contactPhone
    }))
    return newList
  }
  return { selectedTableRow, onChange, exportExcel }
}
const { selectedTableRow, onChange, exportExcel } = exportXLSX()
const handlerSearch = value => {
  Object.assign(tableFilter, value)
  fetchTableData({ current: 1 })
  selectedTableRow.value = []
}
</script>

<style scoped></style>
