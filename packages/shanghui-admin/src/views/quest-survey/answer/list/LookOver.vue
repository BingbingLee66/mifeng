<template>
  <PlatformQuestion :title="props.title" :inherited-columns="columns" />
</template>
<script setup>
import { inject } from 'vue'
import PlatformQuestion from '@business/components/src/quest-survey/answer/LookOver.vue'
const dateFormat = inject('$filters')?.dateFormat
const props = defineProps({
  title: {
    type: String,
    default: ''
  }
})
const columns = [
  {
    title: '序号',
    dataIndex: 'questionnaireRecordId',
    valueType: 'text',
    initialValue: ''
  },
  {
    title: '用户名',
    dataIndex: 'username',
    initialValue: '',
    filter: true,
    valueType: 'text',
    formItemProps: {
      allowClear: true
    }
  },
  {
    title: '手机号/联系方式',
    dataIndex: 'phone',
    initialValue: '',
    filter: true,
    valueType: 'text',
    formItemProps: {
      allowClear: true
    }
  },
  {
    title: '提交时间',
    dataIndex: 'submitTime',
    customRender: ({ record: { submitTime } }) => dateFormat(submitTime)
  },
  { title: '操作', dataIndex: 'operation', fixed: 'right', width: 300 }
]
</script>
