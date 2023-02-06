<template>
  <PlusTable
    :scroll="{ x: 'max-content' }"
    row-key="id"
    :columns="columns"
    :data-source="tableData"
    :pagination="pagination"
    :loading="loading"
    :row-selection="rowSelection"
    @change="handleTableChange"
    :request="handlerSearch"
  >
    <template #searchToolBar>
      <a-button type="primary" html-type="submit">查询</a-button>
    </template>
    <template #toolBar>
      <!-- <a-button class="ml20" type="primary" danger @click="handleDel(rowSelection.selectedRowKeys)">移除</a-button> -->
      <a-button class="ml20" type="primary" @click="$router.push('/add-hot-demand')"
        ><plus-outlined />添加供需</a-button
      >
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
        <!-- {{ { 1: '生效中', 2: '已关闭(过期关闭)', 3: '已关闭(成功合作)', 4: '已关闭(终止对接)' }[record.status] }} -->
        <a-badge :status="HOT_DEMAND_STATUS_MAP.get(+record.status)" />
        {{ HOT_DEMAND_STATUS_LIST[record.status].label }}
      </template>
      <template v-if="column.dataIndex === 'freezeStatus'">
        <div v-if="!record.syncChamberVOList.some(v => v.ckey === ckey.value)">--</div>
        <div v-else-if="+record.freezeStatus === 1"><a-badge status="success" />正常</div>
        <div v-else-if="+record.freezeStatus === 2"><a-badge status="error" />平台冻结</div>
        <div v-else-if="+record.freezeStatus === 3"><a-badge status="error" />商会冻结</div>
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
        <a-button class="p0" type="link" @click="handleDel([record.id])" danger>移除</a-button>
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
import { defineAsyncComponent, defineComponent, inject, reactive, ref } from 'vue'
import { message, Modal } from 'ant-design-vue'
import { useAntTable } from '@/use/useAntTable'
import { useRowSelection } from '@/use'
import { useInputModal } from '@/components/InputModal/hooks'
import {
  HOT_DEMAND_STATUS_LIST,
  HOT_DEMAND_STATUS_MAP,
  HOT_DEMAND_FREEZE_STATUS_LIST,
  HOT_DEMAND_PUBLISH_TIME
} from '../constant.js'
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

  fetchTableData()
  const filterColumn = [
    {
      title: '供需标题',
      dataIndex: 'title',
      filter: true,
      hideInTable: true,
      valueType: 'text',
      span: 8,
      formItemProps: {
        placeholder: '关键词'
      }
    },
    {
      title: '供需id',
      dataIndex: 'id',
      filter: true,
      hideInTable: true,
      valueType: 'text',
      span: 8,
      formItemProps: {
        placeholder: '关键词'
      }
    },
    {
      title: '供需状态',
      dataIndex: 'status',
      filter: true,
      hideInTable: true,
      valueType: 'select',
      span: 8,
      formItemProps: {
        options: HOT_DEMAND_STATUS_LIST,
        placeholder: '请选择',
        defaultValue: 0
      }
    },
    {
      title: '冻结状态',
      dataIndex: 'publishStatus',
      filter: true,
      hideInTable: true,
      valueType: 'select',
      span: 8,
      formItemProps: {
        options: HOT_DEMAND_FREEZE_STATUS_LIST,
        placeholder: '请选择',
        defaultValue: 0
      }
    },
    {
      title: '发布时间',
      dataIndex: 'publishTime',
      filter: true,
      hideInTable: true,
      valueType: 'select',
      span: 8,
      formItemProps: {
        options: HOT_DEMAND_PUBLISH_TIME,
        placeholder: '请选择',
        defaultValue: 0
      }
    }
  ]
  const handlerSearch = value => {
    value.status = value.status || 0
    value.publishStatus = value.publishStatus || 0
    value.publishTime = value.publishTime || 0
    Object.assign(tableFilter, value)
    fetchTableData({ current: 1 })
  }
  return {
    tableFilter,
    columns: [
      ...filterColumn,
      { title: '供需ID/名称', dataIndex: 'demandId' },
      { title: '发布信息', dataIndex: 'publishInfo' },
      { title: '供需状态', dataIndex: 'status', width: 100 },
      { title: '冻结状态', dataIndex: 'freezeStatus', width: 100 },
      { title: '创建信息', dataIndex: 'createdInfo' },
      { title: '权重', dataIndex: 'weight', width: 80 },
      { title: '操作', dataIndex: 'action', fixed: 'right', width: 100 }
    ],
    tableData,
    fetchTableData,
    pagination,
    handleTableChange,
    rowSelection,
    loading,
    handlerSearch,
    HOT_DEMAND_STATUS_LIST,
    HOT_DEMAND_STATUS_MAP
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
    InputModal: defineAsyncComponent(() => import('@/components/InputModal'))
  },
  setup() {
    const table = useTable()
    // 移除热门供需
    const handleDel = useDelHotDeman(table.fetchTableData)

    return {
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

<style lang="scss" scoped>
.ell2 {
  @include ellipsis(2);
}
</style>
