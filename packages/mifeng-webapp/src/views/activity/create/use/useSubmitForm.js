import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import store from '@/store'
import { createActivity, getLinkPowerChamberCkeys, getActivityList } from '@/api/activity/activity'
import { DataCollect } from '@/utils/data-collect'
import { PUBLISH_TYPE } from '@/constant/activity'

const throttle = (fn, delay = 3000) => {
  let oldNow = Date.now()
  return function (...args) {
    const currNow = Date.now()
    if (currNow - oldNow < delay) return
    oldNow = currNow
    fn.call(this, ...args)
  }
}

// 提交创建活动表单
export function useSubmitForm(formState, roleIds, ckey, activityId, valueTree, portValue, arrayData) {
  const ruleCkeys = ref([]) // 直播活动ckey
  const router = useRouter()
  const route = useRoute()
  const type = computed(() => {
    return route.query.type || ''
  })
  const getRuleCkeys = async () => {
    const { data, state } = await getLinkPowerChamberCkeys()
    if (state === 1) {
      ruleCkeys.value = data
    }
  }
  getRuleCkeys()
  const onSave = throttle(async (e, lastPublishStatus) => {
    formState.value.isPublish = e

    // 扩展功能
    roleIds.value.forEach(v => {
      if (+v === 1) formState.value.extraSignin = 1
      if (+v === 2) formState.value.extraSignout = 1
      if (+v === 3) formState.value.extraSeat = 1
    })
    // 转为时间戳
    if (formState.value.liveCloseTime) {
      const date = new Date(formState.value.liveCloseTime)
      formState.value.liveEntranceCloseTime = date.getTime()
    }
    formState.value.ckey = ckey.value

    // 活动时间
    if (formState.value.date && formState.value.date.length > 0) {
      formState.value.activityStartTime = new Date(formState.value.date[0]).getTime()
      formState.value.activityEndTime = new Date(formState.value.date[1]).getTime()
    } else {
      formState.value.activityStartTime = null
      formState.value.activityEndTime = null
    }

    // 报名时间
    if (formState.value.applyDate && formState.value.applyDate.length > 0) {
      formState.value.applyStartTime = new Date(formState.value.applyDate[0]).getTime()
      formState.value.applyEndTime = new Date(formState.value.applyDate[1]).getTime()
    } else {
      formState.value.applyStartTime = null
      formState.value.applyEndTime = null
    }

    if (activityId.value) {
      formState.value.id = activityId.value
    }
    if (valueTree.value.length > 0) {
      formState.value.applyIds = valueTree.value.join(',')
    }
    if (portValue.value.length > 0) {
      formState.value.applyIds = portValue.value.join(',')
    }

    if (arrayData.value.length > 0) {
      formState.value.dtos = arrayData.value
    }
    if (formState.value.competence) {
      formState.value.competence = Number(formState.value.competence)
    }
    // 如果地址没选则去除地址信息
    if (formState.value.addressInfo === '') {
      formState.value.province = ''
      formState.value.city = ''
      formState.value.area = ''
      formState.value.longitude = ''
      formState.value.latitude = ''
    }

    if (!formState.value.activityGuestsDTOList) {
      formState.value.activityGuestsDTOList = []
    }

    const params = {
      ...formState.value,
      headImage: formState.value.headImage[0]?.url || '',
      listImage: formState.value.listImage[0]?.url || ''
    }

    if (!(ruleCkeys.value.includes(ckey.value) || !ckey.value) || !formState.value.link?.trim()) {
      delete params.liveEntranceDisplayType
      delete params.liveEntranceCloseTime
    }

    if (formState.value.cardShow === 0) {
      params.cardShowType = 0
    }
    params.canReplaceApply = formState.value.canReplaceApply
    delete params.cardShow

    try {
      await createActivity(params)
      track(params, params.isPublish, lastPublishStatus)
      router.push({
        name: '活动列表',
        params: {
          type: activityId.value ? type.value : e
        }
      })
    } catch (error) {}
  })

  return {
    ruleCkeys,
    onSave
  }
}

export async function track(params, isPublish, lastPublishStatus) {
  try {
    // 检索刚创建的活动
    const isPublished = isPublish
    const activityStartTime = params.activityStartTime + ''
    const createdTime = new Date().getTime() + 30000
    const title = params.activityName
    const getActivityListParams = {
      page: 1,
      pageSize: 20,
      activityName: title,
      isPublish: isPublished ? PUBLISH_TYPE.PUBLISHED : PUBLISH_TYPE.UN_PUBLISH,
      ckey: store.state.user.ckey
    }
    const { data } = await getActivityList(getActivityListParams)
    const list = Array.isArray(data.list) ? data.list : []
    const filterList = list.filter(item => {
      return title === item.activityName && activityStartTime === item.startTime && createdTime > item.createdTs
    })
    const id = filterList.length > 0 ? filterList[0].id : params.id
    // 数据采集上报
    const isPublishNew = isPublished && !params.id
    const isPublishDraft = isPublished && !lastPublishStatus && params.id
    if (isPublishNew || isPublishDraft) {
      DataCollect.Activity.publish({ store, activity: { id, title } })
    } else if (!params.id) {
      DataCollect.Activity.saveDraft({ store, activity: { id, title } })
    }
  } catch (error) {
    console.log(error)
  }
}
