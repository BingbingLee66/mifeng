<template>
  <PlusTable
    class="p-main-padding"
    :columns="columns"
    :data-source="tableData"
    :scroll="{ x: 'max-content' }"
    row-key="id"
    :pagination="pagination"
    @change="handleTableChange"
    :request="handleSearch"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.dataIndex === 'answersCount'">
        <div>{{ record.answersCount }}</div>
      </template>
      <template v-if="column.dataIndex === 'actions'">
        <a-button type="link" @click="openLook(record)">查看</a-button>
        <a-button type="link" @click="openShare(record)">分享</a-button>
        <a-button type="link" @click="openDialog(record)" v-if="record.state !== 2">冻结</a-button>
        <a-button type="link" @click="unFreeze(record)" v-else>解冻</a-button>
      </template>
    </template>
  </PlusTable>
  <QuestionaireLook v-model:modalVisible="modalVisible" :questionnaireId="questionnaireId" />
</template>
<script setup>
import { getCurrentInstance, reactive, ref, createVNode, computed, defineAsyncComponent } from 'vue'
import { useAntTable } from '@business/logics/src/useAntTable/index.js'
import { STATE_MAP } from '@business/common/src/quest-survey/constant'
import { downloadFile } from '@business/common/src/utils/index'
import { message, Modal } from 'ant-design-vue'
import { freezeQuestionnaire, unFreezeQuestionnaire } from '@/api/quest-survey'
import { getQuestionnaireList, getQuestionnaireShareInfo } from '@business/common/src/quest-survey/api'
import { chamberSearchList } from '@/api/chamber/manager'
import dayjs from 'dayjs'
const { proxy } = getCurrentInstance()
// 查询参数
const query = reactive({
  chamberName: '',
  title: '',
  state: ''
})
// 查看问卷弹窗
const modalVisible = ref(false)

// 选择框列表
const chamberList = ref([])

// 冻结理由
const freezeReason = ref('')

// 查看的问卷的id
const questionnaireId = ref('')

// 获取选择框数据
const getChamberList = async () => {
  let { data } = await chamberSearchList()
  data = data || []
  chamberList.value = data.map(item => ({
    label: item.name,
    value: item.ckey
  }))
}
getChamberList()
const columns = [
  { title: 'ID', dataIndex: 'id' },
  {
    title: '商协会',
    dataIndex: 'chamberName',
    filter: true,
    valueType: 'select',
    placeholder: '请选择',
    initialValue: '',
    formItemProps: {
      options: computed(() => {
        return chamberList.value
      }),
      initialValue: ''
    },
    width: 140
  },
  {
    title: '问卷标题',
    dataIndex: 'title',
    filter: true,
    valueType: 'text',
    formItemProps: {
      placeholder: '请输入',
      initialValue: ''
    },
    width: 140
  },

  {
    title: '答卷状态',
    dataIndex: 'state',
    filter: true,
    valueType: 'select',
    formItemProps: {
      options: [
        { label: '全部', value: '' },
        ...Object.entries(STATE_MAP).map(([key, value]) => ({
          label: value,
          value: key
        }))
      ],
      initialValue: ''
    },
    customRender: ({ record }) => (
      <div>
        {STATE_MAP[record.state]}
        {+record.state === 2 ? (
          <a-tooltip placement="top" title={record.freezing}>
            <info-circle-outlined />
          </a-tooltip>
        ) : (
          ''
        )}
      </div>
    )
  },
  { title: '答卷', dataIndex: 'answersCount' },
  {
    title: '创建时间',
    dataIndex: 'createdTs',
    valueType: 'datePicker',
    formItemProps: { initialValue: '' },
    customRender: ({ record }) => dayjs(record.createdTs).format('YYYY-MM-DD HH:mm')
  },
  {
    title: '操作',
    dataIndex: 'actions',
    fixed: 'right',
    width: 200
  }
]
// 表格数据
const tableData = ref([])
// 分页参数 | 表格change事件处理 | 拉取表格数据函数
const { pagination, handleTableChange, fetchTableData } = useAntTable({
  async fetchFn({ current, pageSize }) {
    const { title = '', state = '', chamberName } = query
    const { data } = await getQuestionnaireList({
      pageNum: current,
      pageSize,
      questionnaireTitle: title,
      state,
      ckey: chamberName,
      queryType: 2
    })
    tableData.value = data.list
    console.log(data, 'data')
    return { total: data.totalRows }
  }
})
// 执行查询筛选
const handleSearch = e => {
  Object.assign(query, e)
  console.log(query, 'dta6')
  fetchTableData()
}
fetchTableData()

// 查看
const QuestionaireLook = defineAsyncComponent(() => import('./QuestionaireLook.vue'))
const openLook = record => {
  modalVisible.value = true
  questionnaireId.value = record.id
}
// 冻结
const openDialog = record => {
  Modal.confirm({
    title: '冻结',
    maskClosable: true,
    content: () => (
      <div>
        <p>是否确定冻结该问卷？</p>
        <textarea
          type="text"
          placeholder="请填写冻结原因，50字以内"
          maxlength="50"
          show-word-limit
          rows="3"
          cols="40"
          resize="none"
          required
          onChange={e => {
            freezeReason.value = e.target.value
          }}
        />
      </div>
    ),
    okText: '确定冻结',
    width: 500,
    async onOk() {
      if (!freezeReason.value.trim()) {
        message.warning('请输入冻结理由')
      } else {
        await freezeQuestionnaire({ id: record.id, freezing: freezeReason.value })
        fetchTableData()
      }
    }
  })
}

// 解冻
const unFreeze = record => {
  Modal.confirm({
    title: '解冻',
    maskClosable: true,
    content: () => (
      <div>
        <p>确定解冻？</p>
      </div>
    ),
    okText: '确定',
    width: 500,
    async onOk() {
      await unFreezeQuestionnaire({
        id: record.id
      })
      fetchTableData()
    }
  })
}
// 分享
const openShare = async record => {
  const { state, data, msg } = await getQuestionnaireShareInfo({ questionnaireId: record.id })
  if (state !== 1) message.error(msg)
  Modal.confirm({
    title: '分享',
    icon: () => createVNode('span', null, ''),
    centered: true,
    content: () => (
      <div>
        <div style="margin-bottom:20px;" class="flex-x">
          <div class="shrink-0 ml-5">链接</div>
          <div class="ml-5">{data.questionnaireUrl}</div>
          <div
            class="shrink-0 ml-5"
            style="color:#f4c820;cursor: pointer;"
            onClick={async () =>
              proxy
                .$copyText(data.questionnaireUrl)
                .then(() => message.success('复制成功'))
                .catch(() => message.error('复制失败'))
            }
          >
            复制
          </div>
        </div>
        <div class="flex-x">
          <div class="shrink-0 ml-5">二维码</div>
          <div class="ml-5">
            <img style="width:200px;height:200px" src={data.questionnaireCode} />
          </div>
          <div
            class="shrink-0 ml-5"
            style="color:#f4c820;cursor: pointer;"
            onClick={() => downloadFile({ url: data.questionnaireCode, title: '二维码' })}
          >
            下载
          </div>
        </div>
      </div>
    ),
    okText: '关闭',
    width: 500
  })
}
</script>
