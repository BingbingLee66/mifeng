import { computed, ref, watch } from 'vue'

/**
 * @description: 整合了ant-design-vue 中 table 组件的使用逻辑。让开发人员只关注表格数据的请求方式，简化其他的逻辑编写
 * @return {*}
 * @param params
 * fetchFn: {
 *   (
 *     pager: {
 *       current: number
 *       pageSize: number
 *     },
 *     filters: any,
 *     sorter: any,
 *   ): Promise<{
 *     total: number
 *   }>
 * loading: Boolean
 * defaultPageSize: number
 * defaultPageNo: number
 * customPaginationConfig: {}
 */

export function useAntTable(params) {
  const {
    fetchFn,
    loading: customLoading,
    defaultPageSize = 10,
    defaultPageNo = 1,
    customPaginationConfig = {}
  } = params

  const loading = ref(false)
  if (customLoading) {
    watch(loading, val => {
      customLoading.value = val
    })
  }

  const total = ref(0)

  const pageSize = ref(defaultPageSize)

  const current = ref(defaultPageNo)

  const filters = ref({})

  const sorter = ref({})

  // 每页记录切换器数量选项
  const pageSizeOptions = ['5', '10', '20', '30', '40']

  const pagination = computed(() => {
    return {
      total: total.value,
      current: current.value,
      pageSize: pageSize.value,
      // size: 'small',
      pageSizeOptions,
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `共 ${total} 项`,
      ...customPaginationConfig
    }
  })

  const fetchTableData = async isReset => {
    if (isReset) {
      current.value = 1
    }

    try {
      loading.value = true
      const res = await fetchFn({ current: current.value, pageSize: pageSize.value }, filters.value, sorter.value)

      total.value = res.total

      return res
    } catch (e) {
      return Promise.reject(e)
    } finally {
      loading.value = false
    }
  }

  const handleTableChange = async (pagination, filtersData, sorterData) => {
    filters.value = filtersData
    sorter.value = sorterData
    current.value = pagination.current
    pageSize.value = pagination.pageSize

    try {
      await fetchTableData(pageSize.value !== pagination.pageSize)
    } catch (e) {
      return Promise.reject(e)
    }
  }

  return {
    total,
    pageSize,
    current,
    pagination,
    loading,
    filters,
    sorter,
    handleTableChange,
    fetchTableData
  }
}
