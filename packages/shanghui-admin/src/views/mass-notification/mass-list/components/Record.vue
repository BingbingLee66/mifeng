<template>
  <a-modal :visible="dialogVisible" title="分配记录" width="900px" @cancel="handleClose">
    <PlusTable
      :scroll="{ x: 'max-content' }"
      :columns="columns"
      :data-source="tableData"
      :pagination="pagination"
      :loading="loading"
      @change="handleTableChange"
      :request="handlerSearch"
      class="p0"
    >
      <template #bodyCell="{ record, column }">
        <template v-if="column.dataIndex === 'createdTs'">
          {{ record.creator }}
          {{ $filters.dateFormat(record.createdTs, 'YYYY-MM-DD HH:mm:ss') }}
        </template>
      </template>
    </PlusTable>
    <template #footer>
      <a-button type="primary" @click="handleClose">我知道了</a-button>
    </template>
  </a-modal>
</template>
<script>
import { reactive, ref } from 'vue'
import { useAntTable } from '@business/logics/src/useAntTable/index'
import dayjs from 'dayjs'
import { distributionList } from '@business/common/src/mass-notification/api/index'
export default {
  setup() {
    const dialogVisible = ref(false)
    const columns = [
      {
        dataIndex: 'createdTs',
        title: '分配时间',
        filter: true,
        valueType: 'dateTimeRange',
        span: 16,
        defaultValue: [],
        formItemProps: {
          valueFormat: 'YYYY-MM-DD HH:mm:ss',
          format: 'YYYY-MM-DD HH:mm:ss',
          showTime: true
        }
      },
      {
        dataIndex: 'distributionSum',
        title: '分配数量'
      },
      {
        dataIndex: 'remainSum',
        title: '分配后剩余短信总数'
      }
    ]
    const tableFilter = reactive({
      id: null,
      startTime: '',
      endTime: ''
    })
    const handlerSearch = form => {
      tableFilter.startTime = form.createdTs && form.createdTs[0] ? dayjs(form.createdTs[0]).valueOf() : ''
      tableFilter.endTime = form.createdTs && form.createdTs[0] ? dayjs(form.createdTs[1]).valueOf() : ''
      fetchTableData(true)
    }
    const tableData = ref([])
    const { pagination, handleTableChange, fetchTableData, loading } = useAntTable({
      fetchFn: async pageOption => {
        const condition = {
          pageSize: pageOption.pageSize,
          page: pageOption.current,
          ...tableFilter
        }
        const {
          data: { list, totalRows }
        } = await distributionList(condition)
        tableData.value = list
        return {
          total: totalRows
        }
      }
    })
    const show = row => {
      tableFilter.id = row.id
      fetchTableData()
      dialogVisible.value = true
    }
    const handleClose = () => {
      dialogVisible.value = false
    }
    return {
      dialogVisible,
      show,
      pagination,
      handleTableChange,
      loading,
      columns,
      tableData,
      handleClose,
      handlerSearch
    }
  }
}
</script>
