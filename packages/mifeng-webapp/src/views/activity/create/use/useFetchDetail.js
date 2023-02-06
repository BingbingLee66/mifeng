import { ref, reactive, watch } from 'vue'
import dayjs from 'dayjs'
import { getActivity } from '@/api/activity/activity'

// 获取活动详情
export function useFetchDetail(formState, activityId, baseInfoRef, activeName) {
  const status = ref(1) // 编辑字段限制标识
  const roleIds = ref([]) // 多选框 扩展功能
  const applyObject = reactive({
    unlimit: true,
    limit: false,
    port: false,
    department: false
  }) // 是否限制报名对象
  const portValue = ref([]) // 会内职位
  const valueTree = ref([]) // 树形下拉框值
  const applyCount = reactive({
    unlimit: true,
    limit: false
  }) // 是否限制报名人数
  const auditStatus = reactive({
    unlimit: true,
    limit: false
  }) // 是否报名审核
  const arrayData = ref([]) // 自定义报名信息列表
  const disabledGuestBtn = ref(true)
  watch(
    () => arrayData.value,
    val => {
      if (activeName.value === '2') {
        disabledGuestBtn.value = !val.length
      }
    },
    { deep: true }
  )

  const formatDate = date => {
    if (typeof date !== 'string' && typeof date !== 'number') return ''
    return dayjs(Number(date)).format('YYYY-MM-DD HH:mm:ss')
  }

  const fetchDetail = () => {
    getActivity({ id: activityId.value }).then(res => {
      const resData = res.data
      status.value = resData.status
      formState.value.activityName = resData.activityName
      formState.value.headImage = [{ url: resData.headImage }]
      formState.value.listImage = [{ url: resData.listImage }]

      if (resData.startTime && resData.endTime) {
        formState.value.date = [formatDate(resData.startTime), formatDate(resData.endTime)]
      }

      if (resData.applyStartTime && resData.applyEndTime) {
        formState.value.applyDate = [formatDate(resData.applyStartTime), formatDate(resData.applyEndTime)]
      }

      //  扩展功能
      if (+resData.extraSignin === 1) roleIds.value.push(1)
      if (+resData.extraSignout === 1) roleIds.value.push(2)
      if (+resData.extraSeat === 1) roleIds.value.push(3)

      // 活动地点回显
      formState.value.province = resData.province
      formState.value.city = resData.city
      formState.value.area = resData.area
      formState.value.addressInfo = resData.addressInfo
      formState.value.title = resData.addressInfo
      formState.value.authAlbum = resData.authAlbum
      formState.value.applyCountShow = resData.applyCountShow
      formState.value.liveEntranceDisplayType = resData.liveEntranceDisplayType
      formState.value.liveEntranceCloseTime = resData.liveEntranceCloseTime
      formState.value.liveCloseTime = dayjs(Number(resData.liveEntranceCloseTime)).format('YYYY-MM-DD HH:mm:ss')
      formState.value.district = resData.area

      formState.value.signType = resData.signType
      formState.value.signNeedCard = resData.signNeedCard
      formState.value.cardShowType = resData.cardShowType
      formState.value.cardInfoType = resData.cardInfoType
      formState.value.labels = resData.labels
      formState.value.arriveType = resData.arriveType
      formState.value.linkType = resData.linkType || 1
      formState.value.canReplaceApply = resData.canReplaceApply

      // 活动附件回显
      formState.value.attachment = resData.attachment.map(m => {
        return { name: m.fileName, attachment: m.attachment, fileName: m.fileName }
      })
      if (resData.longitude) formState.value.longitude = resData.longitude
      if (resData.latitude) formState.value.latitude = resData.latitude

      // 报名对象回显
      applyObject.limit = false
      applyObject.unlimit = false
      applyObject.department = false
      applyObject.port = false
      portValue.value = []
      valueTree.value = []
      if (resData.applyObject === 0) {
        applyObject.unlimit = true
        formState.value.applyObject = 0
      } else if (resData.applyObject === 1) {
        applyObject.limit = true
        formState.value.applyObject = 1
      } else if (resData.applyObject === 2) {
        applyObject.port = true
        formState.value.applyObject = 2
        portValue.value = resData.applyIdsArray
      } else {
        applyObject.department = true
        formState.value.applyObject = 3
        valueTree.value = resData.applyIdsArray
      }
      // 参加人数回显
      if (resData.isLimit === 0) {
        applyCount.unlimit = true
        applyCount.limit = false
        formState.value.isLimit = 0
      } else {
        applyCount.unlimit = false
        applyCount.limit = true
        formState.value.isLimit = 1
        formState.value.applyCount = resData.applyCount
      }

      // 报名审核
      if (resData.auditStatus === 1) {
        auditStatus.unlimit = false
        auditStatus.limit = true
      }
      formState.value.auditStatus = resData.auditStatus
      formState.value.link = resData.link
      formState.value.competence = resData.competence + ''

      if (resData.longitude || resData.latitude) {
        setTimeout(() => {
          baseInfoRef.value.onSelectAddress(formState.value)
        }, 200)
      }

      // 活动介绍回显
      // tips：这里直接赋值wangEditor莫名的watch监听不到，故加了个setTimeout
      setTimeout(() => {
        formState.value.introduce = resData.introduce
      })

      if (resData.cardShowType === 0) {
        formState.value.cardShow = 0
      } else {
        formState.value.cardShow = 1
      }

      // 动态字段回显
      // arrayData.value = resData.dtos.map(({title, msgAlert, lengthLimit, check}) => ({title, msgAlert, lengthLimit, check}));

      arrayData.value = resData.dtos.map(({ title, msgAlert, lengthLimit, check, type, selects, key }) => ({
        title,
        msgAlert,
        lengthLimit,
        check,
        type,
        selects,
        key
      }))
      arrayData.value.forEach(v => {
        //  0 : 输入框  1：下拉框
        if (+v.type === 1) {
          v.msgAlert = ''
          const key = []
          v.selects.forEach(j => {
            key.push(j.value)
          })
          v.key = key.join(';')
        }
      })

      disabledGuestBtn.value = +formState.value.signType === 0 && !arrayData.value.length
    })
  }

  return {
    status,
    roleIds,
    applyObject,
    portValue,
    valueTree,
    applyCount,
    auditStatus,
    arrayData,
    disabledGuestBtn,

    fetchDetail
  }
}
