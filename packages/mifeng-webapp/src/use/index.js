import { reactive, toRefs } from 'vue'
import { useResetFilter } from '@/use/useResetFilter'

// 数据查询筛选
export function useTableFilter(filterObj) {
  const tableFilter = reactive(filterObj)
  const { resetFilters } = useResetFilter({ ...toRefs(tableFilter) })
  return { tableFilter, resetFilters }
}

// 表格行数据选中
export function useRowSelection(extension = {}) {
  const rowSelection = reactive({
    fixed: true,
    selectedRowKeys: [],
    selectedRowItems: [],
    onChange(selectedRowKeys, selectedRowItems) {
      rowSelection.selectedRowKeys = selectedRowKeys
      rowSelection.selectedRowItems = selectedRowItems
    },
    ...extension
  })
  return rowSelection
}
