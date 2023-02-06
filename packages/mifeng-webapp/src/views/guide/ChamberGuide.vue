<template>
  <PlusTable
    headerTitle="热门供需"
    :row-selection="rowSelection"
    :columns="columns"
    :data-source="tableData"
    :scroll="{ x: 'max-content' }"
    row-key="id"
    :pagination="pagination"
    :loading="loading"
    @change="handleTableChange"
    :request="handlerSearch"
  >
    <template #toolBar>
      <a-button class="ml20" danger @click="handleDel(rowSelection.selectedRowKeys)">移除</a-button>
      <a-button class="ml20" type="primary" @click="$router.push('/add-hot-demand')">添加供需</a-button>
    </template>
    <template #bodyCell="{ column, record }">
      <template v-if="column.dataIndex === 'demandId'">
        <div style="color: red">{{ record.demandId }}</div>
        <div class="ell2">{{ record.title }}</div>
      </template>
      <template v-if="column.dataIndex === 'publishInfo'">
        <div>{{ record.publishName }}</div>
        <div>{{ $filters.dateFormat(record.publishTime) }}</div>
      </template>
      <template v-if="column.dataIndex === 'status'">
        {{ { 1: '生效中', 2: '已关闭(过期关闭)', 3: '已关闭(成功合作)', 4: '已关闭(终止对接)' }[record.status] }}
      </template>
      <template v-if="column.dataIndex === 'freezeStatus'">
        <div v-if="!record.syncChamberVOList.some(v => v.ckey === ckey.value)">--</div>
        <div v-else-if="+record.freezeStatus === 1">正常</div>
        <div v-else-if="+record.freezeStatus === 2">平台冻结</div>
        <div v-else-if="+record.freezeStatus === 3">商会冻结</div>
      </template>
      <template v-if="column.dataIndex === 'createdInfo'">
        <div>{{ record.operatorName }}</div>
        <div>{{ $filters.dateFormat(record.createdTs) }}</div>
      </template>
      <template v-if="column.dataIndex === 'weight'">
        <a-button class="p0" type="link" @click="openInputModal({ defaultValue: record.weight, payload: record })">
          {{ record.weight }}
        </a-button>
      </template>
      <template v-if="column.dataIndex === 'action'">
        <a-button class="p0" type="link" @click="handleDel([record.id])">移除</a-button>
      </template>
    </template>
  </PlusTable>
  <InputModal
    v-model:visible="visible"
    title="编辑权重"
    label="权重"
    :defaultValue="defaultValue"
    :confirmLoading="confirmLoading"
    :rules="inputModalRules"
    @ok="handleOk"
  />
</template>

<script>
import PlusTable from '@/components/plusTable/PlusTable.vue'
import { defineAsyncComponent, defineComponent, inject, ref, reactive } from 'vue'
import { message, Modal } from 'ant-design-vue'
import { useAntTable } from '@/use/useAntTable'
import { useRowSelection } from '@/use'
import { useInputModal } from '@/components/InputModal/hooks'
import { HOT_DEMAND_STATUS_LIST, HOT_DEMAND_FREEZE_STATUS_LIST, HOT_DEMAND_PUBLISH_TIME } from '../home-update/constant'
import { getHotDemandList, deleteHotSupplyDemand, modifyDemandWeight } from '@/api/home-update'

export function useTable() {
  const ckey = inject('ckey')

  const tableFilter = reactive({
    title: '',
    status: 0,
    publishStatus: 0,
    publishTime: 0,
    id: ''
  })

  const rowSelection = useRowSelection()

  const tableData = ref([])

  const { fetchTableData, pagination, handleTableChange, loading } = useAntTable({
    async fetchFn({ current, pageSize }) {
      rowSelection.onChange([]) // 拉取表格数据之前清空选中
      const { data } = await getHotDemandList({
        ...tableFilter,
        pageNum: current,
        pageSize,
        ckey: ckey.value
      })
      tableData.value = data.list || []
      return { total: data.totalRows || 0 }
    }
  })
  const handlerSearch = value => {
    console.log('data:', value)
    Object.assign(tableFilter, value)
    fetchTableData()
  }
  fetchTableData()

  return {
    handlerSearch,
    tableFilter,
    columns: [
      {
        title: '供需标题',
        dataIndex: 'title',
        filter: true,
        hideInTable: true,
        valueType: 'text',
        formItemProps: {
          placeholder: '啦啦啦'
        }
      },
      {
        title: '供需状态',
        dataIndex: 'status',
        filter: true,
        valueType: 'select',
        initialValue: 0,
        formItemProps: { options: HOT_DEMAND_STATUS_LIST }
      },
      { title: '供需ID/名称', dataIndex: 'demandId' },
      { title: '发布信息', dataIndex: 'publishInfo' },
      { title: '供需状态', dataIndex: 'status' },
      {
        title: '冻结状态',
        dataIndex: 'freezeStatus',
        filter: true,
        valueType: 'select',
        formItemProps: { options: HOT_DEMAND_FREEZE_STATUS_LIST }
      },
      {
        title: '发布时间',
        dataIndex: 'publishTime',
        filter: true,
        valueType: 'dateTimeRange',
        formItemProps: { valueFormat: 'YYYY-MM-DD' }
      },
      { title: '供需ID', dataIndex: 'demandId', filter: true, valueType: 'text' },
      { title: '创建信息', dataIndex: 'createdInfo' },
      { title: '权重', dataIndex: 'weight' },
      { title: '操作', dataIndex: 'action', fixed: 'right', width: 100 }
    ],
    tableData,
    fetchTableData,
    pagination,
    handleTableChange,
    rowSelection,
    loading
  }
}

// 移除热门供需
function useDelHotDeman(cb = () => {}) {
  return function handleDel(demandIds = []) {
    if (!demandIds.length) return message.warn('请勾选移除供需')
    Modal.confirm({
      title: '确认将供需从热门供需中移出？',
      content: '移除后，该供需将不再展示在热门供需板块，不影响在其他页面展示',
      async onOk() {
        const { state, msg } = await deleteHotSupplyDemand(demandIds)
        if (state !== 1) throw msg
        cb()
      }
    })
  }
}

export default defineComponent({
  components: {
    InputModal: defineAsyncComponent(() => import('@/components/InputModal')),
    PlusTable
  },
  setup() {
    const table = useTable()
    // 移除热门供需
    const handleDel = useDelHotDeman(table.fetchTableData)

    return {
      HOT_DEMAND_STATUS_LIST,
      HOT_DEMAND_FREEZE_STATUS_LIST,
      HOT_DEMAND_PUBLISH_TIME,
      ...table,
      handleDel,
      ...useInputModal({
        async handleOk(value, payload) {
          const { state, msg } = await modifyDemandWeight({ id: payload.id, value })
          if (state !== 1) throw msg
          payload.weight = value
        },
        inputModalRules: [
          { required: true, message: '请输入权重', trigger: 'blur' },
          { pattern: /^[\d]{0,3}$/, message: '请输入0-999数字', trigger: ['blur', 'change'] }
        ]
      })
    }
  }
})
</script>
