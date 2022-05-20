<template>
  <div>
    <DataDimension v-if="isTopBackStage" @change="onQueryChange({ckey:$event})" />

    <TimeSizer layout="days, date" @change="onQueryChange" />

    <el-row :gutter="20">
      <el-col v-for="(item,i) in layoutList" :key="i" :span="24 / layoutList.length ">
        <KdTable v-loading="item.loading" :data="item.data" :list="item.tableList" />
        <KdPagination :page-size="item.pageSize" :current-page="item.pageNum" :total="item.total" @change="onPageChange($event,item,i)" />
      </el-col>
    </el-row>

  </div>
</template>

<script>
import { getLabelHotList, getTradeHotList } from '@/api/statistics/supplyDemand'

export default {
  components: {
    DataDimension: () => import('@/components/statistic/DataDimension'),
    TimeSizer: () => import('@/components/statistic/TimeSizer'),
    KdTable: () => import('@/components/KdTable'),
    KdPagination: () => import('@/components/common/KdPagination'),
  },

  data() {
    return {
      query: {
        ckey: '',
        days: 7,
        type: 1,
        date: [],
      },

      layoutList: [
        {
          tableList: [{
            label: '标签榜', headerAlign: 'center',
            children: [
              { label: '排名', prop: 'rank' },
              { label: '标签名称', prop: 'labelName' },
              { label: '累计使用总数', prop: 'num' },
              { label: '供应使用数', prop: 'provideNum' },
              { label: '需求使用数', prop: 'needNum' },
            ]
          }],
          data: [],
          pageSize: 10,
          pageNum: 1,
          total: 0,
          loading: false
        },
        {
          tableList: [{
            label: '行业榜', headerAlign: 'center',
            children: [
              { label: '排名', prop: 'rank' },
              { label: '行业名称', prop: 'tardeName' },
              { label: '累计使用总数', prop: 'num' },
              { label: '供应使用数', prop: 'provideNum' },
              { label: '需求使用数', prop: 'needNum' },
            ]
          }],
          data: [],
          pageSize: 10,
          pageNum: 1,
          total: 0,
          loading: false
        }
      ],
    }
  },
  computed: {
    ckey() {
      return this.$store.getters.ckey
    },
    isTopBackStage() {
      return !this.ckey
    }
  },
  methods: {
    normalizeQuery(item) {
      const params = {}
      if (this.query.ckey) params.ckey = this.query.ckey
      if (this.ckey) params.ckey = this.ckey
      params.startTime = this.query.date[0]
      params.endTime = this.query.date[1]
      params.page = item.pageNum
      params.pageSize = item.pageSize
      return params
    },

    async getHotRank(index) {
      const item = this.layoutList[index]
      item.loading = true
      try {
        const { data: { list = [], totalRows = 0 }} = await (index === 0 ? getLabelHotList : getTradeHotList)(this.normalizeQuery(item))
        list.forEach((v, i) => {
          v.rank = i + 1 + (item.pageNum - 1) * item.pageSize
        })
        item.data = list
        item.total = totalRows
      } catch (error) { /*  */ }
      item.loading = false
    },

    onQueryChange(e) {
      this.query = { ...this.query, ...e }
      this.layoutList.forEach((v, i) => this.onPageChange({ pageNum: 1 }, v, i))
    },

    onPageChange(e, item, index) {
      Object.entries(e).forEach(([key, value]) => (item[key] = value))
      this.getHotRank(index)
    }
  },
}
</script>

<style lang="sass" scoped>
//
</style>
