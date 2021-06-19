import { getContentStatistics, getContentData } from '@/api/statistics/contentData'
import { exportJson2Excel } from '@/utils/exportExcel'
// import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      pfStatistics: {
        platformContent: 0,
        chamberContent: 0,
        companyContent: 0,
        readTotal: 0
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
      this.fetchData()
    },
    initDatePicker () {
      const endDateNs = new Date()
      const startDateNs = new Date()
      startDateNs.setTime(startDateNs.getTime() - 3600 * 1000 * 24 * this.query.days)
      // 月、日 不够10补0
      const defalutStartTime = startDateNs.getFullYear() + '-' + ((startDateNs.getMonth() + 1) >= 10 ? (startDateNs.getMonth() + 1) : '0' + (startDateNs.getMonth() + 1)) + '-' + (startDateNs.getDate() >= 10 ? startDateNs.getDate() : '0' + startDateNs.getDate())
      const defalutEndTime = endDateNs.getFullYear() + '-' + ((endDateNs.getMonth() + 1) >= 10 ? (endDateNs.getMonth() + 1) : '0' + (endDateNs.getMonth() + 1)) + '-' + (endDateNs.getDate() >= 10 ? endDateNs.getDate() : '0' + endDateNs.getDate())
      this.query.date = [defalutStartTime, defalutEndTime]
      this.getStatistics()
    },
    getStatistics () {
      let params = {
        'startTime': this.query.date[0],
        'endTime': this.query.date[1]
      }
      getContentStatistics(params).then(response => {
        this.pfStatistics.platformContent = response.data.platformContent
        this.pfStatistics.chamberContent = response.data.chamberContent
        this.pfStatistics.companyContent = response.data.companyContent
        this.pfStatistics.readTotal = response.data.readTotal
      })
    },
    fetchData() {
      this.listLoading = true
      let params = {
        'pageSize': this.limit,
        'page': this.currentpage
      }
      getContentData(params).then(response => {
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
          '日期': data.date,
          '商会发布内容数': data.chamberContentTotal,
          '平台发布内容数': data.platformContentTotal,
          '内容发布总数': data.contentTotal,
          '阅读次数': data.viewingCount
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
      exportJson2Excel(this.selectionDatas)
    }
  }
}
