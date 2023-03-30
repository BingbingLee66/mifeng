<template>
  <ActivityList :inherited-columns="tableColumns" />
</template>
<script setup>
import { reactive } from 'vue'
import { APPLY_OBJECT_TYPE } from '@business/common/src/activity/constant'
import ActivityList from '@business/components/src/activity/ActivityList.vue'
import { getActivitySource } from '@/api/activity/activity'
const chamberOptions = reactive([])
const getChamberOptions = async () => {
  const { data } = await getActivitySource()
  chamberOptions.push(...data)
}
const tableColumns = [
  {
    title: '活动来源',
    dataIndex: 'ckey',
    filter: true,
    valueType: 'select',
    span: 6,
    formItemProps: {
      options: chamberOptions,
      fieldNames: { label: 'name', value: 'ckey' }
    },
    customRender: ({ record: { chamberName } }) => {
      return <div>{chamberName === null ? '凯迪云商会' : chamberName}</div>
    },
    width: 100
  },
  {
    title: '报名对象',
    dataIndex: 'applyObject',
    customRender: ({ record: { applyObject, chamberName } }) => {
      if (applyObject === APPLY_OBJECT_TYPE.ALL) return '不限'
      else if (applyObject === APPLY_OBJECT_TYPE.MEMBER) return chamberName ? '限本商会成员' : '限云商会成员'
      else if (applyObject === APPLY_OBJECT_TYPE.POST) return chamberName ? '限本商内指定职位' : '限商会内指定职位'
      else if (applyObject === APPLY_OBJECT_TYPE.DEPARTMENT)
        return chamberName ? '限商会内指定部门' : '限本商内指定部门'
    },
    width: 100
  }
]
getChamberOptions()
</script>
<style lang="scss" scoped></style>
