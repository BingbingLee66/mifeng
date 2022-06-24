<template>
  <div>
    <DataBoard :list="dataList" :define-list="defineList" />

    <ChamberSelector v-if="isTopBackStage" style="margin-top:10px;" @change="onChamberChange" />

    <div class="flex-x-between">
      <TimeSizer :query="query" @change="onQueryChange({pageNum:1})" />
      <div class="block"><ExportTable :data="selectionDatas" title="供需统计数据" /></div>
    </div>

    <KdTable v-loading="loading" :list="tableList" :data="tableData" @selection-change="onSelectionChange" />

    <KdPagination :page-size="query.pageSize" :current-page="query.pageNum" :total="total" @change="onQueryChange" />

  </div>
</template>

<script>
import { getSupplyDemandStatsList, getSupplyDemandTotalStats } from '@/api/statistics/supplyDemand'

export default {
  components: {
    DataBoard: () => import('@/components/statistic/DataBoard'),
    ChamberSelector: () => import('@/components/statistic/ChamberSelector'),
    TimeSizer: () => import('@/components/statistic/TimeSizer'),
    ExportTable: () => import('@/components/statistic/ExportTable'),
    KdPagination: () => import('@/components/common/KdPagination'),
    KdTable: () => import('@/components/KdTable')
  },
  props: {},
  data() {
    return {
      totalStats: {},
      defineList: [
        {
          title: '累计发布供需总数',
          text: '在指定时间范围内，全平台用户发布的供需总数，含“生效中”和“已关闭”的供需总数' },
        {
          title: '累计发布供应数',
          text: '在指定时间范围内，全平台用户发布的供应总数，含“生效中”和“已关闭”的供应总数' },
        {
          title: '累计发布需求数',
          text: '在指定时间范围内，全平台用户发布的需求总数，含“生效中”和“已关闭”状态的需求总数' },
        {
          title: '访问人数/uv',
          text: '在指定时间范围内，访问过供需详情页的总人数 <span class="red-label">(需去重)</span>' },
        {
          title: '访问次数/pv',
          text: '在指定时间范围内，访问过供需详情页的总次数' },
        {
          title: '累计成交总数',
          text: '在指定时间范围内，供需状态为“已关闭 (成功合作)”的总数。' },
        {
          title: '累计终止总数',
          text: '在指定时间范围内，供需状态为“已关闭 (终止对接)”的总数。' },
        {
          title: '累计过期总数',
          text: '在指定时间范围内，供需状态为“已关闭 (过期关闭)”的总数。' },
      ],

      query: {
        ckey: '',
        days: 7,
        type: 1,
        date: [],
        pageSize: 10,
        pageNum: 1,
      },

      total: 0,

      chamberOptions: [],

      tableList: [
        { type: 'selection', width: 55 },
        { label: '日期', prop: 'date' },
        { label: '发布供应数', prop: 'supplyNum' },
        { label: '发布需求数', prop: 'needNum' },
        { label: '发布总数', prop: 'totalNum' },
        { label: '成交总数', prop: 'cooperateNum' },
        { label: '终止总数', prop: 'stopNum' },
        { label: '过期总数', prop: 'expireNum' },
      ],

      tableData: [],
      loading: false,

      selectionDatas: []
    }
  },
  computed: {
    ckey() {
      return this.$store.getters.ckey
    },
    isTopBackStage() {
      return !this.ckey
    },
    dataList() {
      const { totalStats } = this
      return [
        { name: '累计成交总数', value: totalStats.cooperateNum },
        { name: '累计发布供应数', value: totalStats.provideNum },
        { name: '累计发布需求数', value: totalStats.needNum },
        { name: '累计访问人数', value: `<span class="red-label">${totalStats.uv}</span>` },
        { name: '累计访问次数', value: totalStats.pv },
        { name: '累计发布总数', value: totalStats.publishNum },
        { name: '累计终止总数', value: totalStats.stopNum },
        { name: '累计过期总数', value: totalStats.expireNum },
      ]
    }
  },

  created() {
    this.getSupplyDemandTotalStats()
  },

  methods: {

    normalizeParams() {
      const { date = [], pageNum, pageSize, type, ckey } = this.query
      const params = {
        beginTime: date[0],
        endTime: date[1],
        pageNum,
        pageSize,
        type
      }
      if (ckey) params.ckey = ckey
      if (this.ckey) params.ckey = this.ckey
      return params
    },

    async getSupplyDemandStatsList() {
      this.loading = true
      try {
        const { data: { list = [], totalRows = 0 }} = await getSupplyDemandStatsList(this.normalizeParams())
        this.tableData = list
        this.total = totalRows
      } catch (error) { /*  */ }
      this.loading = false
    },

    async getSupplyDemandTotalStats() {
      const ckey = this.ckey || this.query.ckey
      const { data } = await getSupplyDemandTotalStats(ckey ? { ckey } : null)
      this.totalStats = data
    },

    onChamberChange(e) {
      this.query.ckey = e
      this.getSupplyDemandStatsList()
      this.getSupplyDemandTotalStats()
    },

    onQueryChange(e = {}) {
      this.query = { ...this.query, ...e }
      this.getSupplyDemandStatsList()
    },

    onSelectionChange(e) {
      this.selectionDatas = e.map(v => ({
        '日期': v.date,
        '发布供应数': v.supplyNum,
        '发布需求数': v.needNum,
        '发布总数': v.totalNum,
        '成交总数': v.cooperateNum,
        '终止总数': v.stopNum,
        '过期总数': v.expireNum
      }))
    },

  },
}
</script>

<style lang="scss" scoped>
.time {
  color: #bbb;
  margin-right: 20px;
}

.filtrate {
  display: flex;
  justify-content: space-between;
}

</style>
