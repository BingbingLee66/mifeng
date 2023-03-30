<template>
  <a-tabs v-model:activeKey="activeName" class="bg-white pl-8" @change="tabChange">
    <a-tab-pane :key="SYNC_CHANNELS_ID.NOTE" tab="短信通知" />
    <a-tab-pane :key="SYNC_CHANNELS_ID.SUBSCRIBE" tab="订阅消息" />
    <a-tab-pane :key="SYNC_CHANNELS_ID.APP" tab="APP通知" />
  </a-tabs>
  <PlusTable
    :scroll="{ x: 'max-content' }"
    row-key="id"
    :columns="
      activeName === SYNC_CHANNELS_ID.NOTE
        ? noticeCols
        : activeName === SYNC_CHANNELS_ID.SUBSCRIBE
        ? subscribeCols
        : appCols
    "
    :data-source="tableData"
    :pagination="pagination"
    :loading="loading"
    @change="handleTableChange"
    :request="handlerSearch"
  >
    <template #toolBar>
      <a-button type="primary" @click="goTemplate()">新增模板</a-button>
    </template>
    <template #bodyCell="{ record, column }">
      <template v-if="column.dataIndex === 'creator'">
        <div>{{ record.creator }}</div>
        <div>{{ $filters.dateFormat(record.createdTs) }}</div>
      </template>
      <template v-if="column.dataIndex === 'operate'">
        <a-button type="link" @click="goTemplate(record)">编辑</a-button>
        <a-button type="link" @click="openModalHandler(record)">详情</a-button>
        <a-button type="link" v-if="record.status === 1" @click="onForbidden(record)">禁用</a-button>
        <a-button type="link" v-if="record.status === 0" @click="onInvoke(record)">启用</a-button>
        <a-button type="link" @click="onDelete(record)">删除</a-button>
      </template>
    </template>
  </PlusTable>
  <DetailModal
    :visible="visible"
    :detail="detail"
    :active="DETAIL_TYPE.TEMPLATE_SETTING"
    :type="activeName"
    @handleOk="closeHandler"
    @handleCancel="closeHandler"
  />
