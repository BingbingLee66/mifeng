import { ref } from 'vue'
import dayjs from 'dayjs'
import { sendDetail } from '@/api/mass-notification/index'
import { NOTIFICATION_TYPE, SEND_TYPE } from '@/constant/mass-notification'
/**
 * 获取信息详情逻辑
 * @param formState
 * @param detail
 */
export function useFetchDetail(formState, ID, receiverList) {
  const fetchLoading = ref(false)
  const isEdit = ref(!!ID)
  const fetchDetail = async () => {
    fetchLoading.value = true
    try {
      const { data } = await sendDetail(ID)
      const { sendTs, extend, noticeTypeId: type, receiveTypeId: receive, sendType, channelTypeTemplateDTOS } = data
      formState.id = ID
      formState.type = type
      formState.receive = receive
      // 同步渠道回显
      if (channelTypeTemplateDTOS) {
        channelTypeTemplateDTOS.forEach(item => {
          formState.synchChannels.push(item.channelTypeId)
          formState.activityChannels[item.channelTypeId] = item.id
        })
      }
      formState.sendType = sendType
      if (sendType === SEND_TYPE.TIMING) formState.sendTs = dayjs(+sendTs).format('YYYY-MM-DD HH:mm:ss')
      receiverList.value = extend.receiverList.map(item => item.id)
      formState.receiverList_phone_type = extend.phoneType || 'input'
      // 当通知类型为2时，{'associationId': 活动id},当通知类型为3时，{'associationId': 招商活动id}
      if (type === NOTIFICATION_TYPE.ACTIVITY || type === NOTIFICATION_TYPE.INVESTMENT) {
        // 回显活动数据
        formState.activityData = { id: extend.associationId, activityName: extend.activityName }
      } else if (type === NOTIFICATION_TYPE.CUSTOM) {
        formState.title = extend.title
        formState.content = extend.content
        formState.imgs = extend.imgs.map(item => ({ url: item }))
      } else if (type === NOTIFICATION_TYPE.QUESTIONNAIRE) {
        formState.questionnaire = { id: extend.associationId, title: extend.questionnaireTitle }
      }
    } catch (error) {}
    fetchLoading.value = false
  }
  return {
    fetchDetail,
    fetchLoading,
    isEdit
  }
}
