<template>
  <PlusTable
    :scroll="{ x: 'max-content' }"
    :columns="columns"
    :data-source="tableData"
    :pagination="pagination"
    :loading="loading"
    @change="handleTableChange"
    :request="handlerSearch"
  >
    <template #headerCell="{ column }">
      <template v-if="column.dataIndex === 'status'"> 打款状态 </template>
    </template>
    <template #bodyCell="{ record, column }">
      <template v-if="column.dataIndex === 'status'">
        {{ payoutStatus_MAP.get(record.status) }}
      </template>
      <template v-if="column.dataIndex === 'operate'">
        <a-button type="link" v-action="'详情'" @click="detail(record)">详情</a-button>
        <a-button type="link" v-action="'确定打款'" @click="confirm(record)" :disabled="record.status != 0"
          >确定打款</a-button
        >
        <a-button type="link" v-action="'驳回'" @click="openModal(record)" :disabled="record.status != 0"
          >驳回</a-button
        >
      </template>
    </template>
  </PlusTable>
  <DetailModal v-model:visible="detailVisible" :detailObj="detailObj" />
  <a-modal title="新增自定义信息" v-model:visible="rejectInfo.visible" @ok="reject">
    <a-radio-group v-model:value="rejectInfo.type" name="radioGroup">
      <a-radio :value="1" :style="radioStyle">账号信息有误，请修改后再重新申请提现</a-radio>
      <a-radio :value="2" :style="radioStyle">其他</a-radio>
    </a-radio-group>
    <a-input
      v-show="rejectInfo.type === 2"
      placeholder="选择“其他”时需要输入具体的内容才可提交"
      v-model:value="rejectInfo.remark"
    />
  </a-modal>
</template>
<script setup>
import { reactive, ref, defineAsyncComponent } from 'vue'
import { withdrawalCols } from '@business/common/src/finance/tableCols'
import { useAntTable } from '@business/logics/src/useAntTable/index'
import {
  getPlatformFinanceWithdrawList,
  applyWithdrawalConfirm,
  applyWithdrawalReject
} from '@business/common/src/finance/api'
import { message, Modal } from 'ant-design-vue'
const DetailModal = defineAsyncComponent(() => import('@business/components/src/finance/withdrawalDetail.vue'))

const tableFilter = reactive({
  status: -1
})
const payoutStatus = [
  { label: '全部', value: -1 },
  { label: '未打款', value: 0 },
  { label: '已打款', value: 1 },
  { label: '已驳回', value: 2 }
]
const payoutStatus_MAP = new Map([
  [0, '未打款'],
  [1, '已打款'],
  [2, '已驳回']
])
const columns = [
  {
    title: '打款状态',
    dataIndex: 'status',
    filter: true,
    hideInTable: true,
    valueType: 'select',
    span: 8,
    formItemProps: {
      options: payoutStatus,
      placeholder: '请选择',
      defaultValue: ''
    }
  },
  ...withdrawalCols
]
const tableData = ref([])
const { pagination, handleTableChange, fetchTableData, loading } = useAntTable({
  fetchFn: async pageOption => {
    const condition = {
      pageSize: pageOption.pageSize,
      page: pageOption.current,
      ...tableFilter
    }
    const {
      data: {
        data: { list, totalRows }
      }
    } = await getPlatformFinanceWithdrawList(condition)
    tableData.value = list
    return {
      total: totalRows
    }
  }
})
fetchTableData()
const handlerSearch = ({ status }) => {
  tableFilter.status = status === undefined ? -1 : status
  fetchTableData(true)
}
const detailVisible = ref(false)
const detailObj = reactive({})
const detail = record => {
  Object.assign(detailObj, record)
  detailVisible.value = true
}
const confirm = ({ id }) => {
  Modal.confirm({
    title: '提示',
    content: '确定已给对方打款',
    async onOk() {
      await applyWithdrawalConfirm({ id })
      fetchTableData()
    },
    async onCancel() {
      message.info('取消打款')
    }
  })
}
const rejectInfo = reactive({
  visible: false,
  type: 1,
  remark: '',
  id: ''
})
const openModal = ({ id }) => {
  rejectInfo.visible = true
  rejectInfo.type = 1
  rejectInfo.remark = ''
  rejectInfo.id = id
}
const reject = async () => {
  if (rejectInfo.type === 2 && !rejectInfo.remark) return message.error('请输入拒绝理由')
  if (rejectInfo.type === 1) rejectInfo.remark = '账号信息有误，请修改后再重新申请提现'
  await applyWithdrawalReject({ id: rejectInfo.id, rejectRemark: rejectInfo.remark })
  rejectInfo.visible = false
  fetchTableData()
}
const radioStyle = reactive({
  display: 'flex',
  height: '30px',
  lineHeight: '30px'
})
</script>
