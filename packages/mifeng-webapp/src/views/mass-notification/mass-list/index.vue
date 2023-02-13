<template>
  <PlusTable
    headerTitle="群发列表"
    :columns="columns"
    :data-source="tableData"
    :scroll="{ x: 'max-content' }"
    row-key="id"
    :search="{ defaultCollapsed: false }"
    :pagination="pagination"
    @change="handleTableChange"
    :request="handlerSearch"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.dataIndex === 'noticeTypeId'">
        {{ NOTIFICATION_TYPE_MAP.get(record.noticeTypeId) }}
      </template>
      <template v-if="column.dataIndex === 'receiveTypeId'">
        {{ RECEIVER_TYPE_MAP.get(record.receiveTypeId) }}
      </template>
      <template v-if="column.dataIndex === 'groupSendStatVOS'">
        {{ record.groupSendStatVOS?.map(item => SYNC_CHANNELS_MAP.get(item.channelTypeId)).join('、') }}
      </template>
      <template v-if="column.dataIndex === 'receiverNum'">
        <a-button type="link" primary @click="openReceiver(record)">{{ record.receiverNum }}</a-button>
      </template>
      <template v-if="column.dataIndex === 'readNum'">
        <a-button
          @click="openMassRead(item, record)"
          type="link"
          primary
          v-for="item in record.groupSendStatVOS"
          :key="item.id"
          >{{ `${SYNC_CHANNELS_MAP.get(item.channelTypeId)}: ${item.readNum}/${item.unreadNum}` }}
        </a-button>
      </template>
      <template v-if="column.dataIndex === 'readRate'">
        {{ record.readRate * 100 + '%' }}
      </template>
      <template v-if="column.dataIndex === 'sendTs'">
        <p>{{ SEND_TYPE_MAP.get(record.sendType) }}</p>
        <p>{{ $filters.dateFormat(record.sendTs) }}</p>
      </template>
      <template v-if="column.dataIndex === 'createInfo'">
        <p>{{ record.createInfo?.operatorName || '' }}</p>
        <p>
          {{ record.createInfo?.operatorTime && $filters.dateFormat(+record.createInfo.operatorTime) }}
        </p>
      </template>
      <template v-if="column.dataIndex === 'updateInfo'">
        <p>{{ record.updateInfo?.operatorName || '' }}</p>
        <p>
          {{ record.updateInfo?.operatorTime && $filters.dateFormat(+record.updateInfo.operatorTime) }}
        </p>
      </template>
      <template v-if="column.dataIndex === 'action'">
        <a-button
          v-if="record.groupSendStatVOS && record.groupSendStatVOS.length && record.statAuth === AUTH_STATUS.ABLE"
          @click="openMassRead(record.groupSendStatVOS[0], record)"
          type="link"
          primary
          >详情</a-button
        >
        <a-button
          v-if="record.editAuth === AUTH_STATUS.ABLE"
          @click="router.push(`/mass-notification/create?id=${record.id}`)"
          type="link"
          primary
          >编辑</a-button
        >
        <a-button v-if="record.delAuth === AUTH_STATUS.ABLE" @click="handlerDeleteNotify(record)" type="link" danger
          >删除</a-button
        >
        <a-button type="link" primary @click="exportSendRecord(record)" v-if="record.statAuth === AUTH_STATUS.ABLE">
          导出发送记录
        </a-button>
        <a-button type="link" primary @click="openUnread(record)" v-if="record.resendAuth === UNREAD_SEND_STATUS.ABLE">
          未读重发
        </a-button>
      </template>
    </template>
  </PlusTable>
  <!-- 为了解决默认加载一次的消耗 -->
  <div v-if="receiver.visible">
    <ReceiverDialog v-model:visible="receiver.visible" :id="receiver.id"> </ReceiverDialog>
  </div>
  <!-- 为了解决默认加载一次的消耗 -->
  <div v-if="readInfo.visible">
    <MassReadInfoDialog
      :channel-id="readInfo.channelId"
      v-model:visible="readInfo.visible"
      :id="readInfo.id"
      :receiveTypeId="readInfo.receiveTypeId"
    >
    </MassReadInfoDialog>
  </div>
  <template v-if="unreadSendInfo.visible">
    <UnreadDialog v-model:visible="unreadSendInfo.visible" :id="unreadSendInfo.id"></UnreadDialog>
  </template>
</template>

<script setup>
import { ref, reactive, computed, defineAsyncComponent } from 'vue'
import dayjs from 'dayjs'
import PlusTable from '@/components/plusTable/PlusTable.vue'
import { message, Modal } from 'ant-design-vue'
import { sendList, distributionChambers, exportSendItem, deleteSendItem } from '@/api/mass-notification'
import {
  NOTICE_TYPE_OPTIONS,
  NOTIFICATION_TYPE_MAP,
  RECEIVER_TYPE_MAP,
  SYNC_CHANNELS_MAP,
  SEND_TYPE_MAP,
  UNREAD_SEND_STATUS,
  AUTH_STATUS
} from '@/constant/mass-notification'
import { useRouter } from 'vue-router'

