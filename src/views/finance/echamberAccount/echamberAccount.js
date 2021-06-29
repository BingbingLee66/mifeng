import { getPlatformFinanceData, getPlatformFinanceDayData, getPlatformFinanceWithdraw } from '@/api/finance/finance'
import { exportJson2Excel } from '@/utils/exportExcel'
import { formatDate } from '@/utils/date' // 格式化时间戳
// import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      activeName: '12',
      pfStatistics: {},
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
      detailVisible: false,
      detailObj: {}
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
    handleClick () {
      this.total = 0
      this.list = []
      this.currentpage = 1
      this.limit = 10
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
      }
      getPlatformFinanceData(params).then(response => {
        this.pfStatistics = response.data.financeFullDataResp
      })
    },
    fetchData () {
      this.listLoading = true
      let params = {
        'pageSize': this.limit,
        'page': this.currentpage,
        'startTime': this.query.date[0],
        'endTime': this.query.date[1]
      }
      if (this.activeName === '12') {
        getPlatformFinanceDayData(params).then(response => {
          this.list = response.data.data.list
          this.total = response.data.data.totalRows
          this.listLoading = false
        })
      } else if (this.activeName === '13') {
        getPlatformFinanceWithdraw(params).then(response => {
          this.list = response.data.data.list
          this.total = response.data.data.totalRows
          this.listLoading = false
        })
      }
    },
    handleSelectionChange1 (value) {
      let datas = value
      this.selectionDatas = []
      for (let data of datas) {
        let new_data = {
          '日期': formatDate(new Date(data.rptDate), 'yyyy-MM-dd'),
          '商城交易额(元）': data.cumulativeShopPrice,
          '会费交易额（元）': data.cumulativeMemberPrice,
          '合计（元）': data.cumulativeShopPrice + data.cumulativeMemberPrice
        }
        this.selectionDatas.push(new_data)
      }
    },
    handleSelectionChange2 (value) {
      let datas = value
      this.selectionDatas = []
      for (let data of datas) {
        let new_data = {
          '提现日期': formatDate(new Date(data.createTime), 'yyyy-MM-dd'),
          '申请方': data.chamberName,
          '提现类型': data.type === 0 ? '商城' : '会费',
          '申请提现金额(元)': data.applyPrice,
          '微信手续费(元)': data.wechatPrice,
          // '平台服务费((元)': data.platfromPrice,
          '打款金额(元)': data.realPrice,
          '状态': data.status === 0 ? '审核中' : (data.status === 1 ? '提现成功' : '提现失败')
        }
        this.selectionDatas.push(new_data)
      }
    },
    exportExcel1 (e) {
      if (this.selectionDatas.length === 0) {
        this.$message.error({
          message: '没有选择记录，操作失败'
        })
        return
      }
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      exportJson2Excel('交易数据', this.selectionDatas)
    },
    exportExcel2 (e) {
      if (this.selectionDatas.length === 0) {
        this.$message.error({
          message: '没有选择记录，操作失败'
        })
        return
      }
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      exportJson2Excel('提现记录', this.selectionDatas)
    },
    detail (e, row) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      this.detailVisible = true
      this.detailObj = row
    }
  }
}
