import { getPlatformFinanceWithdrawList, applyWithdrawalConfirm, applyWithdrawalReject } from '@/api/finance/finance'
// import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      rejectVisible: false,
      detailVisible: false,
      query: {
        status: -1
      },
      formObj: {},
      detailObj: {},
      audit: {
        id: '',
        remark: '账号信息有误，请修改后再重新申请提现',
        input: ''
      },
      pageSizes: [10, 20, 50, 100, 500],
      total: 0,
      list: [],
      currentpage: 1,
      limit: 10,
      listLoading: false,
      auditRules: {
        input: [
          { required: true, message: '必须填写驳回原因', trigger: 'blur' }
        ]
      }
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
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.limit = val
      this.currentpage = 1
      this.fetchData()
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.currentpage = val
      this.fetchData()
    },
    init () {
      this.fetchData()
    },
    fetchData () {
      this.listLoading = true
      let params = {
        'status': this.query.status,
        'pageSize': this.limit,
        'page': this.currentpage
      }
      getPlatformFinanceWithdrawList(params).then(response => {
        this.list = response.data.data.list
        this.total = response.data.data.totalRows
        this.listLoading = false
      })
    },
    detail (e, row) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      this.detailVisible = true
      this.detailObj = row
    },
    confirm (e, row) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      this.$confirm('确定已给对方打款', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        let params = {
          'id': row.id
        }
        applyWithdrawalConfirm(params).then(response => {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.fetchData()
        })
      }).catch((err) => {
        console.log(err)
        this.$message({
          type: 'info',
          message: '取消删除'
        })
      })
    },
    openReject (e, row) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      if (row.id !== undefined) {
        this.audit.id = row.id
      }
      this.audit.remark = '账号信息有误，请修改后再重新申请提现'
      this.rejectVisible = true
    },
    reject () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          let remark = this.audit.remark
          if (remark === '其他') {
            remark = this.audit.input
          }
          let params = {
            'id': this.audit.id,
            'rejectRemark': remark
          }
          applyWithdrawalReject(params).then(response => {
            this.$message({
              message: '驳回成功',
              type: 'success'
            })
            this.fetchData()
          })
          this.rejectVisible = false
        } else {
          return false
        }
      })
    }
  }
}
