<template>
  <PlusTable
    :scroll="{ x: 'max-content' }"
    row-key="id"
    :columns="columns"
    :data-source="tableData"
    :row-selection="rowSelection"
    :pagination="false"
    :loading="loading"
    :request="handleSearch"
  >
    <template #toolBar>
      <a-button danger class="mr-5" @click="$router.go(-1)">取消</a-button>
      <a-button type="primary" @click="handleAddbatch"><plus-outlined />批量添加</a-button>
    </template>
    <template #bodyCell="{ column, record }">
      <template v-if="column.dataIndex === 'demandId'">
        <div style="color: red">{{ record.id }}</div>
        <div class="ell2">{{ record.title }}</div>
      </template>
      <template v-if="column.dataIndex === 'publishInfo'">
        <div>{{ record.sourceInfo ? record.sourceInfo.userName : '' }}</div>
        <div>{{ $filters.dateFormat(record.createdTs) }}</div>
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
      <template v-if="column.dataIndex === 'action'">
        <a-button class="p0" type="link" @click="handleAdd([record.id])">添加</a-button>
      </template>
    </template>
  </PlusTable>
</template>

<script>
import { defineComponent, inject, ref } from 'vue'
import { useAntTable } from '@/use/useAntTable'
import { useRowSelection } from '@/use'
import { getSupplyDemandList, addHotSupplyDemand } from '@/api/home-update'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'

function useTable() {
  const tableFilter = {
    id: '',
    title: ''
  }
  const rowSelection = useRowSelection()

  const tableData = ref([])

  const { fetchTableData, loading } = useAntTable({
    async fetchFn() {
      const { data } = await getSupplyDemandList({
        status: 1,
        visibility: -1,
        pageSize: 100,
        pageNum: 1,
        readSort: 0,
        reportStatus: -1,
        collectSort: 0,
        chatSort: 0,
        freezeStatus: 1,
        deleteStatus: -1,
        publishTime: -1,
        isHot: 2,
        ...tableFilter
      })
      tableData.value = data.list || []
      return { total: data.totalRows }
    }
  })
  const handleSearch = value => {
    Object.assign(tableFilter, value)
    fetchTableData()
  }
  fetchTableData()

  return {
    rowSelection,
    fetchTableData,
    handleSearch,
    loading,
    tableData,
    columns: [
      {
        title: '供需ID',
        dataIndex: 'id',
        filter: true,
        hideInTable: true,
        valueType: 'text',
        formItemProps: {
          placeholder: '请输入'
        },
        span: 8
      },
      {
        title: '供需标题',
        dataIndex: 'title',
        filter: true,
        hideInTable: true,
        valueType: 'text',
        formItemProps: {
          placeholder: '关键词'
        },
        span: 8
      },
      { title: '供需ID/名称', dataIndex: 'demandId', width: 180 },
      { title: '发布信息', dataIndex: 'publishInfo' },
      { title: '供需状态', dataIndex: 'status', width: 140 },
      { title: '冻结状态', dataIndex: 'freezeStatus', width: 100 },
      { title: '操作', dataIndex: 'action', fixed: 'right', width: 100 }
    ]
  }
}

export default defineComponent({
  setup() {
    const table = useTable()
    const router = useRouter()
    const ckey = inject('ckey')

    // 执行添加
    async function handleAdd(demandIds) {
      const { state, msg } = await addHotSupplyDemand(demandIds, ckey.value)
      if (state !== 1) throw msg
      table.tableData.value = table.tableData.value.filter(v => !demandIds.includes(v.id))
    }

    // 执行批量添加
    async function handleAddbatch() {
      if (!table.rowSelection.selectedRowKeys.length) return message.warn('请勾选供需')
      await handleAdd(table.rowSelection.selectedRowKeys)
      router.go(-1)
    }

    return {
      ...table,
      handleAdd,
      handleAddbatch
    }
  }
})
</script>

<style lang="scss" scoped>
//
</style>
