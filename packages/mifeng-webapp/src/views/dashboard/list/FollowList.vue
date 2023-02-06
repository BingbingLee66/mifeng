<template>
  <PlusTable
    :columns="columns"
    :data-source="tableData"
    :scroll="{ x: 'max-content' }"
    row-key="id"
    :pagination="pagination"
    :request="handlerSearch"
    @change="handleTableChange"
  />
</template>
<script>
import { ref, reactive, computed, inject } from 'vue'
import { useTableClomn } from './use/useTable'
import { getFollowList } from '@/api/dashboard/index'
import { message } from 'ant-design-vue'
export default {
  setup() {
    const ckey = inject('ckey')
    const table = useTableClomn()
    const tableData = ref([])
    const query = reactive({
      page: 1,
      pageSize: 10,
      ckey: ckey.value,
      total: 0,
      type: 0
    })
    const pagination = computed(() => {
      return {
        pageSize: query.pageSize,
        current: query.page,
        total: query.total
      }
    })
    const fetchData = async () => {
      const { type, page, pageSize } = query
      const {
        data: { list, totalRows }
      } = await getFollowList({ type, page, pageSize })
      message.destroy()
      tableData.value = list
      query.total = totalRows
    }

    const handlerSearch = ({ type }) => {
      query.type = type
      fetchData()
    }

    const handleTableChange = ({ current, pageSize }) => {
      Object.assign(query, { page: current, pageSize })
      fetchData()
    }

    fetchData()

    return { ...table, tableData, pagination, handlerSearch, handleTableChange }
  }
}
</script>
