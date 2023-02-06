<template>
  <!-- <a-card>
    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane key="1" tab="凯迪云商会" />
      <a-tab-pane key="2" tab="Tab 2" />
      <a-tab-pane key="3" tab="Tab 3" />
    </a-tabs>
  </a-card> -->
  <PlusTable
    :columns="columns"
    :data-source="tableData"
    :scroll="{ x: 'max-content' }"
    row-key="id"
    :pagination="pagination"
    @change="handleTableChange"
    :request="handlerSearch"
  >
  </PlusTable>
</template>
<script>
import { useTableColumn } from './use/useTable'
import { getActivityApplyList } from '@/api/activity/activity-verify'
import { ref, reactive, computed, inject } from 'vue'
import { useRouter } from 'vue-router'

export default {
  setup() {
    const router = useRouter()
    const { columns, goVerifyDetail } = useTableColumn(router)
    const ckey = inject('ckey')
    const query = reactive({
      page: 1,
      pageSize: 10,
      total: 0,
      ckey: ckey.value,
      activityId: null,
      activityName: null,
      activityStatus: -1
    })
    const activeKey = ref('1')
    const tableData = ref([])
    const pagination = computed(() => {
      return {
        pageSize: query.pageSize,
        current: query.page,
        total: query.total
      }
    })
    // 拉取表格数据
    const getTableData = async () => {
      const params = {
        ...query
      }
      const { data } = await getActivityApplyList(params)
      tableData.value = data.list
      query.total = data.totalRows
    }
    const handleTableChange = async obj => {
      const { pageSize, current } = obj
      query.page = current
      query.pageSize = pageSize
      getTableData()
    }
    const handlerSearch = value => {
      query.page = 1
      Object.assign(query, { ...value })
      getTableData()
    }
    getTableData()
    return {
      router,
      columns,
      goVerifyDetail,
      getTableData,
      query,
      tableData,
      activeKey,
      handleTableChange,
      pagination,
      handlerSearch
    }
  }
}
</script>
