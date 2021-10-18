import { getChamberFinanceData, getChamberFinanceWithdraw, applyWithdrawalAdd, getBank, updateBank, getChamberOptions } from '@/api/finance/finance'
import { exportJson2Excel } from '@/utils/exportExcel'
import { formatDate } from '@/utils/date' // 格式化时间戳
// import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      activeName: '10',
      detailVisible: false,
      visible: false,
      pfStatistics: {},
      cardSet: {
        chamberName: '',
        user: '',
        bank: '',
        account: ''
      },
      formObj: {},
      detailObj: {},
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
      chamberOptions: [],
      rules: {
        chamberName: [
          { required: true, message: '商会名称不能为空', trigger: 'blur' }
        ],
        accountName: [
          { required: true, message: '账户名不能为空', trigger: 'blur' }
        ],
        accountBank: [
          { required: true, message: '开户行不能为空', trigger: 'blur' }
        ],
        account: [
          { required: true, message: '账号不能为空', trigger: 'blur' }
        ]
      }
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
    getChamberOptions () {
      getChamberOptions().then(response => {
        this.chamberOptions = response.data.data
      })
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
      getChamberFinanceData(params).then(response => {
        this.pfStatistics = response.data.financeFullDataResp
      })
    },
    fetchData () {
      if (this.activeName === '10') {
        this.listLoading = true
        let params = {
          'pageSize': this.limit,
          'page': this.currentpage,
          'startTime': this.query.date[0],
          'endTime': this.query.date[1]
        }
        getChamberFinanceWithdraw(params).then(response => {
          this.list = response.data.data.list
          this.total = response.data.data.totalRows
          this.listLoading = false
        })
      } else if (this.activeName === '11') {
        getBank().then(response => {
          this.cardSet = response.data.theBank
          if (this.cardSet === null) {
            this.cardSet = {
              chamberName: this.chamberName(this.$store.getters.ckey),
              user: '',
              bank: '',
              account: ''
            }
          }
        })
      }
    },
    handleSelectionChange (value) {
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
    save () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.formObj['ckey'] = this.$store.getters.ckey
          updateBank(this.formObj).then(response => {
            this.$message({
              message: '更新成功',
              type: 'success'
            })
            this.fetchData()
          })
          this.visible = false
        } else {
          return false
        }
      })
    },
    openVisible (e) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      this.visible = true
      this.formObj = {
        chamberName: this.cardSet.chamberName,
        accountName: this.cardSet.accountName,
        accountBank: this.cardSet.accountBank,
        account: this.cardSet.account
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
      exportJson2Excel('提现记录', this.selectionDatas)
    },
    detail (e, row) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      this.detailVisible = true
      this.detailObj = row
    },
    applyForMember (e) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      this.$prompt('提现金额', '申请提现(会费可提现金额为¥' + this.pfStatistics.memberLave + ')', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPlaceholder: '请输入提现金额(100元以上)',
        inputPattern: /^[0]$|^(([1-9]\d*)|[0]\.\d{1,2}|([1-9]\d*)\.\d{1,2})$/,
        inputValidator: (val) => {
          if (parseFloat(val) > parseFloat(this.pfStatistics.memberLave)) {
            return '余额不足以提现'
          }
        },
        inputErrorMessage: '最多两位小数金额'
      }).then(({ value }) => {
        let params = {
          'applyPrice': value,
          'type': 1
        }
        applyWithdrawalAdd(params).then(response => {
          this.$message({
            message: '提现申请提交成功',
            type: 'success'
          })
          this.fetchData()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        })
      })
    },
  }
}
