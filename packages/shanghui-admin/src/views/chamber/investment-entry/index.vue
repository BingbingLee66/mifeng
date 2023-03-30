<template>
  <PlusTable
    :columns="columns"
    :data-source="tableData"
    :scroll="{ x: 'max-content' }"
    :search="{ hiddenNum: 4 }"
    :request="handlerSearch"
    :pagination="pagination"
    @change="changeHandler"
    :resizable="true"
  ></PlusTable>
</template>
<script setup>
import { ref, computed, reactive } from 'vue'
import { queryInvestmentList } from '@/api/chamber/manager'
import dayjs from 'dayjs'

const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    filter: true,
    valueType: 'text',
    initialValue: '',
    formItemProps: { maxlength: 20 }
  },
  {
    title: '手机号码',
    dataIndex: 'phone',
    filter: true,
    valueType: 'text',
    initialValue: '',
    formItemProps: { maxlength: 11 }
  },
  {
    title: '公司名称',
    dataIndex: 'company',
    filter: true,
    valueType: 'text',
    initialValue: '',
    formItemProps: { maxlength: 50 }
  },
  {
    title: '供货品类',
    dataIndex: 'supplyCategory'
  },
  {
    title: '所属商协会',
    dataIndex: 'chamberName',
    filter: true,
    valueType: 'text',
    initialValue: '',
    width: 250,
    formItemProps: { maxlength: 30 },
    customRender: ({ record }) => {
      return record.chamberNames.join('、')
    }
  },
  {
    title: '手填商协会',
    dataIndex: 'fillChamberName',
    filter: true,
    valueType: 'text',
    initialValue: '',
    formItemProps: { maxlength: 30 }
  },
  {
    title: '提交时间',
    dataIndex: 'date',
    filter: true,
    valueType: 'dateTimeRange',
    initialValue: [],
    customRender: ({ record }) => {
      return dayjs(record.createdTs).format('YYYY-MM-DD HH:mm:ss')
    }
  }
]
const tableData = ref([])

const query = reactive({
  name: '',
  phone: '',
  company: '',
  chamberName: '',
  fillChamberName: '',
  startTime: '',
  endTime: '',
  page: 1,
  pageSize: 10,
  date: ''
})
const total = ref(0)

const pagination = computed(() => {
  return {
    pageSize: query.pageSize,
    current: query.page,
    showSizeChanger: true,
    showTotal: total => `共 ${total} 项`,
    total
  }
})

const handlerSearch = value => {
  Object.assign(query, value)
  queryList()
}

const queryList = async () => {
  const { date, ...params } = query
  const [startTime, endTime] = date || []
  const { data } = await queryInvestmentList({ ...params, startTime, endTime })
  tableData.value = data.list
  total.value = data.total
}

const changeHandler = ({ current, pageSize }) => {
  query.page = current
  query.pageSize = pageSize
  queryList()
}

handlerSearch(query)
</script>
