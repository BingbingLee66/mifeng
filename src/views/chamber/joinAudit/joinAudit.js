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
      detailVisible: false,
      // 审核状态 0待审核 1通过 2驳回
      statusOptions: [
        { 'label': '待审核', 'value': 0 },
        { 'label': '通过', 'value': 1 },
        { 'label': '驳回', 'value': 2 },
        { 'label': '所有', 'value': -1 }
      ],
      query: {
        status: 0
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
      this.fetchData()
    },
    fetchData() {
      this.listLoading = true
      let auditStatus = this.query.status === -1 ? '' : this.query.status
      let params = {
        'auditStatus': auditStatus,
        'pageSize': this.limit,
        'page': this.currentpage
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
    enlarge (path) {
      var newwin = window.open()
      newwin.document.write('<img src="' + path + '"/>')
    },
    audit (e, row, type) {
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
        this.reject(row)
      }
    },
    passThrough (row) {
      let params = {
        'chamberId': row.id,
        'password': this.detailObj.temporaryPass,
        'level': this.detailObj.level,
        'auditStatus': 1
      }
      updateAudit(params).then(response => {
        this.$message({
          message: '通过成功',
          type: 'success'
        })
        this.detailVisible = false
        this.fetchData()
      })
    },
    reject (row) {
      this.$confirm('驳回后该商会将不予入驻平台', '确定驳回？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        let params = {
          'chamberId': row.id,
          'password': this.detailObj.temporaryPass,
          'level': this.detailObj.level,
          'auditStatus': 2
        }
        updateAudit(params).then(response => {
          this.$message({
            message: '驳回成功',
            type: 'success'
          })
          this.detailVisible = false
          this.fetchData()
        })
      }).catch(() => {
        this.detailVisible = false
      })
    }
  }
}
