<template>
  <a-tabs v-model:activeKey="activeName" class="bg-white pl-8" @change="changeHandler()">
    <a-tab-pane :key="TAB.TURN_ON" :tab="TAB.TURN_ON" />
    <a-tab-pane :key="TAB.TIMES_CONFIG" :tab="TAB.TIMES_CONFIG" />
  </a-tabs>
  <div class="p-main-padding">
    <PlusTable
      :columns="columns[activeName]"
      :scroll="{ x: 'max-content' }"
      :data-source="tableData"
      :pagination="pagination[activeName]"
      @change="handleTableChange"
      :request="handlerSearch"
    >
      <template #toolBar>
        <a-button type="primary" @click="showDialog(null, TITLE_OBJ.ADD[activeName])">添加</a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'categoryId'">
          {{ record.categoryName }}
        </template>
        <template v-if="column.key === 'weight'">
          <a-button type="link" primary @click="changeWeight(record)"> {{ record.weight }} </a-button>
        </template>
        <template v-if="column.key === 'createdTs'">
          {{ dayjs(Number(record.createdTs)).format('YYYY-MM-DD HH:mm') }}
        </template>
        <template v-if="column.key === 'startTime'">
          {{ dayjs(Number(record.startTime)).format('YYYY-MM-DD HH:mm') }}
        </template>
        <template v-if="column.key === 'endTime'">
          {{ dayjs(Number(record.endTime)).format('YYYY-MM-DD HH:mm') }}
        </template>
        <template v-if="column.key === 'status'">
          {{ STATUS_ZH[record.status] }}
        </template>
        <template v-if="column.key === 'handle'">
          <a-button type="link" primary @click="showDialog(record, TITLE_OBJ.EDIT_TOPIC)">编辑</a-button>
          <a-button type="link" primary class="ml-4" @click="freezeSwitch(record)">
            {{ record.status === STATUS.NORMAL ? '冻结' : '解冻' }}</a-button
          >
        </template>
        <template v-if="column.key === 'category-handle'">
          <a-button type="link" primary @click="showDialog(record, TITLE_OBJ.EDIT_CATEGORY)">编辑</a-button>
        </template>
      </template>
    </PlusTable>
  </div>
  <DialogForm
    v-model:visible="visible"
    v-model:formState="formState"
    :title="dialogTitle"
    :list="FormList[activeName]"
    @sure="submit"
  ></DialogForm>

  <DialogForm
    v-model:visible="weightVisible"
    v-model:formState="detailInfo"
    title="权重"
    :list="weightList"
    @sure="submitWeight"
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
  updateCategory,
  updateWeight
} from '@/api/content/aigc'
import DialogForm from '../component/DialogForm.vue'
import dayjs from 'dayjs'
import { message } from 'antd'
const STATUS = {
  NORMAL: 1,
  FREEZE: 2
}
const STATUS_ZH = {
  [STATUS.NORMAL]: '正常',
  [STATUS.FREEZE]: '冻结'
}
const TAB = {
  TURN_ON: '推荐话题',
  TIMES_CONFIG: '话题分类'
}
const TITLE_OBJ = {
  ADD: {
    [TAB.TURN_ON]: '添加话题',
    [TAB.TIMES_CONFIG]: '添加话题分类'
  },
  EDIT_TOPIC: '编辑话题',
  EDIT_CATEGORY: '编辑话题分类'
}
const activeName = ref(TAB.TURN_ON)
const categoryData = ref([])
const allCategoryData = ref([])
const columns = reactive({
  [TAB.TURN_ON]: [
    { title: '推荐话题名称', dataIndex: 'content', key: 'content', width: 120 },
    {
      title: '话题分类',
      dataIndex: 'categoryId',
      key: 'categoryId',
      width: 175,
      filter: true,
      valueType: 'select',
      initialValue: '',
      formItemProps: {
        options: allCategoryData
      }
    },
    {
      title: '添加时间',
      dataIndex: 'addTime',
      key: 'addTime',
      filter: true,
      hideInTable: true,
      initialValue: [],
      valueType: 'dateTimeRange'
    },
    {
      title: '权重',
      dataIndex: 'weight',
      key: 'weight',
      width: 175
    },
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

const weightVisible = ref(false)
const weightList = ref([
  {
    label: '权重',
    name: 'weight',
    type: 'input',
    rules: { required: true, message: '请输入权重!' }
  }
])
const detailInfo = ref({})

const visible = ref(false)
const dialogTitle = ref('添加话题')
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
          { label: '正常', value: STATUS.NORMAL },
          { label: '冻结', value: STATUS.FREEZE }
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
    showSizeChanger: true,
    categoryId: '',
    startTime: '',
    endTime: ''
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
  const prams = {
    pageSize: query[activeName.value].pageSize,
    page
  }
  const {
    data: { records, total }
  } =
    activeName.value === TAB.TURN_ON
      ? await queryTopic({
          ...prams,
          categoryId: query[activeName.value].categoryId,
          startTime: query[activeName.value].startTime,
          endTime: query[activeName.value].endTime
        })
      : await queryCategory(prams)
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

const queryCategory = async params => {
  try {
    const { data } = await queryTopicCategory(params)
    return { data }
  } catch (error) {
    message.error(error.message)
    return {
      data: {
        records: [],
        total: 0
      }
    }
  }
}

const queryAllCategory = async () => {
  const {
    data: { records }
  } = await queryCategory({ pageSize: 100000, page: 1 })
  categoryData.value = records.map(item => {
    return {
      label: item.name,
      value: item.id
    }
  })
  allCategoryData.value = [{ label: '全部', value: '' }, ...categoryData.value]
}

const showDialog = async (data, title) => {
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
  dialogTitle.value = title
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
  const params = (({ content, categoryId, status, weight, timeRange: [startTime, endTime] }) => ({
    content,
    categoryId,
    status,
    weight,
    startTime: dayjs(startTime).valueOf(),
    endTime: dayjs(endTime).valueOf()
  }))(res)

  formState.value.id
    ? await updateAiTopic({
        ...params,
        id: formState.value.id
      })
    : await addAiTopic(params)
  visible.value = false
  fetchFn(query[activeName.value].current)
}

const createCategory = async res => {
  const { name } = res
  formState.value.id ? await updateCategory({ name, id: formState.value.id }) : await addCategory({ name })
  visible.value = false
  fetchFn(query[activeName.value].current)
}

const freezeSwitch = data => {
  formState.value = {
    ...data,
    status: data.status === STATUS.NORMAL ? STATUS.FREEZE : STATUS.NORMAL,
    timeRange: [Number(data.startTime), Number(data.endTime)]
  }
  createTopic(formState.value)
}

const handlerSearch = value => {
  const [startTime, endTime] = value.addTime || []
  query[activeName.value].startTime = startTime && dayjs(startTime).valueOf()
  query[activeName.value].endTime = endTime && dayjs(endTime).valueOf()
  query[activeName.value].categoryId = value.categoryId
  fetchFn()
}

const changeHandler = () => {
  fetchFn(query[activeName.value].page)

  queryAllCategory()
}
queryAllCategory()

const changeWeight = record => {
  weightVisible.value = true
  detailInfo.value = { ...record }
}

const submitWeight = async res => {
  await updateWeight({
    id: detailInfo.value.id,
    weight: Number(res.weight)
  })
  weightVisible.value = false
  fetchFn()
}
</script>
<style lang="scss" scoped>
:deep(.ant-tabs-nav) {
  margin: 0;
}
</style>
