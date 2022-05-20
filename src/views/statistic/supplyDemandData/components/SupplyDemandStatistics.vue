<template>
  <div>
    <DataBoard :list="dataList" :define-list="defineList" />

    <DataDimension @change="onQueryChange({ckey:$event})" />

    <div class="flex-x-between">
      <TimeSizer @change="onQueryChange" />
      <div class="block"><el-button type="primary" size="mini">导表</el-button></div>
    </div>

    <KdTable :list="tableList" :data="tableData" @selection-change="onSelectionChange" />

    <KdPagination :page-size="query.pageSize" :total="total" @change="onQueryChange" />

  </div>
</template>

<script>
import { exportJson2Excel } from '@/utils/exportExcel'

export default {
  components: {
    DataBoard: () => import('@/components/statistic/DataBoard'),
    DataDimension: () => import('@/components/statistic/DataDimension'),
    TimeSizer: () => import('@/components/statistic/TimeSizer'),
    KdPagination: () => import('@/components/common/KdPagination'),
    KdTable: () => import('@/components/KdTable')
  },
  props: {},
  data() {
    return {
      dataList: [
        { name: '累计成交总数', value: '' },
        { name: '累计发布供应数', value: '' },
        { name: '累计发布需求数', value: '' },
        { name: '累计访问人数', value: '' },
        { name: '累计访问次数', value: '' },
        { name: '累计发布总数', value: '' },
        { name: '累计终止总数', value: '' },
        { name: '累计过期总数', value: '' },
      ],
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
        date: '',
        pageSize: 10,
        pageNum: 1,
      },

      total: 0,

      chamberOptions: [],

      listLoading: false,

      tableData: [],

      selectionDatas: []
    }
  },
  computed: {
    tableList() {
      return [
        { type: 'selection', width: 55 },
        { label: '日期' },
        { label: '发布需求数' },
        { label: '发布总数' },
        { label: '成交总数' },
        { label: '终止总数' },
        { label: '过期总数' },
      ]
    }
  },

  methods: {

    fetchData() {
    },

    onQueryChange(e) {
      this.query = { ...this.query, ...e }
      this.fetchData()
    },

    exportExcel(e) {
      if (!this.selectionDatas.length) return this.$message.error({ message: '没有选择记录，操作失败' })

      exportJson2Excel('会员入驻数据', this.selectionDatas)
    },

    onSelectionChange(e) {
      console.log(e)
      this.selectionDatas = e
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
