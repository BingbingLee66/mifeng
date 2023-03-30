<template>
  <PlusTable
    :scroll="{ x: 'max-content' }"
    :columns="columns"
    :data-source="tableData"
    :pagination="pagination"
    :loading="loading"
    @change="handleTableChange"
  >
    <template #bodyCell="{ record, column }">
      <template v-if="column.dataIndex === 'operate'">
        <a-button type="link" @click="detail(record)" v-action="'详情'">详情</a-button>
      </template>
    </template>
  </PlusTable>
</template>
<script setup>
import { useAntTable } from '@business/logics/src/useAntTable/index'
import { getPlatformFinanceChamber, getChamberOptions } from '@business/common/src/finance/api'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const columns = [
  {
    title: '商会名称',
    dataIndex: 'ckey',
    width: 150,
    customRender: ({ record }) => {
      return getChamberName(record.ckey)
    }
  },
  { title: '商城交易金额（元）', dataIndex: 'cumulativeShopPrice', width: 180 },
  { title: '会费金额(元)', dataIndex: 'cumulativeMemberPrice', width: 180 },
  {
    title: '合计(元)',
    dataIndex: 'total',
    width: 180,
    customRender: ({ record }) => {
      return Math.floor((record.cumulativeShopPrice + record.cumulativeMemberPrice) * 100) / 100
    }
  },
  {
    title: '待提现(元)',
    dataIndex: 'cumulativeShopDeduction',
    width: 180,
    customRender: ({ record }) => {
      return Math.floor((record.cumulativeMemberDeduction + record.cumulativeShopDeduction) * 100) / 100
    }
  },
  {
    title: '操作',
    dataIndex: 'operate',
    fixed: 'right',
    width: 150
  }
]
const tableData = ref([])
const { pagination, handleTableChange, fetchTableData, loading } = useAntTable({
  fetchFn: async pageOption => {
    const condition = {
      pageSize: pageOption.pageSize,
      page: pageOption.current
    }
    const {
      data: {
        data: { list, totalRows }
      }
    } = await getPlatformFinanceChamber(condition)
    tableData.value = list
    return {
      total: totalRows
    }
  }
})
fetchTableData()
const chamberOptions = ref([])
const getChamberOptionsList = async () => {
  const {
    data: { data }
  } = await getChamberOptions()
  chamberOptions.value = data
}
getChamberOptionsList()
const getChamberName = ckey => {
  const chamber = chamberOptions.value.filter(item => {
    return ckey === item.value
  })[0]
  return chamber?.label || ''
}
const router = useRouter()
const detail = ({ ckey }) => {
  router.push({
    name: '交易详情',
    query: {
      ckey
    }
  })
}
</script>
