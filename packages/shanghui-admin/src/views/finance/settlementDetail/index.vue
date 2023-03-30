<template>
  <a-card class="m-5 mb-0">
    <a-descriptions title="结算单详情">
      <a-descriptions-item label="生成结算单时间">{{
        $filters.dateFormat(settlementMsg.createdTs)
      }}</a-descriptions-item>
      <a-descriptions-item label="商品名称">{{ settlementMsg.goodsName }}</a-descriptions-item>
      <a-descriptions-item label="账户名">{{ settlementMsg.companyName }}</a-descriptions-item>
      <a-descriptions-item label="状态">
        {{ STATUS_TYPE_MAP.get(settlementMsg.status) || `状态出错${settlementMsg.status}` }}</a-descriptions-item
      >
      <a-descriptions-item label="规格"> {{ settlementMsg.skuName || '--' }} </a-descriptions-item>
      <a-descriptions-item label="开户行"> {{ settlementMsg.bankName }} </a-descriptions-item>
      <a-descriptions-item label="申请财务打款时间">{{
        $filters.dateFormat(settlementMsg.operateApplyTs)
      }}</a-descriptions-item>
      <a-descriptions-item label="应打款金额">{{ settlementMsg.payable }}</a-descriptions-item>
      <a-descriptions-item label="银行卡号">{{ settlementMsg.bankCard }}</a-descriptions-item>
      <a-descriptions-item label="财务标记“已打款”时间">{{
        $filters.dateFormat(settlementMsg.paidTs)
      }}</a-descriptions-item>
      <a-descriptions-item label="供货商"
        >{{ settlementMsg.supplierName }}&ensp;&ensp;{{ settlementMsg.supplierPhone }}</a-descriptions-item
      >
    </a-descriptions>
  </a-card>
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
      <template v-if="column.dataIndex === 'tradeTime'">
        <div>{{ $filters.dateFormat(record.tradeTime) }}</div>
      </template>
      <template v-if="column.dataIndex === 'serviceFee'">
        <div>【商品服务费】{{ record.serviceFee }}</div>
        <div>【微信手续费】{{ record.wxServiceFee }}</div>
      </template>
      <template v-if="column.dataIndex === 'serviceFeeRatio'">
        <div>【商品服务费率】{{ record.serviceFeeRatio }}%</div>
        <div>【微信手续费率】{{ record.wxServiceFeeRatio }}%</div>
      </template>
      <template v-if="column.dataIndex === 'discount'">
        <div v-if="record.fightStatus == 0">【单买价】{{ record.price }}</div>
        <div v-else>【拼单价】{{ record.price }}</div>
        <div>【立减优惠】{{ record.discount }}</div>
        <div>【优惠劵】{{ record.coupon }}</div>
      </template>
      <template v-if="column.dataIndex === 'buyerName'">
        <div>{{ record.buyerName }}</div>
        <div>{{ record.buyerPhone }}</div>
      </template>
    </template>
  </PlusTable>
  <FinanceRule v-model:calculationRulesDia="calculationRulesDia" position="list" />
</template>
<script setup>
import { reactive, ref, defineAsyncComponent, onMounted } from 'vue'
import { getSettlementOrderDetailList, getSettlementOrderDetailMsg } from '@business/common/src/finance/api'
import { useAntTable } from '@business/logics/src/useAntTable/index'
import { STATUS_TYPE_MAP } from '@/constant/finance'
import { useRoute } from 'vue-router'
const route = useRoute()
const {
  query: { settlementId }
} = route
const FinanceRule = defineAsyncComponent(() => import('@/components/finance/Rules.vue'))
const tableFilter = reactive({
  orderSn: '',
  wechatOrderNum: '',
  date: [],
  startTime: '',
  endTime: ''
})
const filterColumn = [
  {
    title: '交易时间',
    dataIndex: 'date',
    filter: true,
    hideInTable: true,
    valueType: 'dateTimeRange',
    span: 8
  },
  {
    title: '订单编号',
    dataIndex: 'orderSn',
    filter: true,
    hideInTable: true,
    valueType: 'text',
    span: 8,
    formItemProps: {
      placeholder: '请输入订单编号'
    }
  },
  {
    title: '微信订单号',
    dataIndex: 'wechatOrderNum',
    filter: true,
    hideInTable: true,
    valueType: 'text',
    span: 8,
    formItemProps: {
      placeholder: '请输入微信订单号'
    }
  }
]
console.log(filterColumn)
const columns = [
  ...filterColumn,
  {
    title: '交易时间',
    dataIndex: 'tradeTime',
    width: 180
  },
  { title: '订单编号', dataIndex: 'orderSn', width: 250 },
  {
    title: '微信订单号',
    dataIndex: 'wechatOrderNum',
    width: 220
  },
  { title: '应付款金额（元）', dataIndex: 'payable', width: 150 },
  { title: '供货价（元）', dataIndex: 'supplyPrice', width: 180 },
  { title: '服务费（元）', dataIndex: 'serviceFee', width: 180 },
  {
    title: '服务费率（%）',
    dataIndex: 'serviceFeeRatio',
    width: 200
  },
  { title: '买家实付金额（元）', dataIndex: 'payment', width: 180 },
  { title: '价格与优惠（元）', dataIndex: 'discount', width: 180 },
  { title: '购买数量（件）', dataIndex: 'num', width: 150 },
  { title: '购买人', dataIndex: 'buyerName', width: 220 }
]

const handlerSearch = value => {
  setTableFilter(value)
  fetchTableData({ pageSize: 1 })
}
const setTableFilter = value => {
  tableFilter.orderSn = value.orderSn || ''
  tableFilter.date = value.date || []
  tableFilter.wechatOrderNum = value.wechatOrderNum || ''
  tableFilter.startTime = tableFilter.date[0] || ''
  tableFilter.endTime = tableFilter.date[1] || ''
}
const tableData = ref([])
const { pagination, handleTableChange, fetchTableData, loading } = useAntTable({
  fetchFn: async pageOption => {
    const condition = {
      pageSize: pageOption.pageSize,
      page: pageOption.current,
      ...tableFilter,
      id: settlementId
    }
    delete condition.date
    const {
      data: { list, totalRows }
    } = await getSettlementOrderDetailList(condition)
    tableData.value = list
    return {
      total: totalRows
    }
  }
})
const calculationRulesDia = ref(false)
const tableRef = ref()
const getFromValue = () => {
  const form = tableRef.value.getFormRef()
  const value = form.getFieldsValue()
  setTableFilter(value)
  exportExcel()
}
const exportExcel = async () => {
  const paramString = `?startTime=${tableFilter.startTime}&endTime=${tableFilter.endTime}&wechatOrderNum=${tableFilter.wechatOrderNum}&orderSn=${tableFilter.orderSn}&id=${settlementId}`
  const a = document.createElement('a')
  a.download = ''
  a.href = process.env.VUE_APP_BASE_API_2 + '/ec/mall/settlement-order-download' + paramString
  a.click()
}
const settlementMsg = reactive({})
const getDetailMsg = async () => {
  const { data } = await getSettlementOrderDetailMsg(settlementId)
  Object.assign(settlementMsg, data)
}

onMounted(() => {
  fetchTableData()
  getDetailMsg()
})
</script>
