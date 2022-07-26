import { getJoinList, updateAudit } from '@/api/chamber/manager'

export default {
  data() {
    var checkPass = (rule, value, callback) => {
      if (!/^\w*$/.test(value)) {
        return callback(new Error('密码只能由字母、数字和下划线"_"组成！'))
      } else {
        callback() // 必须加上这个，不然一直塞在验证状态
      }
    }
    var confirmPass = (rule, value, callback) => {
      if (!/^\w*$/.test(value)) {
        return callback(new Error('密码只能由字母、数字和下划线"_"组成！'))
      } if (value !== this.detailObj.temporaryPass) {
        return callback(new Error('两次输入密码不一致!'))
      } else {
        callback() // 必须加上这个，不然一直塞在验证状态
      }
    }
    var checkNumber = (rule, value, callback) => {
      if (!/(^[1-9]\d*$)/.test(value)) {
        return callback(new Error('必须是大于0的整数'))
      } else {
        callback() // 必须加上这个，不然一直塞在验证状态
      }
    }
    return {
      passDia: false,
      rejectDia: false,
      rejectRemark: '',
      detailVisible: false,
      query: {
        auditStatus: 0,
        settledSource: ''
      },
      pageSizes: [10, 20, 50, 100, 500],
      total: 0,
      list: [],
      currentpage: 1,
      limit: 10,
      listLoading: false,
      detailObj: {
        temporaryPass: '',
        confirmPassword: '',
        level: 0
      },
      rules: {
        temporaryPass: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, max: 20, message: '密码长度6-20位', trigger: 'blur' },
          { validator: checkPass, trigger: 'change' }
        ],
        confirmPassword: [
          { required: true, message: '确认密码不能为空', trigger: 'blur' },
          { validator: confirmPass, trigger: 'blur' }
        ],
        level: [
          { required: true, message: '排序不能为空', trigger: 'blur' },
          { validator: checkNumber, trigger: 'change' }
        ]
      }
    }
  },
  computed: {
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
      this.fetchData()
    },
    fetchData() {
      this.listLoading = true
      const { auditStatus, settledSource } = this.query
      let params = {
        auditStatus,
        pageSize: this.limit,
        page: this.currentpage,
        settledSource
      }
      getJoinList(params).then(response => {
        this.list = response.data.data.list
        this.total = response.data.data.totalRows
        this.listLoading = false
      })
    },
    detail(row) {
      this.detailObj = row
      this.detailVisible = true
    },
    enlarge(path) {
      var newwin = window.open()
      newwin.document.write('<img src="' + path + '"/>')
    },
    // 点击通过或驳回
    handlePassOrReject(row, num) {
      this.detailObj = row
      if (num === 1) {
        this.passDia = true
      } else {
        this.rejectRemark = ''
        this.rejectDia = true
      }
    },
    audit(e, row, type) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      if (type === 1) {
        this.$refs['detail'].validate((valid) => {
          if (valid) {
            this.passThrough(row)
          } else {
            return false
          }
        })
      } else if (type === 2) {
        this.rejectRemark += ''
        this.rejectRemark = this.rejectRemark.trim()
        if (!this.rejectRemark) return this.$message.error('请输入1-30字的驳回理由')
        this.reject(row)
      }
    },
    passThrough(row) {
      let params = {
        'chamberId': row.id,
        'password': this.detailObj.temporaryPass,
        'level': this.detailObj.level,
        'auditStatus': 1
      }
      updateAudit(params).then(res => {
        if (res.state !== 1) return this.$message.error(res.msg)
        this.$message({
          message: '通过成功',
          type: 'success'
        })
        this.passDia = false
        this.fetchData()
      })
    },
    reject(row) {
      this.$confirm('驳回后该商会将不予入驻平台', '确定驳回？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        let params = {
          'chamberId': row.id,
          'level': this.detailObj.level,
          'rejectRemark': this.rejectRemark,
          'auditStatus': 2
        }
        updateAudit(params).then(res => {
          if (res.state !== 1) return this.$message.error(res.msg)
          this.$message({
            message: '驳回成功',
            type: 'success'
          })
          this.rejectDia = false
          this.fetchData()
        })
      }).catch(() => {
        this.rejectDia = false
      })
    }
  }
}
