import { ref, reactive, inject, onMounted } from 'vue'
import { reauditList } from '@/api/member/manager'
import { useAntTable } from '@/use/useAntTable'
import { useRowSelection } from '@/use'
export function useTableData() {
  const tableFilter = reactive({
    auditStatus: 0
  })
  const ckey = inject('ckey')
  const tableData = ref([])
  const rowSelection = useRowSelection()
  const { pagination, handleTableChange, fetchTableData, loading } = useAntTable({
    fetchFn: async pageOption => {
      rowSelection.onChange([])
      const {
        data: {
          data: { list, totalRows }
        }
      } = await reauditList({
        ckey: ckey.value,
        ...tableFilter,
        pageSize: pageOption.pageSize,
        page: pageOption.current
      })
      tableData.value = list
      console.log('tableData.value', tableData.value)
      return {
        total: totalRows
      }
    }
  })
  const handleChange = value => {
    tableFilter.auditStatus = value
    fetchTableData(1)
  }

  onMounted(() => {
    fetchTableData()
  })

  return {
    tableData,
    tableFilter,
    pagination,
    rowSelection,
    loading,
    fetchTableData,
    handleTableChange,
    handleChange
  }
}
