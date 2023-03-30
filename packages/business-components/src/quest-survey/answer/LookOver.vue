<template>
  <PlusTable
    :columns="inheritedColumns"
    :data-source="tableData"
    :loading="loading"
    :pagination="pagination"
    :request="handleSearch"
    :scroll="{ x: 'max-content' }"
    row-key="id"
    @change="handleTableChange"
  >
    <template #toolBar>
      <a-button type="primary" @click="downloadAnswer">下载答卷数据</a-button>
    </template>
    <template #bodyCell="{ record, column }">
      <template v-if="column.dataIndex === 'operation'">
        <a-button
          type="primary"
          @click="
            $router.push({
              name: 'answerDetail',
              query: {
                questionnaireId: record.questionnaireId,
                userId: record.userId
              }
            })
          "
        >
          查看答卷
        </a-button>
      </template>
    </template>
  </PlusTable>
</template>

<script setup>
import { userAnswerList, excelExporAnswer } from '@/api/quest-survey/answer'
import { reactive, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAntTable } from '@business/logics/src/useAntTable/index.js'
import { downloadFile } from '@business/common/src/utils/index'
import dayjs from 'dayjs'
const props = defineProps({
  inheritedColumns: {
    type: Object,
    default: {}
  },
  title: {
    type: String,
    default: ''
  }
})
// table data
const tableFilter = reactive({
  username: '',
  phone: ''
})
const route = useRoute()
const { id: questionnaireId = '' } = route.query
const tableData = ref([])
const { pagination, handleTableChange, fetchTableData, loading } = useAntTable({
  fetchFn: async pageOption => {
    const {
      data: { list, totalRows }
    } = await userAnswerList({
      questionnaireId,
      ...tableFilter,
      pageSize: pageOption.pageSize,
      pageNum: pageOption.current
    })
    tableData.value = list
    return {
      total: totalRows
    }
  }
})
const handleSearch = obj => {
  const { username, phone } = obj
  tableFilter.username = username
  tableFilter.phone = phone
  fetchTableData(1)
}
const downloadAnswer = async () => {
  const date = dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss')
  const blob = await excelExporAnswer({ questionnaireId })
  downloadFile({
    title: `${props.title}-${date}.xlsx`,
    url: window.URL.createObjectURL(blob)
  })
}
onMounted(() => {
  fetchTableData()
})
</script>

<style></style>
