<template>
  <Panel>
    <a-descriptions title="" bordered>
      <a-descriptions-item label="累计交易额（元）" :span="3"
        >¥{{ pfStatistics.cumulativeTransactionAmount }}</a-descriptions-item
      >
      <a-descriptions-item label="商城累计交易额（元）">¥{{ pfStatistics.cumulativeShopPrice }}</a-descriptions-item>
      <a-descriptions-item label="商城已提现（元）">
        ¥{{ pfStatistics.shopWithdraw == null ? 0 : pfStatistics.shopWithdraw }}</a-descriptions-item
      >
      <a-descriptions-item label="商城待提现（元）"> ¥{{ pfStatistics.shopLave }} </a-descriptions-item>
      <a-descriptions-item label="会费累计交易额（元）">¥{{ pfStatistics.cumulativeMemberPrice }} </a-descriptions-item>
      <a-descriptions-item label="会费已提现（元）">
        ¥{{ pfStatistics.memberWithdraw == null ? 0 : pfStatistics.memberWithdraw }}
      </a-descriptions-item>
      <a-descriptions-item label="会费已提现（元）">¥{{ pfStatistics.memberLave }}</a-descriptions-item>
    </a-descriptions>
  </Panel>
  <TableDetail :ckey="ckey" tabName="商城交易详情" :API="getPlatformFinanceShopByCkey" :columns="mallColumns" />
  <TableDetail :ckey="ckey" tabName="会员交易详情" :API="getPlatformFinanceMemberByCkey" :columns="memberFeeColumns" />
  <TableDetail :ckey="ckey" tabName="提现详情" :API="getPlatformFinanceWithdrawByCkey" :columns="withdrawalCols">
    <template #bodyCell="{ record, column }">
      <template v-if="column.dataIndex === 'operate'">
        <a-button type="link" @click="detail(record)">详情</a-button>
      </template>
    </template>
  </TableDetail>
  <DetailModal v-model:visible="detailVisible" :detailObj="detailObj" />
</template>
<script setup>
import {
  getPlatformFinanceDataByCkey,
  getPlatformFinanceShopByCkey,
  getPlatformFinanceMemberByCkey,
  getPlatformFinanceWithdrawByCkey
} from '@business/common/src/finance/api'
import { reactive, defineAsyncComponent, ref } from 'vue'
import { useRoute } from 'vue-router'
import { withdrawalCols } from '@business/common/src/finance/tableCols'
import TableDetail from './tableDetail.vue'
import dayjs from 'dayjs'
const DetailModal = defineAsyncComponent(() => import('@business/components/src/finance/withdrawalDetail.vue'))
const {
  query: { ckey }
} = useRoute()
const pfStatistics = reactive({})
const getStatistics = async () => {
  const {
    data: { financeFullDataResp }
  } = await getPlatformFinanceDataByCkey({ ckey })
  Object.assign(pfStatistics, financeFullDataResp)
}
getStatistics()
const mallColumns = [
  {
    title: '日期',
    dataIndex: 'rptDate',
    customRender: ({ record }) => {
      return dayjs(record.createTime).format('YYYY-MM-DD')
    }
  },
  { title: '交易额(元）', dataIndex: 'shopPrice' }
]
const memberFeeColumns = [
  {
    title: '日期',
    dataIndex: 'rptDate',
    customRender: ({ record }) => {
      return dayjs(record.createTime).format('YYYY-MM-DD')
    }
  },
  { title: '缴费人数(人)', dataIndex: 'memberCount' },
  { title: '交易额（元）', dataIndex: 'memberPrice' }
]
const detailVisible = ref(false)
const detailObj = reactive({})
const detail = record => {
  Object.assign(detailObj, record)
  detailVisible.value = true
}
</script>
