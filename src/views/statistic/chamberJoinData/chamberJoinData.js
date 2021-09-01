import {
  getPlatformMemberPaidData,
  getPlatformMemberJoinData
} from '@/api/statistics/chamberJoinData'
import { exportJson2Excel } from '@/utils/exportExcel'

export default {
  data() {
    return {
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
        type: 1
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
    // 获取商会入驻数据
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
        'page': this.currentpage,
        'type': this.query.type
      }
      getPlatformMemberJoinData(params).then(response => {
        this.list = response.data.data.list
        this.total = response.data.data.totalRows
        this.listLoading = false
      })
    },
    handleSelectionChange(value) {
      let datas = value
      this.selectionDatas = []
      for (let data of datas) {
        let new_data = {
          '日期': data.date,
          '授权登录人数': data.activeWxUserTotal > 0 ? data.activeWxUserTotal : '--',
          '入会总人数': data.joinedTotal > 0 ? data.joinedTotal : '--',
          '商会邀请入会人数': data.chamberInvitationTotal > 0 ? data.chamberInvitationTotal : '--',
          '自己申请入会人数': data.myselfApplyTotal > 0 ? data.myselfApplyTotal : '--',
          '会员邀请入会人数': data.memberInvitationTotal > 0 ? data.memberInvitationTotal : '--',
          '商会后台添加入会人数': data.chamberBackstageAddTotal > 0 ? data.chamberBackstageAddTotal : '--',
          '个人会员': data.personMemberTotal > 0 ? data.personMemberTotal : '--',
          '企业/团体': data.companyMemberTotal > 0 ? data.companyMemberTotal : '--'
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
    }
  }
}
