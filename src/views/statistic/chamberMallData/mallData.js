import { 
  getPlatformMallStatistics, 
  getPlatformMallTradeStatistics, 
  getPlatformMallData, 
  getPlatformMallGoodsRank 
} from '@/api/statistics/mallData'
import { exportJson2Excel } from '@/utils/exportExcel'
import { formatDateTime } from '@/utils/date' // 格式化时间戳
import { getChamberOptions } from '@/api/finance/finance'

// import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      pfStatistics: {
        activeGoodsTotal: 0,
        goodsTotal: 0,
        incomeTotal: 0,
        tradingTotal: 0,
        goodsOrderTotal: 0,
        accessTotal: 0
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
      selectionDatas1: [],
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
      selectionDatas2: [],
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
      selectionDatas3: [],
      chamberOptions: []
    }
  },
  computed: {
    // ...mapGetters(['has'])
    chamberName () {
      return function(ckey) {
        let chamberName = ''
        for (let chamber of this.chamberOptions) {
          if (ckey === chamber.value) {
            chamberName = chamber.label
            break
          }
        }
        return chamberName
      }
    }
  },
  created() {
    this.getChamberOptions()
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
    handleSizeChange3(val) {
      console.log(`每页 ${val} 条`)
      this.limit3 = val
      this.currentpage3 = 1
      this.fetchData3()
    },
    handleCurrentChange3(val) {
      console.log(`当前页: ${val}`)
      this.currentpage3 = val
      this.fetchData3()
    },
    getChamberOptions () {
      getChamberOptions().then(response => {
        this.chamberOptions = response.data.data
      })
    },
    init() {
      this.getStatistics()
      this.initDatePicker1()
      this.initDatePicker2()
      this.initDatePicker3()
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
      }
      getPlatformMallStatistics(params).then(response => {
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
      getPlatformMallData(params).then(response => {
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
      getPlatformMallGoodsRank(params).then(response => {
        this.list2 = response.data.data.list
        this.total2 = response.data.data.totalRows
        this.listLoading2 = false
      })
    },
    fetchData3 () {
      this.listLoading3 = true
      let params = {
        'startTime': this.query3.date[0],
        'endTime': this.query3.date[1],
        'pageSize': this.limit3,
        'page': this.currentpage3
      }
      getPlatformMallTradeStatistics(params).then(response => {
        this.list3 = response.data.data.list
        this.total3 = response.data.data.totalRows
        this.listLoading3 = false
      })
    },
    handleSelectionChange1 (value) {
      let datas = value
      this.selectionDatas1 = []
      for (let data of datas) {
        let new_data = {
          '商会': this.chamberName(data.ckey),
          '上架商品数': data.goodsTotal,
          '订单数': data.goodsOrderTotal,
          '成交额(元)': data.tradingTotal,
          '商会分成(元)': data.platformDeduction,
          '付款人数': data.paidMembers
        }
        this.selectionDatas1.push(new_data)
      }
    },
    handleSelectionChange2 (value) {
      let datas = value
      this.selectionDatas2 = []
      for (let data of datas) {
        let status = ''
        if (data.isOnSale === 1 || data.isOnSale === 3) {
          if (data.sumStock > 0) {
            status = '在售'
          } else {
            status = '售罄'
          }
        } else if (data.isOnSale === 2 || data.isOnSale === 4) {
          status = '下架'
        } else if (data.isOnSale === 5) {
          status = '平台下架'
        }
        let new_data = {
          '商品名称': data.goodsName,
          '上架时间': formatDateTime(new Date(data.createTime), 'yyyy-MM-dd hh:mm:ss'),
          '访客数': data.visitorsCount,
          '浏览量': data.viewingCount,
          '下单数': data.goodsOrderTotal,
          '成交额(元)': data.tradingTotal,
          '付款人数': data.paidMembers,
          '状态': status
        }
        this.selectionDatas2.push(new_data)
      }
    },
    handleSelectionChange3 (value) {
      let datas = value
      this.selectionDatas3 = []
      for (let data of datas) {
        let new_data = {
          '日期': data.date,
          '成交金额(元)': data.realPrice,
          '商会分成(元)': data.platformDeduction,
          '订单数': data.orderTotal
        }
        this.selectionDatas3.push(new_data)
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
      exportJson2Excel('商会商城数据', this.selectionDatas1)
    },
    exportExcel2 (e) {
      if (this.selectionDatas2.length === 0) {
        this.$message.error({
          message: '没有选择记录，操作失败'
        })
        return
      }
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      exportJson2Excel('商品排行榜', this.selectionDatas2)
    },
    exportExcel3 (e) {
      if (this.selectionDatas3.length === 0) {
        this.$message.error({
          message: '没有选择记录，操作失败'
        })
        return
      }
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      exportJson2Excel('交易数据', this.selectionDatas3)
    }
  }
}
