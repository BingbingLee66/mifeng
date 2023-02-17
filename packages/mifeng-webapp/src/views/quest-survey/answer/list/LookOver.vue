<template>
  <PlusTable
    :columns="columns"
    :data-source="tableData"
    :loading="loading"
    :pagination="pagination"
    :request="handleSearch"
    :scroll="{ x: 'max-content' }"
    :search="{ hiddenNum: 4 }"
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
              query: { questionnaireId: record.questionnaireId, userId: record.userId }
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
import { excelExporAnswer, userAnswerListByMiF } from '@/api/quest-survey'
import { reactive, ref, onMounted, inject } from 'vue'
import { useRoute } from 'vue-router'
import { useAntTable } from '@/use/useAntTable'
import { getMemberOptions } from '@/api/member/post'
import { downloadFile } from '@/utils'

function useTableData() {
  // 获取会内职位options
  const ckey = inject('ckey')
  const dateFormat = inject('$filters')?.dateFormat
  const memberPostOptions = reactive([])
  const getMemberOptionsData = async () => {
    const {
      data: { data: postOptions }
    } = await getMemberOptions({ ckey: ckey.value })
    memberPostOptions.push(...postOptions)
    memberPostOptions.unshift({ label: '全部', value: '' })
  }
  getMemberOptionsData()

  // table colunms
  const formColumns = [
    {
      title: '用户名',
      dataIndex: 'username',
      initialValue: '',
      filter: true,
      hideInTable: true,
      valueType: 'text',
      formItemProps: {
        allowClear: true
      }
    },
    {
      title: '会内职位',
      dataIndex: 'job',
      initialValue: '',
      filter: true,
      hideInTable: true,
      valueType: 'select',
      formItemProps: {
        options: memberPostOptions
      }
    },
    {
      title: '会员/联系人',
      dataIndex: 'name',
      initialValue: '',
      filter: true,
      hideInTable: true,
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
      hideInTable: true,
      valueType: 'text',
      formItemProps: {
        allowClear: true
      }
    }
  ]
  const tableColumns = [
    { title: '用户名', dataIndex: 'username' },
    { title: '会内职位', dataIndex: 'job' },
    { title: '姓名/联系人', dataIndex: 'name' },
    { title: '手机号/联系方式', dataIndex: 'phone' },
    {
      title: '提交时间',
      dataIndex: 'submitTime',
      customRender: ({ record: { submitTime } }) => dateFormat(submitTime)
    },
    { title: '操作', dataIndex: 'operation', fixed: 'right', width: 300 }
  ]
  const columns = [...formColumns, ...tableColumns]

  // table data
  const tableFilter = reactive({
    username: '',
    job: '',
    name: '',
    phone: ''
  })
  const route = useRoute()
  const { id: questionnaireId = '' } = route.query
  const tableData = ref([])
  const { pagination, handleTableChange, fetchTableData, loading } = useAntTable({
    fetchFn: async pageOption => {
      const {
        data: { list, totalRows }
      } = await userAnswerListByMiF({
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

  const downloadAnswer = async () => {
    const blob = await excelExporAnswer({ questionnaireId })
    downloadFile({
      title: '答卷.xlsx',
      url: window.URL.createObjectURL(blob)
    })
  }

  const handleSearch = obj => {
    const { username, job, name, phone } = obj
    tableFilter.username = username
    tableFilter.job = job
    tableFilter.name = name
    tableFilter.phone = phone
    fetchTableData(1)
  }
  onMounted(() => {
    fetchTableData()
  })

  return {
    columns,
    tableData,
    tableFilter,
    pagination,
    loading,
    fetchTableData,
    downloadAnswer,
    handleSearch,
    handleTableChange
  }
}

const { columns, tableData, pagination, loading, handleTableChange, handleSearch, downloadAnswer } = useTableData()
</script>

<style></style>
