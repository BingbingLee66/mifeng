import {
  getPlatformMemberPaidData,
  getPlatformMemberJoinData,
  getPlatformChamberData
} from '@/api/statistics/chamberJoinData'
import { exportJson2Excel } from '@/utils/exportExcel'
import { getList } from '@/api/mall/channel'

export default {
  data() {
    return {
      channelList: [], // 关联渠道列表
      showMeaning: false,
      pfStatistics: {
        monthlyChamberJoin: 0,
        totalChambers: 0,
        monthlyMemberJoin: 0,
        totalMembers: 0,
        loginMembers: 0
      },
      query: {
        days: 7,
        date: '',
        id: -1
      },
      pageSizes: [10, 20, 50, 100, 500],
      total: 0,
      list: [],
      currentpage: 1,
      limit: 10,
      listLoading: false,
      selectionDatas: [],
      listLoading2: false,
      list2: []
    }
  },
  computed: {
    // ...mapGetters(['has'])
  },
  created() {
    this.getChannelList()
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
      this.fetchData2()
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
    rangeDatePicker(val) {
      console.log(val)
    },
    getStatistics() {
      let params = {}
      getPlatformMemberPaidData(params).then(response => {
        this.pfStatistics.monthlyChamberJoin = response.data.monthlyChamberJoin
        this.pfStatistics.totalChambers = response.data.totalChambers
        this.pfStatistics.monthlyMemberJoin = response.data.monthlyMemberJoin
        this.pfStatistics.totalMembers = response.data.totalMembers
        this.pfStatistics.loginMembers = response.data.loginMembers
      })
    },
    fetchData() {
      this.listLoading = true
      let params = {
        'startTime': this.query.date[0],
        'endTime': this.query.date[1],
        'pageSize': this.limit,
        'page': this.currentpage
      }
      getPlatformMemberJoinData(params).then(response => {
        this.list = response.data.data.list
        this.total = response.data.data.totalRows
        this.listLoading = false
      })
    },
    fetchData2() {
      this.listLoading2 = true
      let params = {}
      getPlatformChamberData(params).then(response => {
        this.list2 = response.data.list
        this.listLoading2 = false
      })
    },
    handleSelectionChange(value) {
      let datas = value
      this.selectionDatas = []
      for (let data of datas) {
        let new_data = {
          '日期': data.date,
          '授权登录人数': data.activeWxUserTotal,
          '商会会员入驻': data.joinedTotal
        }
        this.selectionDatas.push(new_data)
      }
    },
    exportExcel(e) {
      if (this.selectionDatas.length === 0) {
        this.$message.error({
          message: '没有选择记录，操作失败'
        })
        return
      }
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      exportJson2Excel('会员入驻数据', this.selectionDatas)
    },
    // 获取关联渠道列表
    getChannelList() {
      getList().then(res => {
        res.data.list.unshift({
          id: -1,
          channelName: '全部渠道'
        })
        this.channelList = res.data.list
        console.log('this.channelListthis.channelList',this.channelList)
      })
    }
  }
}
