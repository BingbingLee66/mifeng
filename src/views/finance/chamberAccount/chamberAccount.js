import { getChamberFinanceData, getChamberFinanceDayData } from '@/api/finance/finance'
import { exportJson2Excel } from '@/utils/exportExcel'
import { formatDate } from '@/utils/date' // 格式化时间戳
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
      this.initDatePicker()
      this.getStatistics()
    },
    initDatePicker () {
      const endDateNs = new Date()
      const startDateNs = new Date()
      startDateNs.setTime(startDateNs.getTime() - 3600 * 1000 * 24 * this.query.days)
      // 月、日 不够10补0
      const defalutStartTime = startDateNs.getFullYear() + '-' + ((startDateNs.getMonth() + 1) >= 10 ? (startDateNs.getMonth() + 1) : '0' + (startDateNs.getMonth() + 1)) + '-' + (startDateNs.getDate() >= 10 ? startDateNs.getDate() : '0' + startDateNs.getDate())
      const defalutEndTime = endDateNs.getFullYear() + '-' + ((endDateNs.getMonth() + 1) >= 10 ? (endDateNs.getMonth() + 1) : '0' + (endDateNs.getMonth() + 1)) + '-' + (endDateNs.getDate() >= 10 ? endDateNs.getDate() : '0' + endDateNs.getDate())
      this.query.date = [defalutStartTime, defalutEndTime]
      this.fetchData()
    },
    getStatistics () {
      let params = {
        // 'ckey': this.$store.getters.ckey
      }
      getChamberFinanceData(params).then(response => {
        this.pfStatistics = response.data.financeFullDataResp
      })
    },
    fetchData() {
      this.listLoading = true
      let params = {
        'pageSize': this.limit,
        'page': this.currentpage,
        'startTime': this.query.date[0],
        'endTime': this.query.date[1]
      }
      // const objList = [{
      //   id: 2242,
      //   rptDate: '2021-03-27',
      //   shopPrice: 3000.00,
      //   memberPrice: 3000.00
      // },
      // {
      //   id: 2243,
      //   rptDate: '2021-03-28',
      //   shopPrice: 3500.00,
      //   memberPrice: 3500.00
      // },
      // {
      //   id: 2244,
      //   rptDate: '2021-03-29',
      //   shopPrice: 4500.00,
      //   memberPrice: 4500.00
      // }]
      // this.list = objList
      // this.total = 1
      // this.listLoading = false
      getChamberFinanceDayData(params).then(response => {
        this.list = response.data.data.list
        this.total = response.data.data.totalRows
        this.listLoading = false
      })
    },
    handleSelectionChange (value) {
      let datas = value
      this.selectionDatas = []
      for (let data of datas) {
        let new_data = {
          '日期': formatDate(new Date(data.rptDate), 'yyyy-MM-dd'),
          '会费交易额（元）': data.memberPrice,
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