const ReceiverDialog = defineAsyncComponent(() => import('@/views/mass-notification/ReceiverDialog'))
const MassReadInfoDialog = defineAsyncComponent(() => import('@/views/mass-notification/MassReadInfoDialog'))
const UnreadDialog = defineAsyncComponent(() => import('@/views/mass-notification/UnreadDialog.vue'))

const router = useRouter()

const receiver = reactive({
  visible: false,
  id: 0
})
const readInfo = reactive({
  visible: false,
  id: 0,
  channelId: 0,
  receiveTypeId: 0
})

const query = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
  ckey: ''
})

const unreadSendInfo = reactive({
  visible: false,
  id: ''
})

const pagination = computed(() => {
  return {
    pageSize: query.pageSize,
    current: query.page,
    total: query.total
  }
})
const handlerDeleteNotify = record => {
  // 删除
  Modal.confirm({
    title: '删除',
    content: '请谨慎操作,删除后将无法恢复, 确认删除该消息数据？',
    type: 'warning',
    async onOk() {
      await deleteSendItem(record.id)
      message.success('删除成功')
      const index = tableData.value.findIndex(item => item.id === record.id)
      if (index > -1) {
        tableData.value.splice(index, 1)
      }
    }
  })
}

const tableData = ref([])

// 拉取群发通知列表和群发管理列表(总后台)
const getTableData = async () => {
  const { data } = await sendList(query)
  tableData.value = data.list
  query.total = data.totalRows
}

/** 打开群发阅读信息弹窗  */
const openMassRead = (item, record) => {
  readInfo.channelId = Number(item.channelTypeId)
  readInfo.id = String(record.id)
  readInfo.receiveTypeId = String(record.receiveTypeId)
  readInfo.visible = true
}

const chambersOptions = reactive([])

const tableColumns = [
  { title: 'ID', dataIndex: 'id', width: 180 },
  { title: '所属类型', dataIndex: 'noticeTypeId' },
  { title: '同步渠道', dataIndex: 'groupSendStatVOS' },
  { title: '接收人类型', dataIndex: 'receiveTypeId', width: 120 },
  { title: '接收人数', dataIndex: 'receiverNum', width: 100 },
  { title: '已读/未读人数', dataIndex: 'readNum' }, // unreadNum
  { title: '已读率', dataIndex: 'readRate', width: 100 },
  { title: '发送时间', dataIndex: 'sendTs' },
  { title: '创建信息', dataIndex: 'createInfo' },
  { title: '更新信息', dataIndex: 'updateInfo' },
  { title: '操作', dataIndex: 'action', fixed: 'right', width: 100 }
]

const columns = [
  {
    title: '通知类型',
    dataIndex: 'noticeTypeId',
    filter: true,
    valueType: 'select',
    hideInTable: true,
    initialValue: '',
    span: 8,
    formItemProps: {
      options: NOTICE_TYPE_OPTIONS
    }
  },
  {
    title: '创建人',
    dataIndex: 'title',
    filter: true,
    hideInTable: true,
    valueType: 'text'
  },
  {
    title: '发布时间',
    dataIndex: 'publishTime',
    filter: true,
    hideInTable: true,
    valueType: 'dateTimeRange',
    span: 8,
    formItemProps: {
      showTime: false
    }
  },
  ...tableColumns
]

// 打开接受人弹窗
const openReceiver = record => {
  if (!record.statAuth) {
    message.warning('接收人不能被查看')
    return
  }
  receiver.visible = true
  receiver.id = record.id
}

const handlerSearch = value => {
  const { noticeTypeId, chamberName, publishTime } = value
  const [sendStartTime = '', sendEndTime = ''] = publishTime || []
  Object.assign(query, {
    noticeTypeId,
    ckey: chamberName,
    sendStartTime: dayjs(sendStartTime).valueOf() || '',
    sendEndTime: dayjs(sendEndTime).valueOf() || '',
    page: 1
  })
  getTableData()
}

const handleTableChange = async ({ current }) => {
  query.page = current
  getTableData()
}

const queryChambersOptions = async () => {
  const { data } = await distributionChambers()
  chambersOptions.push(
    ...data.map(item => {
      return {
        label: item.name,
        value: item.ckey
      }
    })
  )
}
// 导出文件
const exportSendRecord = async record => {
  try {
    const result = await exportSendItem(record.id + '')
    const link = document.createElement('a')
    const blob = new Blob([result], { type: 'application/vnd.ms-excel' })
    link.style.display = 'none'
    // 设置连接
    link.href = URL.createObjectURL(blob)
    link.download = '发送记录'
    document.body.appendChild(link)
    link.click()
  } catch (error) {
    message.error('导出文件失败')
  }
}
// 打开未读
const openUnread = record => {
  unreadSendInfo.id = record.id
  unreadSendInfo.visible = true
}

queryChambersOptions()
getTableData()
</script>

<style lang="scss" scoped>
.p-notification-tabs {
  padding: 0 32px;
  background-color: #fff;
  :deep(.ant-tabs-nav) {
    margin-bottom: 0 !important;
  }
}
</style>
