<template>
  <PlusTable
    :pagination="pagination"
    :columns="columns"
    :data-source="tableData"
    :scroll="{ x: 'max-content' }"
    :request="handlerSearch"
    @change="handleTableChange"
  >
  </PlusTable>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { getStatisticsData } from '@/api/statistic/questSurvey'
import PlusTable from '@/components/plusTable/PlusTable.vue'
const tableData = ref([])
const columns = [
  { title: '问卷', dataIndex: 'questionnaireName', filter: true, valueType: 'text' },
  {
    title: '是否删除',
    dataIndex: 'deletedStatus',
    customRender: ({ record }) => {
      return record.deletedStatus === 0 ? '未删除' : '已删除'
    }
  },
  {
    title: '短信发送人数',
    dataIndex: 'smsSendPeopleNumberSum'
  },
  { title: '短信送达数', dataIndex: 'smsDeliveryNumberSum' },
  {
    title: '短信送达率',
    dataIndex: 'smsDeliveryNumberRate',
    customRender: ({ record }) => {
      return accMul(record.smsDeliveryNumberRate, 100) + '%'
    }
  },
  { title: '问卷浏览次数', dataIndex: 'questionnaireBrowseNumberSum' },
  { title: '问卷浏览人数', dataIndex: 'questionnaireBrowsePeopleNumberSum' },
  { title: '答卷回收数', dataIndex: 'questionnaireRecycleAnswerSum' },
  {
    title: '答卷回收率',
    dataIndex: 'questionnaireRecycleRate',
    customRender: ({ record }) => {
      return accMul(record.questionnaireRecycleRate, 100) + '%'
    }
  }
]
const accMul = (arg1, arg2) => {
  let m = 0
  const s1 = arg1.toString()
  const s2 = arg2.toString()
  try {
    m += s1.split('.')[1].length
  } catch (e) {}
  try {
    m += s2.split('.')[1].length
  } catch (e) {}
  return (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) / Math.pow(10, m)
}
let query = reactive({
  pageNum: 1,
  pageSize: 10,
  questionnaireName: ''
})
const handlerSearch = async value => {
  const { questionnaireName } = value
  query = { ...query, questionnaireName }
  query.pageNum = 1
  fetchData()
}

const pagination = computed(() => {
  return {
    pageSize: query.pageSize,
    current: query.pageNum,
    total: query.total
  }
})
const handleTableChange = pagination => {
  query.pageNum = pagination.current
  query.pageSize = pagination.pageSize
  fetchData()
}
const fetchData = async () => {
  const params = { ...query }
  params.questionnaireName = query.questionnaireName.trim()
  const { data } = await getStatisticsData(params)
  tableData.value = data.list
  query.total = data.totalRows
}
fetchData()
</script>

<style></style>
