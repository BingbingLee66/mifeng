import {
  getStatistics,
  getDailyStatistics,
  getTradeBar,
  getAgeBar,
  getGenderBar,
  getYearsBar
} from '@/api/statistics/memberStatistics'
import ECharts from 'vue-echarts/components/ECharts'
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/title'
// import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      showMeaning: false,
      pfStatistics: {
        monthlyJoin: 0,
        totalMembers: 0,
        unpaidMembers: 0,
        paidMembers: 0
      },
      query: {
        days: 7,
        date: '',
        type: 1,
      },
      pageSizes: [10, 20, 50, 100, 500],
      total: 0,
      list: [],
      currentpage: 1,
      limit: 10,
      listLoading: false,
      selectionDatas: []
    }
  },
  created() {
    this.init()
  },
  methods: {
    has(tabName, actionName) {
      return this.$store.getters.has({ tabName, actionName })
    },
    getId(tabName, actionName) {
      return this.$store.getters.getId({ tabName, actionName })
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.limit = val
      this.currentpage = 1
      this.fetchData()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.currentpage = val
      this.fetchData()
    },
    init() {
      this.getStatistics()
      this.initDatePicker()
    },
    initDatePicker() {
      const endDateNs = new Date()
      const startDateNs = new Date()
      startDateNs.setTime(startDateNs.getTime() - 3600 * 1000 * 24 * this.query.days)
      // 月、日 不够10补0
      const defalutStartTime = startDateNs.getFullYear() + '-' + ((startDateNs.getMonth() + 1) >= 10 ? (startDateNs.getMonth() + 1) : '0' + (startDateNs.getMonth() + 1)) + '-' + (startDateNs.getDate() >= 10 ? startDateNs.getDate() : '0' + startDateNs.getDate())
      const defalutEndTime = endDateNs.getFullYear() + '-' + ((endDateNs.getMonth() + 1) >= 10 ? (endDateNs.getMonth() + 1) : '0' + (endDateNs.getMonth() + 1)) + '-' + (endDateNs.getDate() >= 10 ? endDateNs.getDate() : '0' + endDateNs.getDate())
      this.query.date = [defalutStartTime, defalutEndTime]
      this.fetchData()
    },
    typeDatePicker(val) {
      console.log(val)
      this.query.type = val
      this.fetchData()
    },
    getStatistics() {
      let params = {}
      getStatistics(params).then(response => {
        this.pfStatistics.monthlyJoin = response.data.monthlyJoin
        this.pfStatistics.totalMembers = response.data.totalMembers
        this.pfStatistics.unpaidMembers = response.data.unpaidMembers
        this.pfStatistics.paidMembers = response.data.paidMembers
      })
    },
    fetchData() {
      this.listLoading = true
      let params = {
        'startTime': this.query.date[0],
        'endTime': this.query.date[1],
        'type': this.query.type,
        'pageSize': this.limit,
        'page': this.currentpage
      }
      getDailyStatistics(params).then(response => {
        console.log('responseresponseresponse----', response)
        this.list = response.data.list
        this.total = response.data.totalRows
        this.listLoading = false
      })
    },
    getTradeBar() {
      let params = {}
      getTradeBar(params).then(response => {
        this.tradeBarData.title.text = response.data.text
        this.tradeBarData.xAxis.data = response.data.xAxisData
        this.tradeBarData.series[0].data = response.data.seriesData
      })
    }
  }
}
