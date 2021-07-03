import { 
  getChamberFinanceData, 
  getChamberFinanceMemberThisMonth, 
  getChamberFinanceMemberDay, 
  getChamberFinanceMemberFeeList 
} from '@/api/finance/finance'
import { exportJson2Excel } from '@/utils/exportExcel'
import { formatDate, formatDateTime } from '@/utils/date' // 格式化时间戳
// import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      pfStatistics: {},
      pfMonthStatistics: {},
      query1: {
        days: 7,
        date: ''
      },
      query2: {
        days: 7,
        date: ''
      },
      pageSizes1: [10, 20, 50, 100, 500],
      total1: 0,
      list1: [],
      currentpage1: 1,
      limit1: 10,
      listLoading1: false,
      selectionDatas1: [],
      pageSizes2: [10, 20, 50, 100, 500],
      total2: 0,
      list2: [],
      currentpage2: 1,
      limit2: 10,
      listLoading2: false,
      selectionDatas2: []
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
      this.initDatePicker1()
      this.initDatePicker2()
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
    getStatistics () {
      let params = {
        // 'ckey': this.$store.getters.ckey
      }
      getChamberFinanceMemberThisMonth(params).then(response => {
        this.pfMonthStatistics = response.data
      })
      getChamberFinanceData(params).then(response => {
        this.pfStatistics = response.data.financeFullDataResp
      })
    },
    fetchData1 () {
      this.listLoading1 = true
      let params = {
        'pageSize': this.limit1,
        'page': this.currentpage1,
        'startTime': this.query1.date[0],
        'endTime': this.query1.date[1]
      }
      getChamberFinanceMemberDay(params).then(response => {
        this.list1 = response.data.data.list
        this.total1 = response.data.data.totalRows
        this.listLoading1 = false
      })
    },
    fetchData2 () {
      this.listLoading2 = true
      let params = {
        'pageSize': this.limit2,
        'page': this.currentpage2,
        'startTime': this.query2.date[0],
        'endTime': this.query2.date[1]
      }
      getChamberFinanceMemberFeeList(params).then(response => {
        this.list2 = response.data.data.list
        this.total2 = response.data.data.totalRows
        this.listLoading2 = false
      })
    },
    handleSelectionChange1 (value) {
      let datas = value
      this.selectionDatas1 = []
      for (let data of datas) {
        let new_data = {
          '日期': formatDate(new Date(data.rptDate), 'yyyy-MM-dd'),
          '缴费人数': data.memberCount,
          '缴费金额(元)': data.memberPrice
        }
        this.selectionDatas1.push(new_data)
      }
    },
    handleSelectionChange2 (value) {
      let datas = value
      this.selectionDatas2 = []
      for (let data of datas) {
        let new_data = {
          '会员名字': data.memberName,
          '职位': data.memberPostName,
          '手机号': data.phone,
          '缴费时间': formatDateTime(new Date(data.createdTs), 'yyyy-MM-dd hh:mm:ss'),
          '缴费金额(元)': data.feeAmount
        }
        this.selectionDatas2.push(new_data)
      }
    },
    exportExcel1 (e) {
      if (this.selectionDatas1.length === 0) {
        this.$message.error({
          message: '没有选择记录，操作失败'
        })
        return
      }
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      exportJson2Excel('会员缴费数据', this.selectionDatas1)
    },
    exportExcel2 (e) {
      if (this.selectionDatas2.length === 0) {
        this.$message.error({
          message: '没有选择记录，操作失败'
        })
        return
      }
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      exportJson2Excel('会员缴费详情', this.selectionDatas2)
    },
    goSettle () {
      this.$router.push({ name: '结算提现' })
    }
  }
}
