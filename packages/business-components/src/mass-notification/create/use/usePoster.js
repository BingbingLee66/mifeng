import { watch, reactive, unref, ref } from 'vue'
import { queryPosterDetail, queryPosterList } from '@business/common/src/content/api/poster'

/**
 * 海报详情相关逻辑
 *  */
export const usePosterDetail = id => {
  const posterId = unref(id)
  const poster = reactive({})

  const getPosterDetail = async posterId => {
    if (!posterId) return
    const { data } = await queryPosterDetail(posterId)
    Object.assign(poster, data)
    return poster
  }

  watch(
    () => posterId,
    id => {
      getPosterDetail(id)
    },
    {
      immediate: true
    }
  )

  return {
    poster
  }
}

/**
 * 海报列表相关接口
 */
export const usePosterList = (query = ref({ page: 1, pageSize: 10, title: '' })) => {
  const list = ref([])
  query = unref(query)
  const getPosterList = async () => {
    const { data } = await queryPosterList(query)
    list.value = data.records
    query.total = data.total
  }
  watch([() => query.page, () => query.title], getPosterList, { immediate: true })
  return { list, query }
}
