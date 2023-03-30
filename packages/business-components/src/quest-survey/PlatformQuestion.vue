<template>
  <PlusTable
    class="p-main-padding"
    :columns="props.inheritedColumns"
    :data-source="tableData"
    :scroll="{ x: 'max-content' }"
    row-key="id"
    :pagination="pagination"
    @change="handleTableChange"
    :request="handleSearch"
  >
    <template #toolBar>
      <a-button type="primary" @click="openInputModal()">创建问卷</a-button>
    </template>
    <template #bodyCell="{ column, record }">
      <template v-if="column.dataIndex === 'answersCount'">
        <a-button
          :type="record.answersCount > 0 ? 'link' : 'text'"
          @click="
            $router.push({
              path: '/quest-survey/answer/list',
              query: { id: record.id }
            })
          "
          >{{ record.answersCount }}
        </a-button>
      </template>
      <template v-if="column.dataIndex === 'actions'">
        <a-button v-if="record.state === 0" type="link" @click="updateState({ id: record.id, state: 1 })">
          发布
        </a-button>
        <a-button v-if="record.state === 1" type="link" @click="updateState({ id: record.id, state: 3 })">
          停止
        </a-button>
        <a-button v-if="record.state === 3" type="link" @click="updateState({ id: record.id, state: 1 })">
          恢复运行
        </a-button>
        <a-button v-if="[0, 1].includes(record.state)" type="link" @click="goCreateNotification(record)"
          >短信通知</a-button
        >
        <a-button type="link" @click="openShare(record)">分享</a-button>
        <a-button v-if="[0, 1, 3].includes(+record.state)" type="link" @click="openEdit(record)">编辑</a-button>
        <a-button type="link" @click="openDelete(record)">删除</a-button>
      </template>
    </template>
  </PlusTable>
  <InputModal
    v-model:visible="visible"
    title="创建问卷"
    label="问卷标题"
    :inputProps="{ maxlength: 30, showCount: true }"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
  />
</template>
<script setup>
import { defineAsyncComponent, getCurrentInstance, reactive, ref, createVNode, watch } from 'vue'
import { useAntTable } from '@business/logics/src/useAntTable/index.js'
import { useInputModal } from '../input-modal/hook'
import { useRouter } from 'vue-router'
import { downloadFile } from '@business/common/src/utils/index'
import { message, Modal } from 'ant-design-vue'
import {
  checkQuestionnaireTitle,
  getQuestionnaireList,
  getQuestionnaireShareInfo,
  updateQuestionnaireState,
  deleteQuestionnaire,
  chamberStatSave
} from '@business/common/src/quest-survey/api'
const { proxy } = getCurrentInstance()
const props = defineProps({
  inheritedColumns: {
    type: Object,
    default: {}
  }
})
const router = useRouter()
// 查询参数
const query = reactive({
  title: '',
  state: '',
  pageSize: 10,
  pageNum: 1
})
// 表格数据
const tableData = ref([])

// 分页参数 | 表格change事件处理 | 拉取表格数据函数
const { pagination, handleTableChange, fetchTableData } = useAntTable({
  async fetchFn({ current, pageSize }) {
    const { title = '', state = '' } = query
    const { data } = await getQuestionnaireList({
      questionnaireTitle: title,
      state,
      pageSize,
      pageNum: current,
      queryType: 1
    })
    tableData.value = data.list
    return { total: data.totalRows }
  }
})
// 执行查询筛选
const handleSearch = e => {
  Object.assign(query, e)
  fetchTableData()
}
// 发布停止问卷
const updateState = async params => {
  await updateQuestionnaireState({
    operateType: 1,
    questionnaireId: params.id,
    state: params.state
  })
  if (params.state === 1) {
    Modal.confirm({
      title: () => '已发布',
      content: () => '问卷已发布，您可以立即发短信通知会员填写问卷',
      okText: () => '短信通知',
      cancelText: () => '暂时不用',
      centered: 'true',
      onOk: () => goCreateNotification(params)
    })
  }
  fetchTableData()
}
fetchTableData()
// 新增弹窗
const InputModal = defineAsyncComponent(() => import('@business/components/src/input-modal/index.vue'))
const { openInputModal, visible, confirmLoading, handleOk } = useInputModal({
  async handleOk(value) {
    const { state } = await checkQuestionnaireTitle({
      questionnaireTitle: value
    })
    if (state === 1) {
      message.destroy()
      router.push({ path: '/quest-survey/create', query: { title: value } })
    }
  }
})
// 编辑
const openEdit = record => {
  Modal.confirm({
    title: '编辑',
    maskClosable: true,
    content: () => (
      <div>
        <p>此问卷正在运行，只能修改问卷的细节，例如更改错别字、添加选项、提前结束/延长问卷时间；</p>
        <p>不能对问卷做以下操作：删除题目或选项、移动题目或选项、转换题型；</p>
      </div>
    ),
    okText: '确定编辑',
    width: 500,
    onOk() {
      router.push({ path: '/quest-survey/create', query: { id: record.id } })
    }
  })
}
// 删除
const openDelete = record => {
  Modal.confirm({
    title: '删除',
    content: '问卷与答卷将一并删除，请谨慎操作！',
    okText: '确定删除',
    width: 500,
    maskClosable: true,
    async onOk() {
      await deleteQuestionnaire({ id: record.id })
      fetchTableData()
    }
  })
}
// 去到《创建群发通知》页面
const goCreateNotification = record => {
  router.push({
    path: '/mass-notification/create',
    query: {
      type: 9,
      questionnaireId: record.id,
      questionnaireTitle: record.title
    }
  })
}
// 分享
const openShare = async record => {
  const { state, data, msg } = await getQuestionnaireShareInfo({
    questionnaireId: record.id
  })
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
