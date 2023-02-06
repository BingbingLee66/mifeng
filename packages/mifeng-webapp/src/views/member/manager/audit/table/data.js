import { ref, reactive, inject, onMounted } from 'vue'
import { auditList } from '@/api/member/manager'
import { useAntTable } from '@/use/useAntTable'
import { useRowSelection } from '@/use'
export function useTableData() {
  const tableFilter = reactive({
    auditStatus: 0,
    name: '',
    phone: '',
    type: '',
    uname: ''
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
      } = await auditList({
        ckey: ckey.value,
        ...tableFilter,
        pageSize: pageOption.pageSize,
        page: pageOption.current
      })
      tableData.value = list
      return {
        total: totalRows
      }
    }
  })
  const handleSearch = obj => {
    const { auditStatus, name, phone, type, uname } = obj
    tableFilter.auditStatus = auditStatus
    tableFilter.name = name
    tableFilter.phone = phone
    tableFilter.type = type
    tableFilter.uname = uname
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
    handleSearch,
    handleTableChange
  }
}
