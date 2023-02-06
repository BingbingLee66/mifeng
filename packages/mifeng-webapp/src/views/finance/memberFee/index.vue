<template>
  <Panel>
    <div class="stat-card">
      <div class="card-box" v-for="(item, index) in boardData" :key="index">
        <div class="card-box-3">
          <div class="card-key">{{ item.name }}（元）</div>
          <div class="card-value" :class="index === 2 ? 'member-lave-count' : ''">¥{{ item.count }}</div>
        </div>
        <div class="cut-line" v-show="index !== 2"></div>
      </div>
      <div class="card-box">
        <div class="card-box-3">
          <a-button type="danger" v-action="'前往结算提现'" @click="goSettle">前往结算提现 </a-button>
        </div>
      </div>
    </div>
  </Panel>
  <Panel>
    <a-tabs v-model:activeKey="activeName" class="tabs" @change="changeTab">
      <a-tab-pane v-for="tab in tabList" :key="tab.name" :tab="tab.label" :name="tab.name" />
    </a-tabs>
    <div class="querySearch">
      <TimeFilter @change="dateChange" />
      <a-button type="primary" v-action="'导表'" @click="exportExcel">导表 </a-button>
    </div>
    <a-table
      :loading="loading"
      :dataSource="tableData"
      :columns="activeName === 'data' ? dataCols : detailCols"
      :pagination="pagination"
      @change="handleTableChange"
      :scroll="{ x: 'max-content', y: '30vh' }"
      :row-selection="{ selectedRowKeys, onChange }"
      class="px-4"
    >
    </a-table>
  </Panel>
</template>

<script setup>
import { reactive, onMounted, ref, getCurrentInstance } from 'vue'
import { useAntTable } from '@/use/useAntTable'
import TimeFilter from '../components/timeFilter.vue'
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'
import { exportJson2Excel } from '@/utils/exportExcel'
import {
  getChamberFinanceData,
  getChamberFinanceMemberThisMonth,
  getChamberFinanceMemberDay,
  getChamberFinanceMemberFeeList
} from '@/api/finance/finance'

// 统计面板
const boardData = ref([
  { name: '本月收到会费', count: 0 },
  { name: '累计收到会费', count: 0 },
  { name: '可提现会费', count: 0 }
])
const router = useRouter()
const goSettle = () => {
  router.push({ name: '结算提现' })
}
const getStatistics = () => {
  getChamberFinanceMemberThisMonth().then(response => {
    boardData.value[0].count = response.data.sumMemberPrice
  })
  getChamberFinanceData().then(response => {
    const { cumulativeMemberPrice, memberLave } = response.data.financeFullDataResp
    boardData.value[1].count = cumulativeMemberPrice
    boardData.value[2].count = memberLave
  })
}

// tabs
const activeName = ref('data')
const tabList = ref([
  { name: 'data', label: '会员缴费数据' },
  { name: 'detail', label: '会员缴费详情' }
])
const changeTab = () => {
  selectedRowKeys.value = []
  fetchTableData()
}

// 时间选择
const date = reactive({
  time: []
})
const dateChange = val => {
  date.time = val
  fetchTableData()
}

// 表格
const tableData = ref([])
const dataCols = [
  { title: '日期', dataIndex: 'rptDate', with: 300 },
  { title: '缴费人员', dataIndex: 'memberCount', with: 200 },
  { title: '缴费金额（元）', dataIndex: 'memberPrice' }
]
const detailCols = [
  { title: '会员名字', dataIndex: 'memberName' },
  { title: '职位', dataIndex: 'memberPostName' },
  { title: '手机号', dataIndex: 'phone' },
  {
    title: '缴费时间',
    dataIndex: 'createdTs',
    customRender: ({ record }) => {
      return dayjs(record.createdTs).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  { title: '缴费金额（元）', dataIndex: 'feeAmount' }
]

const { pagination, handleTableChange, fetchTableData, loading } = useAntTable({
  fetchFn: async pageOption => {
    const condition = {
      pageSize: pageOption.pageSize,
      page: pageOption.current,
      startTime: date.time[0] || '',
      endTime: date.time[1] || ''
    }
    const {
      data: {
        data: { list, totalRows }
      }
    } =
      activeName.value === 'data'
        ? await getChamberFinanceMemberDay(condition)
        : await getChamberFinanceMemberFeeList(condition)
    list.length &&
      list.forEach((e, index) => {
        e.key = index + pageOption.pageSize * (pageOption.current - 1)
      })
    tableData.value = list
    return {
      total: totalRows
    }
  }
})

// 导表
const selectedRowKeys = ref([])
let selectedData = []
const onChange = (selected, selectedRow) => {
  selectedRowKeys.value = selected
  selectedData = selectedRow
}
const { proxy } = getCurrentInstance()
const exportExcel = () => {
  if (selectedRowKeys.value.length === 0) {
    proxy.$message.error('没有选择记录，操作失败')
    return
  }
  const list = []
  let title = ''
  if (activeName.value === 'data') {
    title = '会员缴费数据'
    for (const data of selectedData) {
      const new_data = {
        日期: dayjs(data.rptDate).format('YYYY-MM-DD'),
        缴费人数: data.memberCount,
        '缴费金额(元)': data.memberPrice
      }
      list.push(new_data)
    }
  } else {
    title = '会员缴费详情'
    for (const data of selectedData) {
      const new_data = {
        会员名字: data.memberName,
        职位: data.memberPostName,
        手机号: data.phone,
        缴费时间: dayjs(data.createdTs).format('YYYY-MM-DD'),
        '缴费金额(元)': data.feeAmount
      }
      list.push(new_data)
    }
  }
  exportJson2Excel(title, list)
}

onMounted(() => {
  getStatistics()
  fetchTableData()
})
</script>

<style scoped>
.stat-card {
  width: 100%;
  height: 120px;
  border-radius: 10px;
  border: 1px solid #ccc;
  display: flex;
}

.card-box {
  width: 19.5%;
  height: 100%;
  text-align: center;
  display: table;
  margin-left: 10px;
}

.card-box-3 {
  width: 100%;
  display: table-cell;
  vertical-align: middle;
}

.card-value {
  margin-top: 10px;
  color: #008000;
  font-weight: 600;
}

.cut-line {
  float: left;
  margin-top: 42px;
  width: 1px;
  height: 36px;
  border-left: 1px solid #ccc;
}
.querySearch {
  display: flex;
  justify-content: space-between;
}
.time-group {
  margin-right: 10px;
}
.member-lave-count {
  color: #ff0000;
}
</style>