</template>
<script setup>
import {
  SYNC_CHANNELS_ID,
  TEMPLATE_MAP,
  NOTIFICATION_TYPE_MAP
} from '@business/common/src/mass-notification/constant/mass-notification'
import { reactive, ref } from 'vue'
import { useAntTable } from '@business/logics/src/useAntTable/index'
import {
  noticeTemplateSetList,
  getNoticeTemplateSetDetailById,
  noticeTemplateSetUpdateStatus
} from '@business/common/src/mass-notification/api/index'
import { Modal } from 'ant-design-vue'
import DetailModal from '../templateLibrary/components/DetailModal.vue'
import { useModal } from '../templateLibrary/useModal'
import { DETAIL_TYPE } from '@/constant/mass-Template'
import { useRouter } from 'vue-router'
const activeName = ref(SYNC_CHANNELS_ID.NOTE)
const filterColumn = [
  {
    title: '标题',
    dataIndex: 'title',
    filter: true,
    hideInTable: true,
    valueType: 'text',
    span: 8,
    formItemProps: {
      placeholder: '请输入关键词'
    }
  }
]
const noticeCols = [
  ...filterColumn,
  {
    title: '模板名称',
    dataIndex: 'templateName'
  },
  {
    title: '模板CODE',
    dataIndex: 'templateCode'
  },
  {
    title: '模板类型',
    dataIndex: 'type',
    customRender: ({ record }) => {
      return TEMPLATE_MAP.get(record.type)
    }
  },
  {
    title: '所属类型',
    dataIndex: 'noticeTypeId',
    customRender: ({ record }) => {
      return NOTIFICATION_TYPE_MAP.get(record.noticeTypeId)
    }
  },
  {
    title: '模板备注',
    dataIndex: 'templateRemark'
  },
  {
    title: '创建信息',
    dataIndex: 'creator'
  },
  {
    title: '操作',
    dataIndex: 'operate',
    fixed: 'right'
  }
]
const appCols = [
  ...filterColumn,

  {
    title: 'ID',
    dataIndex: 'templateCode'
  },
  {
    title: '标题',
    dataIndex: 'templateName'
  },
  {
    title: '内容',
    dataIndex: 'content'
  },
  {
    title: '所属类型',
    dataIndex: 'noticeTypeId',
    customRender: ({ record }) => {
      return NOTIFICATION_TYPE_MAP.get(record.noticeTypeId)
    }
  },
  {
    title: '模板备注',
    dataIndex: 'templateRemark'
  },
  {
    title: '操作',
    dataIndex: 'operate',
    fixed: 'right'
  }
]
const subscribeCols = [
  ...filterColumn,

  {
    title: '模板ID',
    dataIndex: 'templateCode'
  },
  {
    title: '标题',
    dataIndex: 'templateName'
  },
  {
    title: '关键词',
    dataIndex: 'subscriptionNoticeTemplateVo',
    customRender: ({ record }) => {
      return record.subscriptionNoticeTemplateVo?.variableAttributes.map(item => item.value).join('、')
    }
  },
  {
    title: '类型',
    dataIndex: 'type',
    customRender: ({ record }) => {
      return TEMPLATE_MAP.get(record.type)
    }
  },
  {
    title: '所属类型',
    dataIndex: 'noticeTypeId',
    customRender: ({ record }) => {
      return NOTIFICATION_TYPE_MAP.get(record.noticeTypeId)
    }
  },
  {
    title: '模板备注',
    dataIndex: 'templateRemark'
  },
  {
    title: '操作',
    dataIndex: 'operate',
    fixed: 'right'
  }
]
const tableData = ref([])
const tableFilter = reactive({
  title: ''
})
const handlerSearch = value => {
  tableFilter.title = value.title || ''
  fetchTableData(true)
}
const { pagination, handleTableChange, fetchTableData, loading } = useAntTable({
  fetchFn: async pageOption => {
    const condition = {
      pageSize: pageOption.pageSize,
      page: pageOption.current,
      title: tableFilter.title,
      type: activeName.value
    }
    const {
      data: { list, totalRows }
    } = await noticeTemplateSetList(condition)
    tableData.value = list
    return {
      total: totalRows
    }
  }
})
fetchTableData()
const tabChange = () => {
  fetchTableData(true)
}
const onForbidden = ({ count, id }) => {
  const content = (
    <div>
      <p>
        当前共有<span style="color: #f5222d"> {count || 0}</span>条定时发送通知使用了该模板，确定禁用模板吗？
      </p>
      <p>禁用后：</p>
      <p>1.商协会新增时，将不能使用该模板(平台可正常使用)</p>
      <p>2.若已创建的定时通知含该禁用模板，不影响发送</p>
    </div>
  )
  SetUpdateStatus(id, 0, content)
}
const onInvoke = ({ id }) => {
  const content = (
    <div>
      <p>确定启用模板吗？</p>
      <p>启用后：</p>
      <p>1.该模板可被分配到商协会使用</p>
      <p>2.商协会新增通知时，可正常使用</p>
    </div>
  )
  SetUpdateStatus(id, 1, content)
}
const onDelete = ({ count, id }) => {
  const content = (
    <div>
      <p>
        当前共有<span style="color: #f5222d"> {count || 0}</span>条定时发送通知使用了该模板，确定删除模板吗？
      </p>
      <p>删除后：</p>
      <p>1.平台、商协会新增时，将不能使用该模板</p>
      <p>2.若已创建的定时通知含该删除模板，不影响发送</p>
    </div>
  )
  SetUpdateStatus(id, 2, content)
}
const SetUpdateStatus = async (id, status, content) => {
  Modal.confirm({
    title: '提示',
    width: 600,
    content,
    async onOk() {
      await noticeTemplateSetUpdateStatus({ id, status, channelTypeId: activeName.value })
      fetchTableData()
    }
  })
}
const detail = ref(null)
const { visible, closeHandler, openModalHandler } = useModal({
  fetch: async record => {
    const { data } = await getNoticeTemplateSetDetailById({ id: record.id })
    const toxon =
      activeName.value === 1
        ? 'smsNoticeTemplateVo'
        : activeName.value === 2
        ? 'subscriptionNoticeTemplateVo'
        : 'appNoticeTemplateVo'
    if (data[toxon].variableAttributes) {
      data.keyValueNoticeTemplateSetVo.keyValueTypeVOMapList.forEach(v => {
        data[toxon].variableAttributes.forEach(j => {
          if (v.key === j.key) j.value = v.value.value
        })
      })
    }
    detail.value = data
  }
})
const router = useRouter()
const goTemplate = ({ status, id } = {}) => {
  //  query.type   1:短信 2：消息订阅  3：app
  // status  状态 0禁用 1启用 2删除
  router.push({
    path: id ? '/template-set/edit-note/index' : '/template-set/add-note/index',
    query: {
      id: id || null,
      status: status !== undefined ? status : 1,
      type: activeName.value
    }
  })
}
</script>
