import cloneDeep from 'lodash/cloneDeep'

/**
 * 用于重置 表格的筛选项，传入的 filters 是初始值，调用 resetFilters 会重置回初始值
 * @param filters
 * @param callback
 */
export function useResetFilter(filters, callback) {
  const originFilters = {}
  Object.keys(filters).forEach(key => {
    originFilters[key] = cloneDeep(filters[key].value)
  })

  const resetFilters = () => {
    Object.keys(filters).forEach(key => {
      filters[key].value = originFilters[key]
    })

    callback && callback()
  }

  return {
    resetFilters
  }
}
