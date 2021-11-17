import {
  getStatistics,
  getDailyStatistics,
  getTradeBar,
  getAgeBar,
  getGenderBar,
  getYearsBar
} from '@/api/statistics/memberStatistics'
import ECharts from 'vue-echarts/components/ECharts'
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/title'
import { exportJson2Excel } from '@/utils/exportExcel'
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
        date: '',
        type: 1,
      },
      pageSizes: [10, 20, 50, 100, 500],
      total: 0,
      list: [],
      chamberName: '',
      currentpage: 1,
      limit: 10,
      listLoading: false,
      // 已选导表数据
      // selectionDatas: [],
      // 临时已选数据
      tempSelectDatas:[]
    }
  },
  created() {
    this.ckey = this.$store.getters.ckey
    this.chamberName = this.$store.getters.chamberName
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
    getStatistics() {
      let params = {}
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
      let params = {
        'startTime': this.query.date[0],
        'endTime': this.query.date[1],
        'type': this.query.type,
        'pageSize': this.limit,
        'page': this.currentpage,
        'ckey':this.ckey 
      }
      getDailyStatistics(params).then(response => {
        console.log('responseresponseresponse----', response)
        this.list = response.data.list
        this.total = response.data.totalRows
        this.listLoading = false
      })
    },
    getTradeBar() {
      let params = {}
      getTradeBar(params).then(response => {
        this.tradeBarData.title.text = response.data.text
        this.tradeBarData.xAxis.data = response.data.xAxisData
        this.tradeBarData.series[0].data = response.data.seriesData
      })
    },
    // 导表
    exportExcel(){
      if(this.tempSelectDatas.length<1){
        this.$message({
          showClose: true,
          message: '没有可选操作的记录',
          type: 'warning'
        });
        return;
      }
      let selectionDatas=this.handleData(this.tempSelectDatas);
      console.log('selectionDatas',selectionDatas);
      let nowDate = new Date()
      let date = {
        year: nowDate.getFullYear(),
        month: nowDate.getMonth() + 1,
        date: nowDate.getDate()
      }

      exportJson2Excel(date.year + '-' + date.month + '-' + date.date + '-' + this.chamberName + '-会员数据', selectionDatas)
    },
    // 表格选择时触发
    handleSelectionChange(rows){
      this.tempSelectDatas=rows;
    },
    handleData(list){
      let newData=[]
      if(list.length<1){return;};
      list.forEach(item=>{
        let obj={
          '日期':item.date,
          '授权登录人数':item.activeWxUserTotal>0 ? item.activeWxUserTotal: "--",
          '入会总人数':item.joinedTotal>0 ? item.joinedTotal: "--",
          '商会邀请入会人数':item.chamberInvitationTotal >0 ? item.chamberInvitationTotal: "--",
          '自己申请入会人数':item.myselfApplyTotal >0 ? item.myselfApplyTotal: "--",
          '会员邀请入会人数':item.memberInvitationTotal >0 ? item.memberInvitationTotal: "--",
          '商会后台添加入会人数':item.chamberBackstageAddTotal >0 ? item.chamberBackstageAddTotal: "--",
          '个人会员':item.memberInvitationTotal >0 ? item.memberInvitationTotal: "--",
          '会员邀请入会人数':item.personMemberTotal >0 ? item.personMemberTotal: "--",
          '企业/团体':item.companyMemberTotal >0 ? item.companyMemberTotal: "--",

        };
        newData.push(obj)
      })
      return newData
    }
  }
}
