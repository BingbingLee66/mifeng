<template>
  <PlusTable
    :scroll="{ x: 'max-content' }"
    row-key="id"
    :columns="columns"
    :data-source="tableData"
    :pagination="pagination"
    :loading="loading"
    @change="handleTableChange"
    :request="handlerSearch"
    ref="tableRef"
  >
    <template #toolBar>
      <a-button type="primary" class="mr-5" @click="getFromValue()">导出表格</a-button>
      <a-button type="primary" @click="calculationRulesDia = true">计算规则</a-button>
    </template>
    <template #bodyCell="{ record, column }">
      <template v-if="column.dataIndex === 'goodsName'">
        <div>{{ record.goodsName }}</div>
        <div>【规格】{{ record.skuName || '--' }}</div>
      </template>
      <template v-if="column.dataIndex === 'supplierName'">
        <div>【联系人姓名】{{ record.supplierName }}</div>
        <div>【联系人手机号】{{ record.supplierPhone || '--' }}</div>
      </template>
      <template v-if="column.dataIndex === 'createdTs'">
        <div>{{ $filters.dateFormat(record.createdTs) }}</div>
        <div>{{ record.settlementPeriodStr }}</div>
      </template>
      <template v-if="column.dataIndex === 'serviceFee'">
        <div>【商品服务费】{{ record.serviceFee }}</div>
        <div>【微信手续费】{{ record.wxServiceFee }}</div>
      </template>
      <template v-if="column.dataIndex === 'discount'">
        <div>【立减优惠】{{ record.discount }}</div>
        <div>【优惠劵】{{ record.coupon }}</div>
      </template>
      <template v-if="column.dataIndex === 'operateApplyTs'">
        <div>【运营申请时间】{{ $filters.dateFormat(record.operateApplyTs) }}</div>
        <div>【标记付款时间】{{ $filters.dateFormat(record.paidTs) }}</div>
      </template>
      <template v-if="column.dataIndex === 'status'">
        {{ STATUS_TYPE_MAP.get(record.status) || `状态出错${record.status}` }}
      </template>

      <template v-if="column.dataIndex === 'operate'">
        <a-button type="link" @click="detail(record)">详情</a-button>
        <a-button type="primary" v-if="record.status == 1" @click="signPay(record, 2)">标记为已付款</a-button>
      </template>
    </template>
  </PlusTable>
  <FinanceRule v-model:calculationRulesDia="calculationRulesDia" position="list" />
</template>
<script setup>
import { reactive, ref, defineAsyncComponent } from 'vue'
import { getSupplierSettlementList, changeSettlementStatus } from '@business/common/src/finance/api'
import { Modal, message } from 'ant-design-vue'
import { useAntTable } from '@business/logics/src/useAntTable/index'
import { STATUS_LIST, STATUS_TYPE_MAP } from '@/constant/finance'
import { useRouter } from 'vue-router'
const FinanceRule = defineAsyncComponent(() => import('@/components/finance/Rules.vue'))
const tableFilter = reactive({
  goodsName: '',
  supplierName: '',
  status: -1,
  date: [],
  supplierPhone: '',
  startTime: '',
  endTime: ''
})
const filterColumn = [
  {
    title: '结算单生成时间',
    dataIndex: 'date',
    filter: true,
    hideInTable: true,
    valueType: 'dateTimeRange',
    span: 8
  },
  {
    title: '商品名称',
    dataIndex: 'goodsName',
    filter: true,
    hideInTable: true,
    valueType: 'text',
    span: 8,
    formItemProps: {
      placeholder: '请输入商品名称'
    }
  },
  {
    title: '供应商姓名',
    dataIndex: 'supplierName',
    filter: true,
    hideInTable: true,
    valueType: 'text',
    span: 8,
    formItemProps: {
      placeholder: '请输入供应商姓名'
    }
  },
  {
    title: '供应商手机号',
    dataIndex: 'supplierPhone',
    filter: true,
    hideInTable: true,
    valueType: 'text',
    span: 8,
    formItemProps: {
      placeholder: '请输入供应商手机号'
    }
  },
  {
    title: '商品状态',
    dataIndex: 'status',
    filter: true,
    hideInTable: true,
    valueType: 'select',
    span: 8,
    formItemProps: {
      options: STATUS_LIST,
      placeholder: '请选择',
      defaultValue: -1
    }
  }
]
const columns = [
  ...filterColumn,
  {
    title: '商品&规格',
    dataIndex: 'goodsName',
    width: 150
  },
  { title: '供货商', dataIndex: 'supplierName', width: 250 },
  {
    title: '结算单生成时间/结算周期',
    dataIndex: 'createdTs',
    width: 220
  },
  { title: '应付款金额（元）', dataIndex: 'payable', width: 150 },
  { title: '服务费（元）', dataIndex: 'serviceFee', width: 180 },
  {
    title: '买家实付金额（元）',
    dataIndex: 'payment',
    width: 150
  },
  { title: '优惠（元）', dataIndex: 'discount', width: 180 },
  {
    title: '操作时间',
    dataIndex: 'operateApplyTs',
    width: 290
  },
  { title: '状态', dataIndex: 'status', width: 120 },
  { title: '操作', dataIndex: 'operate', width: 220, fixed: 'right' }
]

