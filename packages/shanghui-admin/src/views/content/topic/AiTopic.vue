<template>
  <panel>
    <a-tabs v-model:activeKey="activeName" class="bg-white" @change="fetchFn(query[activeName].page)">
      <a-tab-pane :key="TAB.TURN_ON" :tab="TAB.TURN_ON" />
      <a-tab-pane :key="TAB.TIMES_CONFIG" :tab="TAB.TIMES_CONFIG" />
    </a-tabs>
    <PlusTable
      :columns="columns[activeName]"
      :data-source="tableData"
      :pagination="pagination[activeName]"
      @change="handleTableChange"
      bordered
    >
      <template #toolBar>
        <a-button type="primary" @click="showDialog()">添加</a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'createdTs'">
          {{ dayjs(Number(record.createdTs)).format('YYYY-MM-DD HH:mm') }}
        </template>
        <template v-if="column.key === 'startTime'">
          {{ dayjs(Number(record.startTime)).format('YYYY-MM-DD HH:mm') }}
        </template>
        <template v-if="column.key === 'endTime'">
          {{ dayjs(Number(record.endTime)).format('YYYY-MM-DD HH:mm') }}
        </template>
        <template v-if="column.key === 'handle'">
          <a-button @click="showDialog(record)">编辑</a-button>
          <a-button class="ml-4" @click="upDateHandler(record)">冻结</a-button>
        </template>
        <template v-if="column.key === 'category-handle'">
          <a-button @click="showDialog(record)">编辑</a-button>
        </template>
      </template>
    </PlusTable>
  </panel>
  <DialogForm
    v-model:visible="visible"
    v-model:formState="formState"
    :list="FormList[activeName]"
    @sure="submit"
  ></DialogForm>
</template>
<script setup>
import { reactive, ref, computed } from 'vue'
import {
  queryTopic,
  queryTopicCategory,
  addAiTopic,
  updateAiTopic,
  addCategory,
  updateCategory
} from '@/api/content/aigc'
import DialogForm from '../component/DialogForm.vue'
import dayjs from 'dayjs'
const TAB = {
  TURN_ON: '推荐话题',
  TIMES_CONFIG: '话题分类'
}
const activeName = ref(TAB.TURN_ON)
const columns = reactive({
  [TAB.TURN_ON]: [
    { title: '推荐话题名称', dataIndex: 'content', key: 'content', width: 120 },
    { title: '话题分类', dataIndex: 'categoryName', key: 'categoryName', width: 175 },
    { title: '权重', dataIndex: 'weight', key: 'weight', width: 175 },
    { title: '创建时间', dataIndex: 'createdTs', key: 'createdTs', width: 175 },
    { title: '开始展示时间', dataIndex: 'startTime', key: 'startTime', width: 175 },
    { title: '结束展示时间', dataIndex: 'endTime', key: 'endTime', width: 175 },
    { title: '更新人', dataIndex: 'updaterName', key: 'updaterName', width: 175 },
    { title: '状态', dataIndex: 'status', key: 'status', width: 175 },
    { title: '操作', key: 'handle', width: 200, fixed: 'right' }
  ],
  [TAB.TIMES_CONFIG]: [
    { title: '话题分类', dataIndex: 'name', key: 'name', width: 120 },
    { title: '话题数量', dataIndex: 'count', key: 'count', width: 175 },
    { title: '入库时间', dataIndex: 'createdTs', key: 'createdTs', width: 175 },
    { title: '操作', key: 'category-handle', width: 150, fixed: 'right' }
  ]
})
const tableData = ref([])

const visible = ref(false)
const formState = ref({
  id: '',
  content: '',
  categoryId: '',
  timeRange: [],
  status: 1,
  weight: '',
  // 分类名
  name: ''
})

const categoryData = ref([])

