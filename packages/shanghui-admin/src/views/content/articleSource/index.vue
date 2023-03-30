<template>
  <PlusTable
    row-key="id"
    :loading="loading"
    :columns="columns"
    :data-source="tableData"
    :pagination="pagination"
    :request="handleSearch"
    @change="handleTableChange"
    bordered
  >
    <template #toolBar>
      <a-button type="primary" @click="addSource"><plus-outlined />添加来源</a-button>
    </template>
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'handle'">
        <a-button type="link" @click="addSource(record)"> 编辑 </a-button>
        <a-button v-if="record.status === SETUP_STSTUE_TYPEY.NORMAL" type="link" @click="updateState(record)">
          冻结
        </a-button>
        <a-button v-else type="link" @click="updateState(record)"> 解冻 </a-button>
      </template>
    </template>
  </PlusTable>
  <InputModel
    v-model:visible="addSourceVisiable"
    label="文章来源"
    title="添加/编辑栏目"
    :rules="sourceRules.source"
    :defaultValue="sourceVal"
    @ok="handleLevelOK"
  />
</template>

<script setup>
import PlusTable from '@business/components/src/plus-table/PlusTable.vue'
import InputModel from '@business/components/src/input-modal/index.vue'
import { ref, reactive, onMounted, getCurrentInstance } from 'vue'
import { useAntTable } from '@business/logics/src/useAntTable/index'
import { getList, save, updateStatus } from '@business/common/src/content/api/articleSource'
import { SETUP_STSTUE_TYPEY } from '../../../constant/content'
const columns = ref([
  {
    title: '文章来源',
    dataIndex: 'source',
    filter: true,
    valueType: 'text',
    formItemProps: {
      placeholder: '请输入文章来源'
    },
    width: 200
  },
  {
    title: '状态',
    dataIndex: 'status',
    filter: true,
    valueType: 'select',
    initialValue: -1,
    formItemProps: {
      options: [
        {
          value: -1,
          label: '全部'
        },
        {
          value: 0,
          label: '冻结'
        },
        {
          value: 1,
          label: '正常'
        }
      ]
    },
    customRender: ({ record }) => {
      return (
        <a-badge
          status={{ 0: 'error', 1: 'success' }[record.status]}
          text={{ 0: '已冻结', 1: '正常' }[record.status]}
        />
      )
    }
  },
  {
    title: '创建人',
    hideInTable: true,
    dataIndex: 'creator',
    filter: true,
    valueType: 'text',
    formItemProps: {
      placeholder: '请输入创建人'
    }
  },
  {
    title: '创建信息',
    customRender: ({ record }) => {
      return (
        <div>
          <div>{record.operator}</div>
          <div>{record.createdTs}</div>
        </div>
      )
    }
  },
  {
    title: '更新信息',
    customRender: ({ record }) => {
      return (
        <div>
          <div>{record.updater}</div>
          <div>{record.updatedTs}</div>
        </div>
      )
    }
  },
  {
    title: '操作',
    key: 'handle'
  }
])
const tableData = ref([])
const query = reactive({
  status: -1,
  source: null,
  creator: null
})
const { proxy } = getCurrentInstance()
const updateState = async record => {
  const params = {
    id: record.id,
    action: record.status === 0 ? 'active' : 'notactive'
  }
  await updateStatus(params)
  fetchTableData()
}

// 权重rule
const sourceRules = {
  source: [{ required: true, message: '文章来源不能为空', trigger: ['blur', 'change'] }]
}
const addSourceId = ref()
const sourceVal = ref()
const addSourceVisiable = ref(false)
const addSource = record => {
  addSourceId.value = record.id
  sourceVal.value = record.source
  addSourceVisiable.value = true
}

const handleLevelOK = async source => {
  const params = {
    id: addSourceId.value,
    source
  }
  await save(params)
  proxy.$message.success('修复权重成功')
  fetchTableData()
  addSourceVisiable.value = false
}

onMounted(async () => {
  await fetchTableData()
})
const fetchFn = async pageOption => {
  const conditionQuery = reactive({
    pageSize: pageOption.pageSize,
    page: pageOption.current,
    ...query
  })
  const {
    data: { data }
  } = await getList(conditionQuery)
  tableData.value = data.list
  return {
    total: data.totalRows
  }
}
const { pagination, fetchTableData, loading, handleTableChange } = useAntTable({ fetchFn })

const handleSearch = value => {
  Object.assign(query, value)
  fetchTableData({ current: 1 })
}
</script>
<style lang="scss" scoped></style>
