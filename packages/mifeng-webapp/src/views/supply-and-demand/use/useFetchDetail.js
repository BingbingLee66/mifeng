import { computed } from 'vue'
import dayjs from 'dayjs'
/**
 * 获取信息详情逻辑
 * @param formState
 * @param detail
 */
export function useFetchDetail(formState, detail) {
  const isEdit = computed(() => !!detail && !!detail.dynamicWxUserVO)
  const fetchDetail = () => {
    const {
      chamberVOList = [],
      dynamicWxUserVO = {},
      yshContentEditVO: {
        id,
        tarType,
        content,
        validType,
        validEndTs,
        title,
        labelVOList,
        tradeVOList,
        city,
        province
      } = {}
    } = detail
    formState.value = {
      id,
      content, // 供需内容
      tarType, // 供应: 1 or 需求: 2
      validType, // 长期有效: 1  自定义时间: 2
      title, // 供需标题
      publisherList: [dynamicWxUserVO], // 发布人列表
      supplyLableList: labelVOList, // 供需标签
      industryLableList: tradeVOList.map(v => v.id), // 行业标签
      publisherStationList: [`${city.code}-${province.code}`], // 发布者常驻地
      date: validEndTs ? dayjs(+validEndTs).format('YYYY-MM-DDTHH:mm:ss') : '',
      chamberIds: chamberVOList.map(v => v.id) // 已选择商协会
    }
  }
  if (detail) fetchDetail()

  return {
    isEdit,

    fetchDetail
  }
}