const FormList = ref({
  [TAB.TURN_ON]: [
    {
      label: '话题名称',
      name: 'content',
      type: 'input',
      rules: { required: true, message: '请输入话题名称!' }
    },
    {
      label: '话题分类',
      name: 'categoryId',
      type: 'select',
      rules: { required: true, message: '请选择话题分类!' },
      formItemProps: {
        options: categoryData
      }
    },
    {
      label: '展示时间',
      name: 'timeRange',
      type: 'dateTimeRange',
      rules: { required: true, message: '请选择展示时间!' },
      formItemProps: {
        showTime: { format: 'HH:mm' }
      }
    },
    {
      label: '状态',
      name: 'status',
      type: 'select',
      rules: { required: true, message: '请选择状态!' },
      formItemProps: {
        options: [
          { label: '正常', value: 1 },
          { label: '冻结', value: '2' }
        ]
      }
    },
    {
      label: '权重',
      name: 'weight',
      type: 'input',
      rules: { required: true, message: '请输入权重!' }
    }
  ],
  [TAB.TIMES_CONFIG]: [
    {
      label: '分类名称',
      name: 'name',
      type: 'input',
      rules: { required: true, message: '请输入分类名称!' }
    }
  ]
})

const query = reactive({
  [TAB.TURN_ON]: {
    pageSize: 10,
    current: 1,
    total: 0,
    pageSizeOptions: ['5', '10', '20', '30', '40'],
    showSizeChanger: true
  },
  [TAB.TIMES_CONFIG]: {
    pageSize: 10,
    current: 1,
    total: 0,
    pageSizeOptions: ['5', '10', '20', '30', '40'],
    showSizeChanger: true
  }
})
const pagination = computed(() => query)

const fetchFn = async (page = 1) => {
  console.log(query[activeName.value].pageSize)
  const prams = {
    pageSize: query[activeName.value].pageSize,
    page
  }
  const {
    data: { records, total }
  } = activeName.value === TAB.TURN_ON ? await queryTopic(prams) : await queryTopicCategory(prams)
  tableData.value = records
  query[activeName.value].total = total
  return {
    total: records.total
  }
}
fetchFn(query[activeName.value].current)
const handleTableChange = ({ current, pageSize }) => {
  query[activeName.value].current = current
  query[activeName.value].pageSize = pageSize
  fetchFn(current)
}

const queryAllCategory = async () => {
  const {
    data: { records }
  } = await queryTopicCategory({ pageSize: 100000, page: 1 })
  categoryData.value = records.map(item => {
    return {
      label: item.name,
      value: item.id
    }
  })
}

const showDialog = async data => {
  if (data) {
    formState.value = { ...data }
    if (activeName.value === TAB.TURN_ON) {
      formState.value.timeRange = [
        dayjs(Number(data.startTime)).format('YYYY-MM-DD HH:mm'),
        dayjs(Number(data.endTime)).format('YYYY-MM-DD HH:mm')
      ]
    }
  } else {
    formState.value = {
      id: '',
      content: '',
      categoryId: '',
      timeRange: [],
      status: 1,
      weight: '',
      name: ''
    }
  }
  await queryAllCategory()
  visible.value = true
}

const submit = async res => {
  if (activeName.value === TAB.TURN_ON) {
    createTopic(res)
  } else {
    createCategory(res)
  }
}

const createTopic = async res => {
  const {
    content,
    categoryId,
    status,
    weight,
    timeRange: [startTime, endTime]
  } = res

  const params = {
    content,
    categoryId,
    status,
    weight,
    startTime: dayjs(startTime).valueOf(),
    endTime: dayjs(endTime).valueOf()
  }

  formState.value.id
    ? await updateAiTopic({
        ...params,
        id: formState.value.id
      })
    : await addAiTopic(params)
  visible.value = false
  fetchFn(query[activeName.value].page)
}

const createCategory = async res => {
  const { name, id } = res

  formState.value.id ? await updateCategory({ name, id }) : await addCategory({ name })
  visible.value = false
  fetchFn(query[activeName.value].page)
}
</script>
