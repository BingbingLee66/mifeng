<template>
  <panel>
    <TimerSizer :layout="'days,date'" @fetchTableData="getQuery"></TimerSizer>
    <a-row :gutter="20" style="margin-top: 10px" class="px-4">
      <a-col v-for="(item, i) in layoutList" :key="i" span="12">
        <template v-if="i == 0">
          <a-table
            :loading="labelLoading"
            :dataSource="item.data"
            :columns="item.columns"
            @change="labelHandleTableChange"
            :pagination="labelPagination"
          />
        </template>
        <template v-else>
          <a-table
            :loading="tradeLoading"
            :dataSource="item.data"
            :columns="item.columns"
            @change="tradeHandleTableChange"
            :pagination="tradePagination"
          />
        </template>
      </a-col>
    </a-row>
  </panel>
</template>
<script>
import { inject, reactive, defineAsyncComponent } from 'vue'
import { useAntTable } from '@/use/useAntTable'
import { getLabelHotList, getTradeHotList } from '@/api/statistic/supplyDemand'
export default {
  components: {
    TimerSizer: defineAsyncComponent(() => import('../../../../components/statistic/TimeSizer/index.vue'))
  },
  setup() {
    const layoutList = reactive([
      {
        columns: [
          {
            title: '标签榜',
            headerAlign: 'center',
            children: [
              { title: '排名', dataIndex: 'rank' },
              { title: '标签名称', dataIndex: 'labelName', width: 150 },
              { title: '累计使用总数', dataIndex: 'num', width: 120 },
              { title: '供应使用数', dataIndex: 'provideNum', width: 120 },
              { title: '需求使用数', dataIndex: 'needNum', width: 120 }
            ]
          }
        ],
        data: []
      },
      {
        columns: [
          {
            title: '行业榜',
            headerAlign: 'center',
            children: [
              { title: '排名', dataIndex: 'rank' },
              { title: '行业名称', dataIndex: 'tardeName', width: 150 },
              { title: '累计使用总数', dataIndex: 'num', width: 120 },
              { title: '供应使用数', dataIndex: 'provideNum', width: 120 },
              { title: '需求使用数', dataIndex: 'needNum', width: 120 }
            ]
          }
        ],
        data: []
      }
    ])

    const query = reactive({
      days: '',
      date: '',
      type: ''
    })
    const getQuery = q => {
      query.days = q.days
      query.date = q.date
      query.type = q.type
      labelFetchTableData()
      tradeFetchTableData()
    }
    const ckey = inject('ckey')

    const {
      pagination: labelPagination,
      handleTableChange: labelHandleTableChange,
      fetchTableData: labelFetchTableData,
      loading: labelLoading
    } = useAntTable({
      fetchFn: async pageOption => {
        const { pageSize, current } = pageOption
        const condition = {
          pageSize,
          page: current,
          startTime: query.date[0] || '',
          endTime: query.date[1] || '',
          ckey: ckey.value
        }
        const {
          data: { list, totalRows }
        } = await getLabelHotList(condition)
        layoutList[0].data = list
        layoutList[0].data.forEach((item, index) => {
          item.rank = index + (current - 1) * pageSize + 1
        })
        return {
          total: totalRows
        }
      }
    })

    const {
      pagination: tradePagination,
      handleTableChange: tradeHandleTableChange,
      fetchTableData: tradeFetchTableData,
      loading: tradeLoading
    } = useAntTable({
      fetchFn: async pageOption => {
        const { pageSize, current } = pageOption
        const condition = {
          pageSize,
          page: current,
          startTime: query.date[0] || '',
          endTime: query.date[1] || '',
          ckey: ckey.value
        }
        const {
          data: { list, totalRows }
        } = await getTradeHotList(condition)
        layoutList[1].data = list
        layoutList[1].data.forEach((item, index) => {
          item.rank = index + (current - 1) * pageSize + 1
        })
        return {
          total: totalRows
        }
      }
    })
    return {
      getQuery,
      layoutList,
      labelPagination,
      labelHandleTableChange,
      labelFetchTableData,
      labelLoading,
      tradePagination,
      tradeHandleTableChange,
      tradeFetchTableData,
      tradeLoading
    }
  }
}
</script>
<style lang="scss" scoped></style>
