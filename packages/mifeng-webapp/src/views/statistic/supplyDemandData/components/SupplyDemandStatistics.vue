<template>
  <Panel>
    <div style="height: 20px; margin-bottom: 10px">
      <span style="float: right" class="text-btn-style" @click="showMeaning = true">数据定义</span>
    </div>
    <div class="data-card">
      <div class="d-card-box" v-for="dataItem in dataList" :key="dataItem.name">
        <div class="card-key">{{ dataItem.name }}</div>
        <div class="card-value" v-html="dataItem.value" />
      </div>
    </div>
  </Panel>
  <a-modal title="数据定义" v-model:visible="showMeaning" width="480px" :footer="null" @ok="showMeaning = false">
    <div class="meaning-wrap">
      <div class="meaning-item" v-for="defineItem in defineList" :key="defineItem.title">
        <div class="tit">{{ defineItem.title }}</div>
        <div class="sub" v-html="defineItem.text" />
      </div>
    </div>
    <div name="okButton" style="text-align: center">
      <a-button type="primary" @click="showMeaning = false">我知道了</a-button>
    </div>
  </a-modal>
  <Panel>
    <div class="my-5">
      <TimerSizer @fetchTableData="getQuery"></TimerSizer>
      <a-button type="primary" style="float: right" @click="exportExcel">导表</a-button>
    </div>
    <a-table
      class="px-4"
      :loading="loading"
      :dataSource="tableData"
      :columns="columns"
      :pagination="pagination"
      @change="handleTableChange"
      :scroll="{ x: 'max-content', y: '30vh' }"
      :row-selection="{ onChange, selectedRowKeys: selectedTableRow, preserveSelectedRowKeys: true }"
    >
    </a-table>
  </Panel>
</template>
<script>
import { inject, reactive, ref, defineAsyncComponent } from 'vue'
import { getSupplyDemandTotalStats, getSupplyDemandStatsList } from '@/api/statistic/supplyDemand'
import { exportJson2Excel } from '@/utils/exportExcel'
import { message } from 'ant-design-vue'
import { useAntTable } from '@/use/useAntTable'
export default {
  components: {
    TimerSizer: defineAsyncComponent(() => import('../../../../components/statistic/TimeSizer/index.vue'))
  },
  setup() {
    const defineList = [
      {
        title: '累计发布供需总数',
        text: '在指定时间范围内，全平台用户发布的供需总数，含“生效中”和“已关闭”的供需总数'
      },
      {
        title: '累计发布供应数',
        text: '在指定时间范围内，全平台用户发布的供应总数，含“生效中”和“已关闭”的供应总数'
      },
      {
        title: '累计发布需求数',
        text: '在指定时间范围内，全平台用户发布的需求总数，含“生效中”和“已关闭”状态的需求总数'
      },
      {
        title: '访问人数/uv',
        text: '在指定时间范围内，访问过供需详情页的总人数 <span style="color: red;">(需去重)</span>'
      },
      {
        title: '访问次数/pv',
        text: '在指定时间范围内，访问过供需详情页的总次数'
      },
      {
        title: '累计成交总数',
        text: '在指定时间范围内，供需状态为“已关闭 (成功合作)”的总数。'
      },
      {
        title: '累计终止总数',
        text: '在指定时间范围内，供需状态为“已关闭 (终止对接)”的总数。'
      },
      {
        title: '累计过期总数',
        text: '在指定时间范围内，供需状态为“已关闭 (过期关闭)”的总数。'
      }
    ]
    const columns = [
      { title: '日期', dataIndex: 'date' },
      { title: '发布供应数', dataIndex: 'supplyNum' },
      { title: '发布需求数', dataIndex: 'needNum' },
      { title: '发布总数', dataIndex: 'totalNum' },
      { title: '成交总数', dataIndex: 'cooperateNum' },
      { title: '终止总数', dataIndex: 'stopNum' },
      { title: '过期总数', dataIndex: 'expireNum' }
    ]
    const { dataList } = getStatistics()
    const { pagination, handleTableChange, fetchTableData, loading, getQuery, tableData } = getTableData()
    const { selectedTableRow, onChange, exportExcel } = exportXLSX()
    return {
      defineList,
      columns,
      dataList,
      showMeaning: ref(false),
      selectedTableRow,
      onChange,
      exportExcel,
      pagination,
      handleTableChange,
      fetchTableData,
      loading,
      getQuery,
      tableData
    }
  }
}

function getStatistics() {
  const ckey = inject('ckey')
  const cValue = ckey.value || ''
  const dataList = ref([])
  async function getSupplyDemandTotal() {
    const { data } = await getSupplyDemandTotalStats(cValue ? { ckey: cValue } : null)
    const totalStats = data || {}
    dataList.value = [
      { name: '累计成交总数', value: totalStats.cooperateNum },
      { name: '累计发布供应数', value: totalStats.provideNum },
      { name: '累计发布需求数', value: totalStats.needNum },
      { name: '累计访问人数', value: `<span style="color: red">${totalStats.uv || 0}</span>` },
      { name: '累计访问次数', value: totalStats.pv },
      { name: '累计发布总数', value: totalStats.publishNum },
      { name: '累计终止总数', value: totalStats.stopNum },
      { name: '累计过期总数', value: totalStats.expireNum }
    ]
  }
  getSupplyDemandTotal()
  return { dataList, ckey }
}

function getTableData() {
  const query = reactive({
    days: '',
    date: '',
    type: ''
  })
  const tableData = ref([])
  const ckey = inject('ckey')
  const { pagination, handleTableChange, fetchTableData, loading } = useAntTable({
    fetchFn: async pageOption => {
      const condition = {
        pageSize: pageOption.pageSize,
        page: pageOption.current,
        beginTime: query.date[0] || '',
        endTime: query.date[1] || '',
        type: query.type,
        ckey: ckey.value
      }
      const {
        data: { list, totalRows }
      } = await getSupplyDemandStatsList(condition)
      if (list) {
        list.forEach((e, index) => {
          e.key = index + pageOption.pageSize * (pageOption.current - 1)
        })
      }
      tableData.value = list

      return {
        total: totalRows
      }
    }
  })
  const getQuery = q => {
    query.days = q.days
    query.date = q.date
    query.type = q.type
    fetchTableData()
  }
  return { pagination, handleTableChange, fetchTableData, loading, getQuery, tableData }
}

// 导出表格
function exportXLSX() {
  const selectedTableRow = ref([])
  const tempSelectDatas = ref([])
  const onChange = (index, row) => {
    selectedTableRow.value = index
    tempSelectDatas.value = row.filter(item => item !== undefined)
  }
  const exportExcel = () => {
    const selectionDatas = handleData(tempSelectDatas.value)
    exportJson2Excel('供需数据统计', selectionDatas)
  }
  const handleData = list => {
    if (list.length < 1) {
      message.warn('请选择导出记录')
      return
    }
    const newList = list.map(v => ({
      日期: v.date,
      发布供应数: v.supplyNum,
      发布需求数: v.needNum,
      发布总数: v.totalNum,
      成交总数: v.cooperateNum,
      终止总数: v.stopNum,
      过期总数: v.expireNum
    }))
    return newList
  }
  return { selectedTableRow, onChange, exportExcel }
}
</script>
<style lang="scss" scoped>
.data-card {
  width: 100%;
  height: 120px;
  border-radius: 2px;
  border: 1px solid #ccc;
  display: flex;
  border-right: none;
}

.d-card-box {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-right: 1px solid #ccc;
}

.card-value {
  margin-top: 10px;
  color: #008000;
  font-weight: 600;
}
</style>