const handlerSearch = value => {
  setTableFilter(value)
  fetchTableData({ pageSize: 1 })
}
const setTableFilter = value => {
  tableFilter.goodsName = value.goodsName || ''
  tableFilter.status = value.status || -1
  tableFilter.date = value.date || []
  tableFilter.supplierName = value.supplierName || ''
  tableFilter.supplierPhone = value.supplierPhone || ''
  tableFilter.startTime = tableFilter.date[0] || ''
  tableFilter.endTime = tableFilter.date[1] || ''
}
const tableData = ref([])
const { pagination, handleTableChange, fetchTableData, loading } = useAntTable({
  fetchFn: async pageOption => {
    const condition = {
      pageSize: pageOption.pageSize,
      page: pageOption.current,
      ...tableFilter
    }
    delete condition.date
    if (condition.status === -1) delete condition.status
    const {
      data: { list, totalRows }
    } = await getSupplierSettlementList(condition)
    tableData.value = list
    return {
      total: totalRows
    }
  }
})
fetchTableData()
const signPay = ({ id }, status) => {
  Modal.confirm({
    title: '标记已付款',
    content: (
      <div>
        <div>是否确定已付款给该供货商？</div>
        <div>该操作执行后无法撤销，请谨慎处理。</div>
      </div>
    ),
    async onOk() {
      await changeSettlementStatus({
        id,
        status
      })
      fetchTableData()
    }
  })
}
const calculationRulesDia = ref(false)

const tableRef = ref()
const getFromValue = () => {
  const form = tableRef.value.getFormRef()
  const value = form.getFieldsValue()
  if (!value.date || value.date.length === 0) return message.error('请选择结算时间')
  setTableFilter(value)
  exportExcel()
}
const exportExcel = async () => {
  let paramString = `?startTime=${tableFilter.startTime}&endTime=${tableFilter.endTime}`
  if (tableFilter.status !== -1) {
    paramString += `&status=${tableFilter.status}`
  }
  if (tableFilter.goodName) {
    paramString += `&goodName=${tableFilter.goodName}`
  }
  if (tableFilter.supplierName) {
    paramString += `&supplierName=${tableFilter.supplierName}`
  }
  if (tableFilter.supplierPhone) {
    paramString += `&supplierPhone=${tableFilter.supplierPhone}`
  }
  const a = document.createElement('a')
  a.download = ''
  a.href = process.env.VUE_APP_BASE_API_2 + '/ec/mall/settlement-download' + paramString
  a.click()
}
const router = useRouter()
const detail = ({ skuId, id: settlementId }) => {
  router.push({
    name: '结算单详情',
    query: {
      skuId,
      settlementId
    }
  })
}
</script>
