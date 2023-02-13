import { ref, computed, inject } from 'vue'
import { NOTIFICATION_TYPE, SEND_TYPE } from '@/constant/mass-notification'
// import { useRouter } from 'vue-router'
import dayjs from 'dayjs'
import { useRouter } from 'vue-router'
import { updateSendGetDetail, sendMsg } from '@/api/mass-notification/index'
import { Message } from 'ant-design-vue'
/**
 * 处理创建、更新表单逻辑
 * @param formState
 */
export function useSubmitData(formState) {
  const submitLoading = ref(false)
  const ckey = inject('ckey')
  const router = useRouter()
  /** 新建表单 */
  const params = computed(() => {
    const {
      type: noticeTypeId,
      receive: receiveTypeId,
      sendTs,
      sendType,
      receiverRemove,
      activityData,
      posterId,
      receiverList,
      title,
      content,
      imgs,
      synchChannels,
      activityChannels,
      id,
      receiverList_phone_type,
      questionnaire
    } = formState
    const obj = {
      ckey: ckey.value,
      noticeTypeId,
      receiveTypeId,
      sendType,
      // 组装渠道数据
      channelTypeTemplateDTOS: synchChannels.map(item => {
        if (!activityChannels[item]) {
          Message.error('勾选渠道后请选择模板')
          throw Error('勾选渠道后请选择模板')
        }
        return { channelTypeId: item, id: activityChannels[item] }
      }),
      receiverRemove: receiverRemove ? 1 : 2
    }
    if (sendType === SEND_TYPE.TIMING) obj.sendTs = dayjs(sendTs).valueOf()
    obj.extend = { receiverList: receiverList.map(item => ({ id: item })) }
    if (noticeTypeId === NOTIFICATION_TYPE.ACTIVITY || noticeTypeId === NOTIFICATION_TYPE.INVESTMENT) {
      Object.assign(obj.extend, { associationId: activityData.id, activityName: activityData.activityName })
    }
    if (noticeTypeId === NOTIFICATION_TYPE.POSTER) {
      Object.assign(obj.extend, { associationId: posterId })
    }
    if (noticeTypeId === NOTIFICATION_TYPE.CUSTOM) {
      Object.assign(obj.extend, { title, content, imgs: imgs.map(item => item.url) })
    }
    if (noticeTypeId === NOTIFICATION_TYPE.QUESTIONNAIRE) {
      Object.assign(obj.extend, {
        associationId: questionnaire.id,
        questionnaireTitle: questionnaire.title,
        phoneType: receiverList_phone_type || 'input'
      })
    }
    // 编辑
    if (id) obj.id = id
    return obj
  })

  const handleSubmit = async isEdit => {
    submitLoading.value = true
    let API = sendMsg
    if (isEdit) {
      API = updateSendGetDetail
    }
    try {
      await API(params.value)
      router.push('/mass-notification/mass-list')
    } catch (error) {}
    submitLoading.value = false
  }
  return {
    handleSubmit,
    submitLoading
  }
}
