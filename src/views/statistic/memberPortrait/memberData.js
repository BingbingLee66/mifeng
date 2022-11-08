import {
  getStatistics,
  getDailyStatistics,
  getTradeBar,
  getAgeBar,
  getGenderBar,
  getYearsBar
} from '@/api/statistics/memberStatistics'
// import ECharts from 'vue-echarts/components/ECharts'
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
        paidMembers: 0,
        activeWxUserTotal: 0
      },
      query: {
        days: 7,
        date: ''
      },
      pageSizes: [10, 20, 50, 100, 500],
      total: 0,
      list: [],
      currentpage: 1,
      limit: 10,
      listLoading: false,
      selectionDatas: [],
      tradeBarData: {
        title: {
          text: '',
          show: true,
          textStyle: {
            color: '#999',
            fontSize: 16
          },
          textAlign: 'left',
          top: '0',
          left: '50%'
        },
        xAxis: {
          type: 'category',
          data: []
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: [],
            type: 'bar',
            label: {
              show: true,
              position: 'top',
              color: '#3D383A'
            // formatter: "￥{c}"
            }
          }
        ],
        color: ['#64CDF0', '#F5686F']
      },
      ageBarData: {
        title: {
          text: '',
          show: true,
          textStyle: {
            color: '#999',
            fontSize: 16
          },
          textAlign: 'left',
          top: '0',
          left: '50%'
        },
        xAxis: {
          type: 'category',
          data: []
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: [],
            type: 'bar',
            label: {
              show: true,
              position: 'top',
              color: '#3D383A'
            // formatter: "￥{c}"
            }
          }
        ],
        color: ['#64CDF0', '#F5686F']
      },
      genderBarData: {
        title: {
          text: '',
          show: true,
          textStyle: {
            color: '#999',
            fontSize: 16
          },
          textAlign: 'left',
          top: '0',
          left: '50%'
        },
        xAxis: {
          type: 'category',
          data: []
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: [],
            type: 'bar',
            label: {
              show: true,
              position: 'top',
              color: '#3D383A'
            // formatter: "￥{c}"
            }
          }
        ],
        color: ['#64CDF0', '#F5686F']
      },
      yearsBarData: {
        title: {
          text: '',
          show: true,
          textStyle: {
            color: '#999',
            fontSize: 16
          },
          textAlign: 'left',
          top: '0',
          left: '50%'
        },
        xAxis: {
          type: 'category',
          data: []
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: [],
            type: 'bar',
            label: {
              show: true,
              position: 'top',
              color: '#3D383A'
            // formatter: "￥{c}"
            }
          }
        ],
        color: ['#64CDF0', '#F5686F']
      }
    }
  },
  computed: {
    // ...mapGetters(['has'])
  },
  created() {
    this.ckey = this.$store.getters.ckey
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
      // this.initDatePicker()
      this.getTradeBar()
      this.getAgeBar()
      this.getGenderBar()
      this.getYearsBar()
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
    getStatistics() {
      const params = {}
      getStatistics(params).then(response => {
        this.pfStatistics.monthlyJoin = response.data.monthlyJoin
        this.pfStatistics.totalMembers = response.data.totalMembers
        this.pfStatistics.unpaidMembers = response.data.unpaidMembers
        this.pfStatistics.paidMembers = response.data.paidMembers
        this.pfStatistics.activeWxUserTotal = response.data.activeWxUserTotal
      })
    },
    fetchData() {
      this.listLoading = true
      const params = {
        startTime: this.query.date[0],
        endTime: this.query.date[1],
        pageSize: this.limit,
        page: this.currentpage,
        ckey: this.ckey
      }
      getDailyStatistics(params).then(response => {
        this.list = response.data.data.list
        this.total = response.data.data.totalRows
        this.listLoading = false
      })
    },
    getTradeBar() {
      const params = {}
      getTradeBar(params).then(response => {
        this.tradeBarData.title.text = response.data.text
        this.tradeBarData.xAxis.data = response.data.xAxisData
        this.tradeBarData.series[0].data = response.data.seriesData
      })
    },
    getAgeBar() {
      const params = {}
      getAgeBar(params).then(response => {
        this.ageBarData.title.text = response.data.text
        this.ageBarData.xAxis.data = response.data.xAxisData
        this.ageBarData.series[0].data = response.data.seriesData
      })
    },
    getGenderBar() {
      const params = {}
      getGenderBar(params).then(response => {
        this.genderBarData.title.text = response.data.text
        this.genderBarData.xAxis.data = response.data.xAxisData
        this.genderBarData.series[0].data = response.data.seriesData
      })
    },
    getYearsBar() {
      const params = {}
      getYearsBar(params).then(response => {
        this.yearsBarData.title.text = response.data.text
        this.yearsBarData.xAxis.data = response.data.xAxisData
        this.yearsBarData.series[0].data = response.data.seriesData
      })
    }
  }
}
