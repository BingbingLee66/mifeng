<template>
  <a-modal :visible="dialogVisible" title="分配短信" @cancel="handleClose" @ok="handleClose" width="80%">
    <a-tabs v-model:activeKey="activeName" @change="tabChange" class="pb-4">
      <a-tab-pane :key="SYNC_CHANNELS_ID.NOTE" tab="短信通知" />
      <a-tab-pane :key="SYNC_CHANNELS_ID.SUBSCRIBE" tab="订阅消息" />
      <a-tab-pane :key="SYNC_CHANNELS_ID.APP" tab="APP通知" />
    </a-tabs>
    <PlusTable
      :scroll="{ x: 'max-content' }"
      class="p0"
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
      <template #bodyCell="{ record, column }">
        <template v-if="column.dataIndex === 'creator'">
          <div>{{ record.creator }}</div>
          <div>{{ $filters.dateFormat(record.createdTs) }}</div>
        </template>
        <template v-if="column.dataIndex === 'operate'">
          <a-button type="link" v-if="record.tddStatus === 1" @click="onForbidden(record)">禁用</a-button>
          <a-button type="link" v-if="record.tddStatus === 0" @click="onInvoke(record)">启用</a-button>
        </template>
      </template>
    </PlusTable>
  </a-modal>
</template>
<script setup>
import {
  SYNC_CHANNELS_ID,
  NOTIFICATION_TYPE_MAP
} from '@business/common/src/mass-notification/constant/mass-notification'
import { ref } from 'vue'
import { useAntTable } from '@business/logics/src/useAntTable/index'
import {
  distributionTemplates,
  distributionUpdateStatus,
  distributionChambers
} from '@business/common/src/mass-notification/api/index'
import { Modal } from 'ant-design-vue'
const activeName = ref(SYNC_CHANNELS_ID.NOTE)
const dialogVisible = ref(false)
const ckey = ref('')
const show = async row => {
  ckey.value = row.ckey
  activeName.value = SYNC_CHANNELS_ID.NOTE
  await searchChamber()
  filterColumn[0].formItemProps.value = ckey.value
  await fetchTableData()
  dialogVisible.value = true
}
const originOpt = ref([])
const searchChamber = async () => {
  const { data } = await distributionChambers({
    name: ''
  })
  originOpt.value = data
}
defineExpose({ show })
const filterColumn = [
  {
    title: '',
    dataIndex: 'ckey',
    filter: true,
    hideInTable: true,
    valueType: 'select',
    span: 8,
    formItemProps: {
      options: originOpt,
      placeholder: '请输入关键词',
      fieldNames: { label: 'name', value: 'ckey' },
      defaultValue: undefined,
      showSearch: true,
      optionFilterProp: 'name'
    },
    formItemMethods: {
      change: value => {
        filterColumn[0].formItemProps.value = value
      }
    }
  }
]
const commonCols = [
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
    title: '状态',
    dataIndex: 'tddStatus',
    customRender: ({ record }) => {
      return record.tddStatus === 0 ? '已禁用' : record.tddStatus === 1 ? '使用中' : '已删除'
    }
  },
  {
    title: '操作',
    dataIndex: 'operate',
    fixed: 'right'
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
    title: '内容',
    dataIndex: 'content'
  },
  ...commonCols
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
  ...commonCols
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
  ...commonCols
]
const tableData = ref([])
const handlerSearch = value => {
  ckey.value = value.ckey || ''
  fetchTableData(true)
}
const { pagination, handleTableChange, fetchTableData, loading } = useAntTable({
  fetchFn: async pageOption => {
    const condition = {
      pageSize: pageOption.pageSize,
      page: pageOption.current,
      ckey: ckey.value,
      type: activeName.value
    }
    const {
      data: { list, totalRows }
    } = await distributionTemplates(condition)
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
const onForbidden = ({ id }) => {
  const content = <div>禁用后，该商会后台不可使用该模板</div>
  SetUpdateStatus(id, 0, content)
}
const onInvoke = ({ id }) => {
  const content = <div>启用后，该商会后台可使用该模板</div>
  SetUpdateStatus(id, 1, content)
}
const handleClose = () => {
  dialogVisible.value = false
}
const SetUpdateStatus = async (id, status, content) => {
  Modal.confirm({
    title: '提示',
    width: 600,
    content,
    async onOk() {
      await distributionUpdateStatus({ id, status, channelTypeId: activeName.value })
      fetchTableData()
    }
  })
}
</script>
