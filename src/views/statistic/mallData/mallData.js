import { getMallStatistics, getMallTradeStatistics, getMallGoodsRank } from '@/api/statistics/mallData'
import { exportJson2Excel } from '@/utils/exportExcel'
// import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      pfStatistics: {},
      query1: {
        days: 7,
        date: ''
      },
      pageSizes1: [10, 20, 50, 100, 500],
      total1: 0,
      list1: [],
      currentpage1: 1,
      limit1: 10,
      listLoading1: false,
      query2: {
        days: 7,
        date: ''
      },
      pageSizes2: [10, 20, 50, 100, 500],
      total2: 0,
      list2: [],
      currentpage2: 1,
      limit2: 10,
      listLoading2: false,
      selectionDatas: []
    }
  },
  computed: {
    // ...mapGetters(['has'])
  },
  created() {
    this.init()
  },
  methods: {
    has (tabName, actionName) {
      return this.$store.getters.has({ tabName, actionName })
    },
    getId (tabName, actionName) {
      return this.$store.getters.getId({ tabName, actionName })
    },
    handleSizeChange1(val) {
      console.log(`每页 ${val} 条`)
      this.limit1 = val
      this.currentpage1 = 1
      this.fetchData1()
    },
    handleCurrentChange1(val) {
      console.log(`当前页: ${val}`)
      this.currentpage1 = val
      this.fetchData1()
    },
    handleSizeChange2(val) {
      console.log(`每页 ${val} 条`)
      this.limit2 = val
      this.currentpage2 = 1
      this.fetchData2()
    },
    handleCurrentChange2(val) {
      console.log(`当前页: ${val}`)
      this.currentpage2 = val
      this.fetchData2()
    },
    init() {
      this.getStatistics()
      this.initDatePicker1()
      this.initDatePicker2()
    },
    initDatePicker1 () {
      const endDateNs = new Date()
      const startDateNs = new Date()
      startDateNs.setTime(startDateNs.getTime() - 3600 * 1000 * 24 * this.query1.days)
      // 月、日 不够10补0
      const defalutStartTime = startDateNs.getFullYear() + '-' + ((startDateNs.getMonth() + 1) >= 10 ? (startDateNs.getMonth() + 1) : '0' + (startDateNs.getMonth() + 1)) + '-' + (startDateNs.getDate() >= 10 ? startDateNs.getDate() : '0' + startDateNs.getDate())
      const defalutEndTime = endDateNs.getFullYear() + '-' + ((endDateNs.getMonth() + 1) >= 10 ? (endDateNs.getMonth() + 1) : '0' + (endDateNs.getMonth() + 1)) + '-' + (endDateNs.getDate() >= 10 ? endDateNs.getDate() : '0' + endDateNs.getDate())
      this.query1.date = [defalutStartTime, defalutEndTime]
      this.fetchData1()
    },
    initDatePicker2 () {
      const endDateNs = new Date()
      const startDateNs = new Date()
      startDateNs.setTime(startDateNs.getTime() - 3600 * 1000 * 24 * this.query2.days)
      // 月、日 不够10补0
      const defalutStartTime = startDateNs.getFullYear() + '-' + ((startDateNs.getMonth() + 1) >= 10 ? (startDateNs.getMonth() + 1) : '0' + (startDateNs.getMonth() + 1)) + '-' + (startDateNs.getDate() >= 10 ? startDateNs.getDate() : '0' + startDateNs.getDate())
      const defalutEndTime = endDateNs.getFullYear() + '-' + ((endDateNs.getMonth() + 1) >= 10 ? (endDateNs.getMonth() + 1) : '0' + (endDateNs.getMonth() + 1)) + '-' + (endDateNs.getDate() >= 10 ? endDateNs.getDate() : '0' + endDateNs.getDate())
      this.query2.date = [defalutStartTime, defalutEndTime]
      this.fetchData2()
    },
    getStatistics () {
      let params = {
      }
      getMallStatistics(params).then(response => {
        this.pfStatistics.activeGoodsTotal = response.data.activeGoodsTotal
        this.pfStatistics.goodsTotal = response.data.goodsTotal
        this.pfStatistics.incomeTotal = response.data.incomeTotal
        this.pfStatistics.tradingTotal = response.data.tradingTotal
        this.pfStatistics.goodsOrderTotal = response.data.goodsOrderTotal
        this.pfStatistics.accessTotal = response.data.accessTotal
      })
    },
    fetchData1 () {
      this.listLoading1 = true
      let params = {
        'startTime': this.query1.date[0],
        'endTime': this.query1.date[1],
        'pageSize': this.limit1,
        'page': this.currentpage1
      }
      getMallTradeStatistics(params).then(response => {
        this.list1 = response.data.data.list
        this.total1 = response.data.data.totalRows
        this.listLoading1 = false
      })
    },
    fetchData2 () {
      this.listLoading2 = true
      let params = {
        'startTime': this.query2.date[0],
        'endTime': this.query2.date[1],
        'pageSize': this.limit2,
        'page': this.currentpage2
      }
      getMallGoodsRank(params).then(response => {
        this.list2 = response.data.data.list
        this.total2 = response.data.data.totalRows
        this.listLoading2 = false
      })
    },
    handleSelectionChange (value) {
      let datas = value
      this.selectionDatas = []
      for (let data of datas) {
        let new_data = {
          '日期': data.date,
          '订单总数': data.orderTotal,
          '成交总额(元)': data.realPrice,
          '商会分成(元)': data.platformDeduction
        }
        this.selectionDatas.push(new_data)
      }
    },
    exportExcel (e) {
      if (this.selectionDatas.length === 0) {
        this.$message.error({
          message: '没有选择记录，操作失败'
        })
        return
      }
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      exportJson2Excel('交易数据', this.selectionDatas)
    }
  }
}
