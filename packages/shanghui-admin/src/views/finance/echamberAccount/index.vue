<template>
  <Panel>
    <div class="block">
      <div class="stat-card">
        <div class="left-box">
          <div class="card-box-1">
            <div class="card-key">平台累计交易额（元）</div>
            <div class="card-value">¥{{ pfStatistics.cumulativeTransactionAmount }}</div>
          </div>
        </div>
        <div class="right-box">
          <div class="box-line">
            <div class="card-box-2">
              <div class="card-key">商城累计交易额（元）</div>
              <div class="card-value">¥{{ pfStatistics.cumulativeShopPrice }}</div>
            </div>
            <div class="card-box-2">
              <div class="card-key">商城已提现（元）</div>
              <div class="card-value">¥{{ pfStatistics.shopWithdraw == null ? 0 : pfStatistics.shopWithdraw }}</div>
            </div>
            <div class="card-box-2" style="border-right: 0">
              <div class="card-key">商城待提现（元）</div>
              <div class="card-value" style="color: #ff0000">¥{{ pfStatistics.shopLave }}</div>
            </div>
          </div>
          <div class="box-line" style="border-bottom: 0">
            <div class="card-box-2">
              <div class="card-key">会费累计交易额（元）</div>
              <div class="card-value">¥{{ pfStatistics.cumulativeMemberPrice }}</div>
            </div>
            <div class="card-box-2">
              <div class="card-key">会费已提现（元）</div>
              <div class="card-value">¥{{ pfStatistics.memberWithdraw == null ? 0 : pfStatistics.memberWithdraw }}</div>
            </div>
            <div class="card-box-2" style="border-right: 0">
              <div class="card-key">会费待提现（元）</div>
              <div class="card-value" style="color: #ff0000">¥{{ pfStatistics.memberLave }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex-x">
        <div class="extra-box">
          <div class="extra-card-box">
            <div class="card-key">累计收取微信手续费（元）</div>
            <div class="card-value">¥{{ pfStatistics.cumulativeWechatDeduction }}</div>
          </div>
        </div>
        <div class="extra-box" style="background-color: rgba(169, 254, 137, 1)">
          <div class="extra-card-box">
            <div class="card-key">累计收取平台服务费（元）</div>
            <div class="card-value">¥{{ pfStatistics.cumulativePlatfromDeduction }}</div>
          </div>
        </div>
      </div>
    </div>
  </Panel>
  <Panel>
    <a-tabs v-model:activeKey="activeName" @change="tabChange">
      <a-tab-pane :key="ECHAMBER_TABS.TRADE" tab="交易数据" />
      <a-tab-pane :key="ECHAMBER_TABS.WITHDRAWALS" tab="提现记录" />
    </a-tabs>
    <div class="flex-x-between">
      <TimeFilter @change="dateChange" />
      <a-button type="primary" @click="exportExcel">导表</a-button>
    </div>
    <PlusTable
      :scroll="{ x: 'max-content' }"
      :columns="activeName === ECHAMBER_TABS.TRADE ? tradeCol : withdrawalCols"
      :data-source="tableData"
      :pagination="pagination"
      :loading="loading"
      @change="handleTableChange"
      row-key="id"
      class="p0"
      :rowSelection="rowSelection"
    >
      <template #bodyCell="{ record, column }">
        <template v-if="column.dataIndex === 'operate'">
          <a-button type="link" v-action="'提现记录-详情'" @click="detail(record)">详情</a-button>
        </template>
      </template>
    </PlusTable>
  </Panel>
  <DetailModal v-model:visible="detailVisible" :detailObj="detailObj" />
</template>
<script setup>
import { reactive, ref, defineAsyncComponent } from 'vue'
import { withdrawalCols } from '@business/common/src/finance/tableCols'
import { ECHAMBER_TABS } from '@business/common/src/finance/constant'
import TimeFilter from '@business/components/src/finance/tableFilter.vue'
import { useAntTable } from '@business/logics/src/useAntTable/index'
import dayjs from 'dayjs'
import {
  getPlatformFinanceData,
  getPlatformFinanceDayData,
  getPlatformFinanceWithdraw
} from '@business/common/src/finance/api'
import { useRowSelection } from '@business/logics/src/useRowSelection'
import { message } from 'ant-design-vue'
import { exportJson2Excel } from '@business/common/src/utils/exportExcel'
const DetailModal = defineAsyncComponent(() => import('@business/components/src/finance/withdrawalDetail.vue'))
const tradeCol = [
  {
    title: '日期',
    dataIndex: 'rptDate',
    customRender: ({ record }) => {
      return dayjs(record.rptDate).format('YYYY-MM-DD')
    }
  },
  {
    title: '商城交易额(元）',
    dataIndex: 'cumulativeShopPrice'
  },
  {
    title: '会费交易额（元）',
    dataIndex: 'cumulativeMemberPrice'
  },
  {
    title: '合计（元）',
    dataIndex: 'cumulativeMemberPrice',
    customRender: ({ record }) => {
      return Math.floor((record.cumulativeShopPrice + record.cumulativeMemberPrice) * 100) / 100
    }
  }
]
const activeName = ref('12')
const tableFilter = reactive({
  startTime: '',
  endTime: ''
})
const dateChange = date => {
  const [startTime, endTime] = date
  tableFilter.startTime = startTime
  tableFilter.endTime = endTime
  fetchTableData(true)
}
const tableData = ref([])
const { pagination, handleTableChange, fetchTableData, loading } = useAntTable({
  fetchFn: async pageOption => {
    const condition = {
      pageSize: pageOption.pageSize,
      page: pageOption.current,
      ...tableFilter
    }
    let API = getPlatformFinanceDayData
    if (activeName.value === ECHAMBER_TABS.WITHDRAWALS) API = getPlatformFinanceWithdraw
    const {
      data: {
        data: { list, totalRows }
      }
    } = await API(condition)
    tableData.value = list
    return {
      total: totalRows
    }
  }
})
const pfStatistics = reactive({})
const getStatistics = async () => {
  const {
    data: { financeFullDataResp }
  } = await getPlatformFinanceData()
  Object.assign(pfStatistics, financeFullDataResp)
}
getStatistics()
const detailVisible = ref(false)
const detailObj = reactive({})
const detail = record => {
  Object.assign(detailObj, record)
  detailVisible.value = true
}
const rowSelection = useRowSelection()
const handleTradeData = selectedItems => {
  const list = selectedItems.map(item => {
    const new_data = {
      日期: dayjs(item.rptDate).format('YYYY-MM-DD'),
      '商城交易额(元）': item.cumulativeShopPrice,
      '会费交易额（元）': item.cumulativeMemberPrice,
      '合计（元）': Math.floor((item.cumulativeShopPrice + item.cumulativeMemberPrice) * 100) / 100
    }
    return new_data
  })
  return list
}
const handelWithdrawal = selectedItems => {
  const list = selectedItems.map(item => {
    const new_data = {
      提现日期: dayjs(item.createTime).format('YYYY-MM-DD'),
      申请方: item.chamberName,
      提现类型: item.type === 0 ? '商城' : '会费',
      '申请提现金额(元)': item.applyPrice,
      '微信手续费(元)': item.wechatPrice,
      '打款金额(元)': item.realPrice,
      状态: item.status === 0 ? '审核中' : item.status === 1 ? '提现成功' : '提现失败'
    }
    return new_data
  })
  return list
}
const exportExcel = () => {
  const { selectedRowKeys, selectedRowItems } = rowSelection
  if (selectedRowKeys.length === 0) return message.error('没有选择记录，操作失败')
  let title = ''
  let list = []
  if (activeName.value === ECHAMBER_TABS.WITHDRAWALS) {
    list = handelWithdrawal(selectedRowItems)
    title = '提现记录'
  } else {
    title = '交易数据'
    list = handleTradeData(selectedRowItems)
  }
  exportJson2Excel(title, list)
}
const tabChange = () => {
  rowSelection.selectedRowKeys = []
  fetchTableData(true)
}
</script>
<style lang="scss" scoped>
:deep(.ant-tabs-nav) {
  margin-bottom: 16px;
}
.stat-card {
  width: 100%;
  height: 120px;
  border-radius: 10px;
  border: 1px solid #ccc;
}
.left-box {
  float: left;
  width: 25%;
  height: 100%;
  text-align: center;
  display: table;
}
.right-box {
  width: 75%;
  height: 100%;
  text-align: center;
  display: table;
}
.card-box-1 {
  width: 100%;
  display: table-cell;
  vertical-align: middle;
  border-right: 1px solid #ccc;
}
.card-box-2 {
  width: 33%;
  display: table-cell;
  vertical-align: middle;
  border-right: 1px solid #ccc;
}
.box-line {
  width: 100%;
  height: 60px;
  display: table;
  border-bottom: 1px solid #ccc;
}
.card-value {
  margin-top: 10px;
  color: #008000;
  font-weight: 600;
}
.extra-box {
  margin: 20px 10px 0 0;
  width: 280px;
  height: 120px;
  border-radius: 5px;
  border: 1px solid #ccc;
  background-color: rgba(255, 219, 136, 1);
  text-align: center;
  display: table;
}
.extra-card-box {
  width: 100%;
  display: table-cell;
  vertical-align: middle;
}
</style>
