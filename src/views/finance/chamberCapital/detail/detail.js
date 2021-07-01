import { getPlatformFinanceDataByCkey, getPlatformFinanceShopByCkey, getPlatformFinanceMemberByCkey, getPlatformFinanceWithdrawByCkey } from '@/api/finance/finance'
// import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      pfStatistics: {
        cumulativeMemberDeduction: 0,
        cumulativeMemberPrice: 0,
        cumulativePlatfromDeduction: 0,
        cumulativeShopDeduction: 0,
        cumulativeShopPrice: 0,
        cumulativeTransactionAmount: 0,
        cumulativeWechatDeduction: 0,
        memberLave: 0,
        memberWithdraw: 0,
        shopLave: 0,
        shopWithdraw: 0
      },
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
      query3: {
        days: 7,
        date: ''
      },
      pageSizes3: [10, 20, 50, 100, 500],
      total3: 0,
      list3: [],
      currentpage3: 1,
      limit3: 10,
      listLoading3: false,
      ckey: '',
      detailVisible: false,
      detailObj: {}
    }
  },
  computed: {
    // ...mapGetters(['has'])
  },
  created() {
    if (this.$route.params.ckey) {
      this.ckey = this.$route.params.ckey
      window.localStorage.setItem('captial-detail', this.ckey)
    } else {
      this.ckey = window.localStorage.getItem('captial-detail')
    }
    this.init()
  },
  methods: {
    has (tabName, actionName) {
      return this.$store.getters.has({ tabName, actionName })
    },
    getId (tabName, actionName) {
      return this.$store.getters.getId({ tabName, actionName })
    },
    handleSizeChange1 (val) {
      console.log(`每页 ${val} 条`)
      this.limit = val
      this.currentpage = 1
      this.fetchData()
    },
    handleCurrentChange1 (val) {
      console.log(`当前页: ${val}`)
      this.currentpage = val
      this.fetchData()
    },
    handleSizeChange2 (val) {
      console.log(`每页 ${val} 条`)
      this.limit = val
      this.currentpage = 1
      this.fetchData()
    },
    handleCurrentChange2 (val) {
      console.log(`当前页: ${val}`)
      this.currentpage = val
      this.fetchData()
    },
    handleSizeChange3 (val) {
      console.log(`每页 ${val} 条`)
      this.limit = val
      this.currentpage = 1
      this.fetchData()
    },
    handleCurrentChange3(val) {
      console.log(`当前页: ${val}`)
      this.currentpage = val
      this.fetchData()
    },
    init() {
      this.initDatePicker1()
      this.initDatePicker2()
      this.initDatePicker3()
      this.getStatistics()
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
    initDatePicker3 () {
      const endDateNs = new Date()
      const startDateNs = new Date()
      startDateNs.setTime(startDateNs.getTime() - 3600 * 1000 * 24 * this.query3.days)
      // 月、日 不够10补0
      const defalutStartTime = startDateNs.getFullYear() + '-' + ((startDateNs.getMonth() + 1) >= 10 ? (startDateNs.getMonth() + 1) : '0' + (startDateNs.getMonth() + 1)) + '-' + (startDateNs.getDate() >= 10 ? startDateNs.getDate() : '0' + startDateNs.getDate())
      const defalutEndTime = endDateNs.getFullYear() + '-' + ((endDateNs.getMonth() + 1) >= 10 ? (endDateNs.getMonth() + 1) : '0' + (endDateNs.getMonth() + 1)) + '-' + (endDateNs.getDate() >= 10 ? endDateNs.getDate() : '0' + endDateNs.getDate())
      this.query3.date = [defalutStartTime, defalutEndTime]
      this.fetchData3()
    },
    getStatistics () {
      let params = {
        'ckey': this.ckey
      }
      getPlatformFinanceDataByCkey(params).then(response => {
        this.pfStatistics = response.data.financeFullDataResp
      })
    },
    fetchData1 () {
      this.listLoading1 = true
      let params = {
        'ckey': this.ckey,
        'pageSize': this.limit1,
        'page': this.currentpage1,
        'startTime': this.query1.date[0],
        'endTime': this.query1.date[1]
      }
      getPlatformFinanceShopByCkey(params).then(response => {
        this.list1 = response.data.data.list
        this.total1 = response.data.data.totalRows
        this.listLoading1 = false
      })
    },
    fetchData2 () {
      this.listLoading2 = true
      let params = {
        'ckey': this.ckey,
        'pageSize': this.limit2,
        'page': this.currentpage2,
        'startTime': this.query2.date[0],
        'endTime': this.query2.date[1]
      }
      getPlatformFinanceMemberByCkey(params).then(response => {
        this.list2 = response.data.data.list
        this.total2 = response.data.data.totalRows
        this.listLoading2 = false
      })
    },
    fetchData3 () {
      this.listLoading3 = true
      let params = {
        'ckey': this.ckey,
        'pageSize': this.limit3,
        'page': this.currentpage3,
        'startTime': this.query3.date[0],
        'endTime': this.query3.date[1]
      }
      getPlatformFinanceWithdrawByCkey(params).then(response => {
        this.list3 = response.data.data.list
        this.total3 = response.data.data.totalRows
        this.listLoading3 = false
      })
    },
    detail (row) {
      this.detailVisible = true
      this.detailObj = row
    }
  }
}
