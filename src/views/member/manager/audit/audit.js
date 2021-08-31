import { auditList, updateAudit } from '@/api/member/manager'

export default {
  data() {
    return {
      visible: false,
      batchVisible: false,
      audit: {
        id: '',
        remark: '资料乱填'
      },
      query: {
        auditStatus: 0,
        phone: '',
        type: '',
        name: '',
        uname: ''
      },
      pageSizes: [10, 20, 50, 100, 500],
      total: 0,
      list: [],
      currentpage: 1,
      limit: 10,
      listLoading: false,
      selectionDatas: [],
      approveLoading: false,
      rejectLoading: false,
      showInput: false,
      rejectReason: ''
    }
  },
  computed: {
    /* nativePlaceStr () {
      return function (str) {
        return str.replace(new RegExp('-', 'gm'), '')
      }
    } */
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
      if (this.has('', '查询')) {
        this.fetchData()
      }
    },
    fetchData(e) {
      if (e !== undefined) {
        window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      }
      this.listLoading = true
      const params = {
        'ckey': this.$store.getters.ckey,
        'auditStatus': this.query.auditStatus,
        'pageSize': this.limit,
        'page': this.currentpage
      }
      auditList(params).then(response => {
        this.list = response.data.data.list
        this.total = response.data.data.totalRows
        this.listLoading = false
      })
    },
    detail(e, row) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      window.localStorage.setItem('memberaudit', this.$route.path)
      this.$router.push({ name: '会员详情', params: { 'memberDetail': row, 'querytype': '1' } })
    },
    batchApproved(e) {
      if (this.selectionDatas.length === 0) {
        this.$message.error({
          message: '没有选择记录，操作失败'
        })
        return
      }
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      const params = {
        'memberId': this.selectionDatas,
        'auditStatus': 1
      }
      updateAudit(params).then(response => {
        this.$message({
          message: '已通过',
          type: 'success'
        })
        this.fetchData()
      })
    },
    approved(e, row) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      const arr = []
      arr.push(row.id)
      const params = {
        'memberId': arr,
        'auditStatus': 1
      }
      this.approveLoading = true
      updateAudit(params).then(response => {
        this.$message({
          message: '已通过',
          type: 'success'
        })
        this.approveLoading = false
        this.fetchData()
      })
    },
    batchRejectRemark(e) {
      if (this.selectionDatas.length === 0) {
        this.$message.error({
          message: '没有选择记录，操作失败'
        })
        return
      }
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      this.audit.remark = '资料乱填'
      this.batchVisible = true
    },
    batchReject() {
      const params = {
        'memberId': this.selectionDatas,
        'auditStatus': 2,
        'remark': this.audit.remark
      }
      updateAudit(params).then(response => {
        this.$message({
          message: '已驳回',
          type: 'success'
        })
        this.fetchData()
      })
      this.batchVisible = false
    },
    rejectRemark(e, row) {
      window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
      if (row.id !== undefined) {
        this.audit.id = row.id
      }
      this.audit.remark = '资料乱填'
      this.visible = true
    },
    reject() {
      const arr = []
      arr.push(this.audit.id)
      const params = {
        'memberId': arr,
        'auditStatus': 2,
        'remark': this.audit.remark
      }
      updateAudit(params).then(response => {
        this.$message({
          message: '已驳回',
          type: 'success'
        })
        this.fetchData()
      })
      this.visible = false
    },
    handlerChange(value) {
      this.query.tradeType = value[value.length - 1]
    },
    handleSelectionChange(value) {
      const datas = value
      this.selectionDatas = []
      for (const data of datas) {
        this.selectionDatas.push(data.id)
      }
    },
    radioChange(val) {
      console.log(val)
      if (val === '其他') {
        this.showInput = true
      }
    }
  }
}
