<template>
  <a-modal :visible="props.visible" title="选择文章" width="90%" @cancel="emit('update:visible', false)" @ok="onSubmit">
    <PlusTable
      row-key="id"
      :row-selection="rowSelection"
      :loading="loading"
      :columns="fiveGColumns"
      :data-source="tableData"
      :pagination="pagination"
      :request="handleSearch"
      :search="{ hiddenNum: 4 }"
      @change="handleTableChange"
      bordered
    >
    </PlusTable>
  </a-modal>
</template>

<script setup>
import PlusTable from '@business/components/src/plus-table/PlusTable.vue'
import { ref, reactive, onMounted, computed, watch, getCurrentInstance } from 'vue'
import { useAntTable } from '@business/logics/src/useAntTable/index'
import { useRowSelection } from '@business/logics/src/useRowSelection'
import { getChamberOptions } from '@business/common/src/finance/api'
import { getManagerList } from '@business/common/src/content/api/article'
const emit = defineEmits(['update:visible', 'add'])
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})
const chamberOptions = ref([])
const getChamberOption = async () => {
  const {
    data: { data }
  } = await getChamberOptions()
  chamberOptions.value = data
  chamberOptions.value.unshift({ label: '全部', value: '' }, { label: '凯迪云商会', value: 'kaidiyun' })
}
const fiveGColumns = ref([
  {
    title: '文章ID',
    dataIndex: 'id'
  },
  {
    title: '文章标题',
    dataIndex: 'title',
    filter: true,
    valueType: 'text',
    formItemProps: {
      placeholder: '请输入文章标题'
    },
    width: 300
  },
  {
    title: '文章状态',
    hideInTable: true,
    dataIndex: 'status',
    filter: true,
    valueType: 'select',
    initialValue: 1,
    formItemProps: {
      options: [
        { value: 1, label: '已发布' },
        { value: 0, label: '已冻结(商会)' },
        { value: 3, label: '已冻结(平台)' },
        { value: 5, label: '审核不通过' },
        { value: 4, label: '定时发布' },
        { value: -1, label: '所有' }
      ]
    }
  },
  {
    title: '来源商会',
    dataIndex: 'chamberName',
    filter: true,
    valueType: 'select',
    initialValue: '',
    formItemProps: {
      options: computed(() => {
        return chamberOptions.value
      })
    },
    width: 300
  },
  {
    title: '发布时间',
    dataIndex: 'publishTimeType',
    filter: true,
    valueType: 'select',
    initialValue: 0,
    formItemProps: {
      options: [
        { value: 0, label: '所有' },
        { value: 1, label: '24小时内' },
        { value: 2, label: '3天内' },
        { value: 3, label: '7天内' },
        { value: 4, label: '一个月内' }
      ]
    },
    customRender: ({ record }) => {
      return +record.status !== 1 ? '--' : record.publishTs
    }
  }
])

const query = reactive({
  title: '',
  status: 1,
  publishTimeType: 0,
  pageSize: 10,
  pageNum: 1,
  ckey: ''
})
const tableData = ref([])
onMounted(async () => {
  await fetchTableData()
  getChamberOption()
})
watch(
  () => props.visible,
  async () => {
    await fetchTableData()
  }
)

const fetchFn = async pageOption => {
  rowSelection.selectedRowItems = []
  rowSelection.selectedRowKeys = []
  const conditionQuery = reactive({
    pageSize: pageOption.pageSize,
    page: pageOption.current,
    ...query,
    contentColumn: '',
    order: '',
    contentModuleId: '1'
  })
  const {
    data: { data }
  } = await getManagerList(conditionQuery)
  tableData.value = data.list
  return {
    total: data.totalRows
  }
}
const { pagination, fetchTableData, loading, handleTableChange } = useAntTable({ fetchFn })

const rowSelection = useRowSelection({ type: 'radio' })

const { proxy } = getCurrentInstance()
const onSubmit = () => {
  if (!rowSelection.selectedRowKeys.length) return proxy.$message.warning('请选择文章')
  emit('add', rowSelection.selectedRowItems[0])
  emit('update:visible', false)
}

const handleSearch = value => {
  value.ckey = value.chamberName
  value.chamberName = null
  if (!value.title) {
    value.title = ''
  }
  Object.assign(query, value)
  fetchTableData({ current: 1 })
}
</script>

<style lang="scss" scoped>
.p-main-padding {
  padding: 0;
}
</style>
