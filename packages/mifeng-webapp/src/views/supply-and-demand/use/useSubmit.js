import { computed, ref, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'

import { publishSupplyDemand, updateSupplyDemand } from '@/api/home/supplyDemandManager'
import dayjs from 'dayjs'
/**
 * 处理创建、更新表单逻辑
 * @param formState
 */
export function useSubmitInfoForm(formState) {
  const submitLoading = ref(false)
  const router = useRouter()
  const emit = getCurrentInstance()?.emit
  const params = computed(() => {
    const {
      id,
      content,
      tarType,
      validType,
      title,
      publisherList,
      supplyLableList,
      industryLableList,
      publisherStationList,
      chamberIds,
      date
    } = formState.value
    const [city, province] = publisherStationList[0].split('-')
    const obj = {
      city,
      content,
      labelIds: supplyLableList.map(v => v.id),
      province,
      tarType,
      title,
      tradeIds: industryLableList,
      type: 2,
      chamberIds,
      userId: publisherList[0].wxUserId,
      validEndTs: date ? dayjs(date).valueOf() : undefined,
      validType
    }
    if (id) obj.id = formState.value.id
    return obj
  })

  const handleSubmit = async isEdit => {
    emit('processParams', params.value, async () => {
      let API = publishSupplyDemand
      if (isEdit) API = updateSupplyDemand
      submitLoading.value = true
      try {
        await API(params.value)
        router.push({ path: '/management' })
      } catch (error) {}
      submitLoading.value = false
    })
  }

  return {
    handleSubmit,
    submitLoading
  }
}
