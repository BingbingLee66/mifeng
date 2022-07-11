import {
    getAllChamberStatsDataByCkeyList
  } from '@/api/statistics/chamberJoinData'
  import { exportJson2Excel } from '@/utils/exportExcel'
  import {chamberSearchList} from '@/api/chamber/manager'
  export default {
    data() {
      return {
        query: {
          date: '',
          ckey:"",
        },
        days: 7, // 7天 14天 30天
        pageSizes: [10, 20, 50, 100, 500],
        total: 0,
        currentpage: 1,
        limit: 10,
        list: [],
        chamberList:[], // 商协会数据
        listLoading: false,
        selectionDatas: [],  // 表格选中数据
      }
    },
    computed: {

    },
    created() {
      this.query.ckey = this.$store.getters.ckey
      this.init()
    },
    methods: {
        init(){
            // 初始化时间
            this.initDatePicker()
            this.chamberSearchListFunc()
        },
        chamberSearchListFunc(){
            let param = {
              name:''
            }
            chamberSearchList(param).then(res=>{
              if(res.state === 1 ){
                this.chamberList = res.data
              }
            })
        },
        initDatePicker() {
            const endDateNs = new Date()
            const startDateNs = new Date()
            startDateNs.setTime(startDateNs.getTime() - 3600 * 1000 * 24 * this.days)
            // 月、日 不够10补0
            const defalutStartTime = startDateNs.getFullYear() + '-' + ((startDateNs.getMonth() + 1) >= 10 ? (startDateNs.getMonth() + 1) : '0' + (startDateNs.getMonth() + 1)) + '-' + (startDateNs.getDate() >= 10 ? startDateNs.getDate() : '0' + startDateNs.getDate())
            const defalutEndTime = endDateNs.getFullYear() + '-' + ((endDateNs.getMonth() + 1) >= 10 ? (endDateNs.getMonth() + 1) : '0' + (endDateNs.getMonth() + 1)) + '-' + (endDateNs.getDate() >= 10 ? endDateNs.getDate() : '0' + endDateNs.getDate())
            this.query.date = [defalutStartTime, defalutEndTime]
            this.fetchData()
        },
        fetchData(){
            this.listLoading = true
            let params = {
              'startTime': this.query.date[0],
              'endTime': this.query.date[1],
              'pageNum': this.limit,
              'pageSize': this.currentpage,
              'ckey':this.query.ckey,
            }
            console.log('params',params)
            getChamberLoginDataList(params).then(response => {
                this.list = response.data.list || []
                this.total = response.data.totalRows
                this.listLoading = false
            })
        },
        // 导表
        exportExcel(){
            if (this.selectionDatas.length === 0) {
                this.$message.error({
                    message: '没有选择记录，操作失败'
                })
                return
            }
            exportJson2Excel('登录记录', this.selectionDatas)
        },
        // 下拉框触发
        change(){
            this.initDatePicker()
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
        handleSelectionChange(value) {
            let datas = value
            this.selectionDatas = []
            for (let data of datas) {
              let new_data = {
                '登录手机号': data.loginPhone,
                '用户名': data.userName ,
                '登录次数': data.loginSum  > 0 ? data.loginSum  : '--',
                '供需管理': data.lastLogonTs,
              }
              this.selectionDatas.push(new_data)
            }
        },
    }
  }
  