<template>
  <PlusTable
    rowKey="id"
    :columns="columns"
    :data-source="dataSource"
    :request="handlerSearch"
    :pagination="pagination"
    :loading="loading"
    @change="handleTableChange"
    bordered
  />
</template>

<script setup>
import PlusTable from '@/components/plusTable/PlusTable.vue'
import { ref, reactive, onMounted } from 'vue'
import { useAntTable } from '@/use/useAntTable/index'
import { getOperatedType, getLogList } from '@/api/system/operatedlog'
const typeOptions = ref([])
const getOperatedTypes = async () => {
  const {
    data: { data }
  } = await getOperatedType()
  data.forEach(item => {
    typeOptions.value.push({
      label: item,
      value: item
    })
  })
}
const columns = [
  {
    title: '操作行为',
    dataIndex: 'actionName',
    filter: true,
    valueType: 'select',
    formItemProps: {
      options: typeOptions.value
    }
  },
  {
    title: '操作事件',
    dataIndex: 'menuName'
  },
  {
    title: '操作时间',
    dataIndex: 'createdTs'
  },
  {
    title: '操作人',
    dataIndex: 'operator',
    filter: true,
    valueType: 'text',
    options: {
      placeholder: '请选择操作人'
    }
  },
  {
    title: '操作时间',
    dataIndex: 'createdTs',
    filter: true,
    hideInTable: true,
    valueType: 'dateTimeRange',
    formItemProps: { valueFormat: 'YYYY-MM-DD' }
  }
]

const query = reactive({})
const dataSource = ref([])
onMounted(async () => {
  await fetchTableData()
  getOperatedTypes()
})
const fetchFn = async pageOption => {
  const conditionQuery = reactive({
    pageSize: pageOption.pageSize,
    page: pageOption.current,
    actionName: query.actionName,
    operator: query.operator,
    startTs: query.startTs,
    endTs: query.endTs
  })
  const {
    data: { data }
  } = await getLogList(conditionQuery)
  dataSource.value = data.list
  return {
    total: data.totalRows
  }
}
const { pagination, handleTableChange, fetchTableData, loading } = useAntTable({ fetchFn })

const handlerSearch = value => {
  if (value.createdTs) {
    const [startTs, endTs] = value.createdTs
    query.startTs = startTs
    query.endTs = endTs
  } else {
    query.startTs = null
    query.endTs = null
  }
  query.actionName = value.actionName
  query.operator = value.operator
  fetchTableData()
}
</script>

<style lang="scss" scoped></style>
