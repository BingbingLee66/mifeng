import { getActivitySummaryStatistics, getActivitySummaryChamber } from '@/api/statistics/activityData'

export default {
  data() {
    return {
      sumData: {},
      dataList: [], // 关联渠道列表
      showMeaning: false,
      pageSizes: [10, 20, 50, 100, 500],
      total: 0,
      sort: 1,
      column: 0,
      list: [],
      currentpage: 1,
      limit: 10,
      listLoading: false
    }
  },
  created() {
    this.getActSumData()
    this.getActSumChamberData()
  },
  methods: {
    has(tabName, actionName) {
      return this.$store.getters.has({ tabName, actionName })
    },
    getId(tabName, actionName) {
      return this.$store.getters.getId({ tabName, actionName })
    },
    // 获取活动统计汇总
    getActSumData() {
      getActivitySummaryStatistics().then(res => {
        if (res.state === 1) {
          this.sumData = res.data
        }
      })
    },
    // 获取商会活动数据统计
    getActSumChamberData() {
      let params = {
        column: this.column,
        sort: this.sort,
        page: this.currentpage,
        pageSize: this.limit
      }
      getActivitySummaryChamber(params).then(res => {
        if (res.state === 1) {
          this.dataList = res.data.list
          this.total = res.data.totalPages
        }
      })
    },
    handleSizeChange(val) {
      this.limit = val
      this.currentpage = 1
      this.getActSumChamberData()
    },
    handleCurrentChange(val) {
      this.currentpage = val
      this.getActSumChamberData()
    },
    handleSortChange(e) {
      this.currentpage = 1
      if (e.prop) {
        if (e.order === 'descending') {
          this.column = e.prop
          this.sort = 1
        } else {
          this.column = e.prop
          this.sort = 0
        }
        this.getActSumChamberData()
      }
    }
  }
}
